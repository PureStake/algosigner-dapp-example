async function acceptAsset(){   
    await setupTx() 
    .then(async () => { 
        let txn = {
            type: 'axfer',
            from: account.address,
            to: account.address,
            fee: txParams['fee'],
            firstRound: txParams['last-round'],
            lastRound: txParams['last-round'] + 1000,
            genesisID: txParams['genesis-id'],
            genesisHash: txParams['genesis-hash'],

            amount: 0,
            assetIndex: 1
        };
        selfLog(`Prepared Accept Tx: ${JSON.stringify(txn)}`);
        await sign(txn);
    }).catch((e) => {
        selfLog(e,'bad');
    })
}

async function transferAsset(){   
    await setupTx() 
    .then(async () => { 
        let txn = {
            type: 'axfer',
            from: account.address,
            to: "PBZHOKKNBUCCDJB7KB2KLHUMWCGAMBXZKGBFGGBHYNNXFIBOYI7ONYBWK4",
            fee: txParams['fee'],
            firstRound: txParams['last-round'],
            lastRound: txParams['last-round'] + 1000,
            genesisID: txParams['genesis-id'],
            genesisHash: txParams['genesis-hash'],
            
            amount: Math.floor(Math.random() * 10) + 1,
            assetIndex: 1
        };
        selfLog(`Prepared Transfer Tx: ${JSON.stringify(txn)}`);
        await sign(txn);
    }).catch((e) => {
        selfLog(e,'bad');
    });
}

async function clawbackAsset(){   
    await setupTx() 
    .then(async () => { 
        let txn = {
            type: 'axfer',
            from: account.address,
            to: account.address,
            fee: txParams['fee'],
            firstRound: txParams['last-round'],
            lastRound: txParams['last-round'] + 1000,
            genesisID: txParams['genesis-id'],
            genesisHash: txParams['genesis-hash'],
            
            amount: 1,
            assetIndex: 1,
            assetRevocationTarget: "PBZHOKKNBUCCDJB7KB2KLHUMWCGAMBXZKGBFGGBHYNNXFIBOYI7ONYBWK4"
        };
        selfLog(`Prepared Clawback Tx: ${JSON.stringify(txn)}`);
        await sign(txn);
    }).catch((e) => {
        selfLog(e,'bad');
    });
}