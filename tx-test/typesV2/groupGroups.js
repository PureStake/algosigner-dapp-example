async function sendGroupedBlobs(blobs){
    for(i in blobs) {
        await AlgoSigner.send({
            ledger: 'TestNet',
            tx: blobs[i]
        }).then((txns) =>{
            selfLog(`Transactions Sent: ${JSON.stringify(txns,toJsonReplace,1)}`,'good');
        }).catch((e)=>{selfLog(e,'bad')}); 
    }   
}

async function createGroupGroupsTxs(){
    await setupTx() 
    .then(async () => { 
        const numTotalTxns = 5
        let arrEven = [];
        let arrOdd = [];

        for(i=0; i<numTotalTxns; i++) {        
            const to = '2SLXGKWLIGSDDLC7RZY7DMGCXOAWMT6GAGO3AJM22T6Q4ZGYTNQHSOLSWA';
            const amount = Math.floor(Math.random() * 1000); 
            
            // If you have the parameters obtained via an API then convert them to the JS SDK version
            const tx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: account.address,
                to: to,
                amount: amount,
                suggestedParams: {...txParamsJS}
            });

            selfLog(`Prepared Pay Tx ${i}: ${JSON.stringify(tx,toJsonReplace,1)}`, 'info');
            
            // Split into 2 groups
            if(i % 2 === 0) {
                arrEven.push(tx);
            }
            else {
                arrOdd.push(tx);
            }
        }

        // Assign group ids
        algosdk.assignGroupID(arrEven);
        algosdk.assignGroupID(arrOdd);

        // Use the AlgoSigner encoding library to make the transactions base64
        let arrEvenB64 = arrEven.map((tx) => {
            return { txn: AlgoSigner.encoding.msgpackToBase64(tx.toByte()) };
        });
        let arrOddB64 = arrOdd.map((tx) => {
            return { txn: AlgoSigner.encoding.msgpackToBase64(tx.toByte()) };
        });

        await AlgoSigner.signTxn([arrEvenB64,arrOddB64])
        .then((d) => {       
            selfLog(`Signed transactions: ${JSON.stringify(d,toJsonReplace,1)}`,'good');

            if(sendSignedTx()) {
                let blobs = d.map(grp => {
                    let dBlobs = [];
                    let dByteLength = 0;
                    let dByteOffset = 0;

                    grp.map(sTxn=> {
                        const decodedBlob = new Uint8Array(atob(sTxn.blob).split("").map(x => x.charCodeAt(0)));
                        dBlobs.push(decodedBlob);
                        dByteLength += decodedBlob.byteLength;
                    });
                    let comboBlobs = new Uint8Array(dByteLength);
                    for(i in dBlobs) {
                        comboBlobs.set(new Uint8Array(dBlobs[i]), dByteOffset);
                        dByteOffset += dBlobs[i].byteLength;
                    }
                    return btoa(String.fromCharCode.apply(null, comboBlobs));
                })

                // Splits the send by group so that each will pass/fail independently
                sendGroupedBlobs(blobs);
            }
        });
    }).catch((e) => {
        selfLog(e,'bad');
    });
}