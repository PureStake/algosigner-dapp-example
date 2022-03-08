async function createPayTx(){
    await setupTx() 
    .then(async () => { 
        const to = '2SLXGKWLIGSDDLC7RZY7DMGCXOAWMT6GAGO3AJM22T6Q4ZGYTNQHSOLSWA';
        const amount = Math.floor(Math.random() * 10); 
        
        // If you have the parameters obtained via an API then convert them to the JS SDK version
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: account.address,
            to: to,
            amount: amount,
            suggestedParams: {...txParamsJS}
        });

        selfLog(`Prepared Pay Tx: ${JSON.stringify(txn,toJsonReplace,1)}`, 'info');

        // Use the AlgoSigner encoding library to make the transactions base64
        const txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());

        await AlgoSigner.signTxn([{txn: txn_b64}])
        .then((d) => {       
            selfLog(`Signed transaction: ${JSON.stringify(d,toJsonReplace,1)}`,'good');

            // First transaction debug check
            const primaryBlob = d[0]['blob'];
 
            if(sendSignedTx()) {
                //Forcing testnet only to prevent accidental mainnet calls
                AlgoSigner.send({
                    ledger: 'TestNet',
                    tx: primaryBlob
                }).then((tx) =>{
                    selfLog(`Transaction Sent: ${JSON.stringify(tx,toJsonReplace,1)}`,'good');
                }).catch((e)=>{selfLog(e,'bad')});          
            }
        });
    }).catch((e) => {
        selfLog(e,'bad');
    });
}