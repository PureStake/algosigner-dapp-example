async function makeApplication(){
    await setupTx() 
    .then(async () => { 
        let txn = {
            type: 'appl',
            from: account.address,
            fee: txParams['fee'],
            firstRound: txParams['last-round'],
            lastRound: txParams['last-round'] + 1000,
            genesisID: txParams['genesis-id'],
            genesisHash: txParams['genesis-hash'],

            appIndex: 1
        };
        selfLog(`Prepared Application Tx: ${JSON.stringify(txn)}`);
        await sign(txn);
    }).catch((e) => {
        selfLog(e,'bad');
    });
}