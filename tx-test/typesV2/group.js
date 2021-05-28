async function createGroupPayTx() {
    // When true: will output much more transaction information as they are modified in the process
    const _EXTRA_LOGGING = false;
    // Choose to send with the sdk or via AlgoSigner
    const _SEND_WITH_SDK = false;

    // This uses the same test account seens in multisig v1     
    const _ADDR1 = 'LKBQQZQ7LQFNO5477GRPMY6UOGVJJOIN7WSIPY7YQIRAHKXVYQVT6EXOGY'
    const _ADDR2 = '2SLXGKWLIGSDDLC7RZY7DMGCXOAWMT6GAGO3AJM22T6Q4ZGYTNQHSOLSWA'
    const _ADDR3 = 'KQVFM6F6ZNPO76XGPNG7QT5E5UJK62ZFICFMMH3HI4GNWYZD5RFHGAJSPQ'
    const _MNO3 = 'silent cram muffin differ poet spoon two bench tray inmate ribbon slogan vacuum area amateur thought obvious arena kiwi turkey seminar flush consider abstract monster'

    // Setup the AlgoSigner authorized connection
    await setupTx() 
    .then(async () => { 
        // If you are using the SDK and have a client set you obtain parameters directly
        // let params = await client.getTransactionParams().do();

        // If you have the parameters obtained via an API then convert them to the JS SDK version
        params = {
            flatFee: false,
            fee: txParams['fee'],
            firstRound: txParams['last-round'],
            lastRound: txParams['last-round'] + 1000,
            genesisID: txParams['genesis-id'],
            genesisHash: txParams['genesis-hash']
        }
        let tx1 = new algosdk.Transaction({
            to: _ADDR3,
            from: _ADDR1,
            amount: 1,
            ...params,
        });
        let tx2 = new algosdk.Transaction({
            to: _ADDR2,
            from: _ADDR1,
            amount: 2,
            ...params,
        });
        let tx3 = new algosdk.Transaction({
            to: _ADDR1,
            from: _ADDR3,
            amount: 3,
            ...params,
        });
    
        // Group id assignment
        algosdk.assignGroupID([tx1, tx2, tx3]);
        let sdkTxs = [tx1, tx2, tx3];
        
        if(_EXTRA_LOGGING) {
            selfLog(JSON.stringify(sdkTxs),'extra')
        }
        
        // Use the AlgoSigner encoding library to make the transactions base64
        let base64Txs = sdkTxs.map((tx) => {
            return AlgoSigner.encoding.msgpackToBase64(tx.toByte());
        });
        
        // Map the transactions into the standard wallet format
        let walletTxs = base64Txs.map((b64) => {
            return { txn: b64 };
        });
    
        // Mark txn 3 as informational only in AlgoSigner
        walletTxs[2].signers = [];
    
        // Sign first two txns with AlgoSigner
        let signedTxs = await AlgoSigner.signTxn(walletTxs);
        
        // Sign last txn with SDK
        let acct = algosdk.mnemonicToSecretKey(_MNO3)
        let tx3result = tx3.signTxn(acct.sk);
    
        // Transform the blob results on transactions into Uint8Array
        let t1 = new Uint8Array(atob(signedTxs[0].blob).split("").map(x => x.charCodeAt(0)));
        let t2 = new Uint8Array(atob(signedTxs[1].blob).split("").map(x => x.charCodeAt(0)));
        let t3 = tx3result; // The result from signTxn is already Uint8Array

        selfLog(`Transaction Blob 1: ${signedTxs[0].blob}`,'info');
        selfLog(`Transaction Blob 2: ${signedTxs[1].blob}`,'info');
        selfLog(`Transaction Blob 3: ${btoa(String.fromCharCode.apply(null, t3))}`,'info');

        if(_SEND_WITH_SDK && sendSignedTx()) {
            // Set client
            const server = 'INSERT_SERVER_ADDRESS';
            const port = "";
            const token = {'X-API-Key': 'INSERT_API_KEY_HERE'};

            if((server === 'INSERT_SERVER_ADDRESS') || (token['X-API-Key'] === 'INSERT_API_KEY_HERE')) {
                selfLog(`You must declare server, token, and port to use SDK send.`,'bad');
                return;
            }

            let client = new algosdk.Algodv2(token, server, port);

            // SDK uses an array of Uint8Array values
            let grouped_txns = [t1,t2,t3];
            let sendResult = await client
            .sendRawTransaction(grouped_txns)
            .do().catch((x)=>{
                selfLog(`Send failed ${JSON.stringify(x)}`,'bad');
            });

            if(sendResult) {
                selfLog(JSON.stringify(sendResult),'good');
            }
            else {
                selfLog('No result from send.','bad');
            }
        }
        else if(sendSignedTx()) {
            // API and AlgoSigner use combined Uint8Arrays in base64 
            let combined_decoded_txns = new Uint8Array(t1.byteLength + t2.byteLength + t3.byteLength); 
            combined_decoded_txns.set(t1, 0);
            combined_decoded_txns.set(t2, t1.byteLength);
            combined_decoded_txns.set(t3, t1.byteLength + t2.byteLength);
    
            // Convert the combined array values back to base64
            const grouped_txns_64b = btoa(String.fromCharCode.apply(null, combined_decoded_txns));
    
            AlgoSigner.send({
                ledger: 'TestNet',
                tx: grouped_txns_64b
            }).then((tx) =>{
                selfLog(JSON.stringify(tx),'good');
            }).catch((e)=>{selfLog(JSON.stringify(e),'bad')});
        } 
    });
}