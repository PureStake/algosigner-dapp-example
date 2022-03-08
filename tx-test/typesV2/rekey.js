async function createRekeyTx(){
    // Example addresses here are located in rekeyAccounts.json 
    // The rekey from address needs to be added to AlgoSigner as a normal account

    // Since this example has been used repeatedly and the address is already rekeyed 
    // the rekeyNewAuthAddr needs to be added to AlgoSigner as a normal account
    await setupTx({address: 'MOVHS36NEOSDDFG4TEKROSVHNOLEKNCOMWDWNXBUIICEFMFGIYIK5XLHVE'}) 
    .then(async () => { 
        const rekeyNewAuthAddr = 'V7AIQECF5XS6W6JAPJUUFUKTGDJPKASQP67DT5P52HQBEP5N2E5FTBGYC4';
        let primaryBlob;

        // If you have the parameters obtained via an API then convert them to the JS SDK version
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: account.address,
            to: account.address,
            amount: 0,
            rekeyTo: rekeyNewAuthAddr,
            suggestedParams: {...txParamsJS}
        });

        selfLog(`Prepared Rekey Tx: ${JSON.stringify(txn,toJsonReplace,1)}`, 'info');

        // Use the AlgoSigner encoding library to make the transactions base64
        const txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());

        selfLog(`[WARNING]: authAddress being added to sign. This is not normally needed and is only used in this example because the address is already rekeyed.`, 'warning');
        const to_sign_txn = { txn: txn_b64, authAddr: rekeyNewAuthAddr }

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