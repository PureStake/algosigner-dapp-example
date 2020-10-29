async function sign(txn){

    if(!useTxDefaults()){
        let tmp = await window.prompt("Please modify transaction",  JSON.stringify(txn));
        if(tmp != null){
            try {
                txn = JSON.parse(tmp);
                selfLog(`New Transaction: ${JSON.stringify(txn)}`, 'good');  
            }
            catch {
                selfLog(`New transaction unable to parse to JSON correctly: ${tmp}`, 'bad');  
            }     
        }
    }
    await AlgoSigner.sign(txn)
    .then((d) => {
        selfLog(`Signed Tx:${JSON.stringify(d)}`,'good');
        signedTx = d;
        txId = d.txId;
    })
    .catch((e) => {
        selfLog(JSON.stringify(e),'bad');
    });
}