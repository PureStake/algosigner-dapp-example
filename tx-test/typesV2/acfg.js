async function createAsset(){   
    await setupTx() 
    .then(async () => { 
        const amount = (Math.floor(Math.random() * 5) ** 10) + 1;
        const unitName = 'xxxx'.replace(/[x]/g, () => {return (Math.random() * 16 | 0).toString(16)});
        const assetName = 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => {return (Math.random() * 16 | 0).toString(16)});

        const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
            from: account.address,
            total: amount,
            decimals: 0,
            manager: account.address,
            reserve: account.address,
            freeze: account.address,
            clawback: account.address,
            unitName:  unitName,
            assetName: assetName,
            suggestedParams: {...txParamsJS}
        });

        selfLog(`Prepared Asset Create Txn: ${JSON.stringify(txn,toJsonReplace,1)}`, 'info');
        
        // Use the AlgoSigner encoding library to make the transactions base64
        const txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());

        await AlgoSigner.signTxn([{txn: txn_b64}])
        .then((d) => {       
            selfLog(`Signed transaction: ${JSON.stringify(d,toJsonReplace,1)}`,'good');

            // First transaction debug check
            const primaryBlob = d[0]['blob'];
            const byteBlob = AlgoSigner.encoding.stringToByteArray(atob(primaryBlob));
            selfLog(`${JSON.stringify(algosdk.decodeObj(byteBlob),toJsonReplace,1)}`, 'debug');

            if(sendSignedTx()) {
                //Forcing testnet only to prevent accidental mainnet calls
                AlgoSigner.send({
                    ledger: 'TestNet',
                    tx: d.blob
                }).then((tx) =>{
                    selfLog(`Transaction Sent: ${JSON.stringify(tx,toJsonReplace,1)}`,'good');
                }).catch((e)=>{selfLog(e,'bad')});          
            }
        })
        .catch(e => {selfLog(`Sign error ${e}`,'bad')});
    }).catch((e) => {
        selfLog(e,'bad');
    });
}

async function modifyAsset(){   
    await setupTx() 
    .then(async () => { 
        let txn = algosdk.makeAssetConfigTxnWithSuggestedParamsFromObject({
            from: account.address,
            assetIndex: 1530000,
            manager: account.address,
            freeze: account.address,
            clawback: account.address,
            reserve: account.address,
            suggestedParams: {...txParamsJS}
        });

        selfLog(`Prepared Asset Config Txn: ${JSON.stringify(txn,toJsonReplace,1)}`);
        
        // Use the AlgoSigner encoding library to make the transactions base64
        let txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());

        await AlgoSigner.signTxn([{txn: txn_b64}])
        .then((d) => {       
            selfLog(`Signed transaction: ${JSON.stringify(d,toJsonReplace,1)}`,'good');

            // First transaction debug check
            const primaryBlob = d[0]['blob'];
            const byteBlob = AlgoSigner.encoding.stringToByteArray(atob(primaryBlob));
            selfLog(`${JSON.stringify(algosdk.decodeObj(byteBlob),toJsonReplace,1)}`, 'debug');

            if(sendSignedTx()) {
                //Forcing testnet only to prevent accidental mainnet calls
                AlgoSigner.send({
                    ledger: 'TestNet',
                    tx: d.blob
                }).then((tx) =>{
                    selfLog(`Transaction Sent: ${JSON.stringify(tx,toJsonReplace,1)}`,'good');
                }).catch((e)=>{selfLog(e,'bad')});          
            }
        })
        .catch(e => {selfLog(`Sign error ${e}`,'bad')});
    }).catch((e) => {
        selfLog(e,'bad');
    });
}

async function destroyAsset(){   
    await setupTx() 
    .then(async () => { 
        let txn = algosdk.makeAssetDestroyTxnWithSuggestedParamsFromObject({
            from: account.address,
            assetIndex: 1530000,
            suggestedParams: {...txParamsJS}
        });

        selfLog(`Prepared Asset Destroy Txn: ${JSON.stringify(txn,toJsonReplace,1)}`);
        
        // Use the AlgoSigner encoding library to make the transactions base64
        let txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());

        await AlgoSigner.signTxn([{txn: txn_b64}])
        .then((d) => {       
            selfLog(`Signed transaction: ${JSON.stringify(d,toJsonReplace,1)}`,'good');

            // First transaction debug check
            const primaryBlob = d[0]['blob'];
  
            if(sendSignedTx()) {
                // Purposely not deleting to prevent accidental deletes
                selfLog('Delete transactions are not sent in this test tool by design.', 'bad')      
            }
        })
        .catch(e => {selfLog(`Sign error ${e}`,'bad')});
    }).catch((e) => {
        selfLog(e,'bad');
    });
}