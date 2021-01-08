async function freezeAsset(){   
    await setupTx() 
    .then(async () => { 
        let txn = {
            type: 'afrz',
            from: account.address,
            fee: txParams['fee'],
            firstRound: txParams['last-round'],
            lastRound: txParams['last-round'] + 1000,
            genesisID: txParams['genesis-id'],
            genesisHash: txParams['genesis-hash'],
            
            assetIndex: 1,
            freezeAccount: "PBZHOKKNBUCCDJB7KB2KLHUMWCGAMBXZKGBFGGBHYNNXFIBOYI7ONYBWK4",
            freezeState: true
        };
        selfLog(`Prepared Freeze Tx: ${JSON.stringify(txn)}`);
        await sign(txn);
    }).catch((e) => {
        selfLog(e,'bad');
    });
}