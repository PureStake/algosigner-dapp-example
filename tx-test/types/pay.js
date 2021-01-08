async function createPayTx(){
    await setupTx() 
    .then(async () => { 
        let amount = Math.floor(Math.random() * 10); 
        let txn = {
            type: 'pay',
            from: account.address,
            to: "PBZHOKKNBUCCDJB7KB2KLHUMWCGAMBXZKGBFGGBHYNNXFIBOYI7ONYBWK4",
            fee: txParams['fee'], 
            firstRound: txParams['last-round'],
            lastRound: txParams['last-round'] + 1000,
            genesisID: txParams['genesis-id'],
            genesisHash: txParams['genesis-hash'],

            amount: amount
        };
        selfLog(`Prepared Pay Tx: ${JSON.stringify(txn)}`);
        await sign(txn);
    }).catch((e) => {
        selfLog(e,'bad');
    });
}