async function createRekeyedPayTx(){
    // Example addresses here are located in rekeyAccounts.json 
    // The rekey from account needs to be added to AlgoSigner and may be a reference or normal account
    // The authAddr needs to be added to AlgoSigner as a normal account
    await setupTx({address: 'MOVHS36NEOSDDFG4TEKROSVHNOLEKNCOMWDWNXBUIICEFMFGIYIK5XLHVE'}) 
    .then(async () => { 
        const authAddr = 'V7AIQECF5XS6W6JAPJUUFUKTGDJPKASQP67DT5P52HQBEP5N2E5FTBGYC4';
        const to = 'LKBQQZQ7LQFNO5477GRPMY6UOGVJJOIN7WSIPY7YQIRAHKXVYQVT6EXOGY';
        const amount = Math.floor(Math.random() * 1000000 + 1000); 
        let primaryBlob;

        // If you have the parameters obtained via an API then convert them to the JS SDK version
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: account.address,
            to: to,
            amount: amount,
            suggestedParams: {...txParamsJS}
        });

        selfLog(`Prepared Rekeyed Pay Tx: ${JSON.stringify(txn,toJsonReplace,1)}`, 'info');

        // Use the AlgoSigner encoding library to make the transactions base64
        const txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());

        // The authAddr field will be used to sign
        // and a warning will be shown if the chain authorized address doesn't match
        const to_sign_txn = { txn: txn_b64, authAddr: authAddr }

        await AlgoSigner.signTxn([to_sign_txn])
        .then((d) => {       
            selfLog(`Signed transaction: ${JSON.stringify(d,toJsonReplace,1)}`,'good');
            
            if(Array.isArray(d)){
                // First transaction debug check
                primaryBlob = d[0]['blob'];
            }
            else {
                primaryBlob = d['blob'];
            }
            selfLog(`primaryBlob: ${primaryBlob}`);    
        });

        if(sendSignedTx()) {
            //Forcing testnet only to prevent accidental mainnet calls
            AlgoSigner.send({
                ledger: 'TestNet',
                tx: primaryBlob
            }).then((tx) =>{
                selfLog(`Transaction Sent: ${JSON.stringify(tx,toJsonReplace,1)}`,'good');
            }).catch((e)=>{selfLog(e,'bad')});          
        }
    }).catch((e) => {
        selfLog(e,'bad');
    });
}