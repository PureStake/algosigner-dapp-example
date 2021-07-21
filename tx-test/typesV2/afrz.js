async function freezeAsset(){   
    await setupTx() 
    .then(async () => { 
        const { addr: freezeTarget } = algosdk.generateAccount();
        const txn = algosdk.makeAssetFreezeTxnWithSuggestedParamsFromObject({
            from: account.address,
            assetIndex: 1530000,
            freezeTarget: freezeTarget,
            freezeState: false,
            suggestedParams: {...txParamsJS}
        });

        selfLog(`Prepared Asset Freeze Txn: ${JSON.stringify(txn,toJsonReplace,1)}`, 'info');
        
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
        .catch(e => {selfLog(e,'bad')});
    }).catch((e) => {
        selfLog(e,'bad');
    });
}