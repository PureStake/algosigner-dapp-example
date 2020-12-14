async function sign(txn, returnFunc = undefined){
    // Sign the transaction using AlgoSigner
    // If we have a return function then use that
    // If we do not have a return function, but have send enabled, then send the transaction with AlgoSigner
    if(!useTxDefaults()){
        let tmp = await window.prompt("Please modify transaction",  JSON.stringify(txn));
        if(tmp != null){
            try {
                txn = JSON.parse(tmp);
                selfLog(`New Transaction:\n${JSON.stringify(txn)}`, 'good');  
            }
            catch {
                selfLog(`New transaction unable to parse to JSON correctly: ${tmp}`, 'bad');  
            }     
        }
    }
    await AlgoSigner.sign(txn)
    .then((d) => {
        selfLog(`Signed Tx:\n${JSON.stringify(d)}`,'good');
        signedTx = d;
        txId = d.txId;
        if(returnFunc){
            returnFunc(d);
        }
        else if(sendSignedTx()) {
            //Forcing testnet only to prevent accidental mainnet calls
            AlgoSigner.send({
                ledger: 'TestNet',
                tx: d.blob
            }).then((tx) =>{
                selfLog(`Transaction Sent: ${JSON.stringify(tx)}`,'good');
            }).catch((e)=>{selfLog(e,'bad')});          
        }
    })
    .catch((e) => {
        selfLog(e,'bad');  
    });
}
async function signMultisig(txn, returnFunc = undefined){
    // Sign the transaction using AlgoSigner
    // If we have a return function then use that
    // If we do not have a return function, but have send enabled, then send the transaction with AlgoSigner
    if(!useTxDefaults()){
        let tmp = await window.prompt("Please modify transaction",  JSON.stringify(txn));
        if(tmp != null){
            try {
                txn = JSON.parse(tmp);
                selfLog(`New Transaction:\n${JSON.stringify(txn)}`, 'good');  
            }
            catch {
                selfLog(`New transaction unable to parse to JSON correctly: ${tmp}`, 'bad');  
            }     
        }
    }
    await AlgoSigner.signMultisig(txn)
    .then((d) => {
        selfLog(`Signed Tx:\n${JSON.stringify(d)}`,'good');
        signedTx = d;
        txId = d.txId;
        if(returnFunc){
            returnFunc(d);
        }
    })
    .catch((e) => {
        selfLog(e,'bad');  
    });
}