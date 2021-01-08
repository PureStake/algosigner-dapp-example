async function createAsset(){   
    await setupTx() 
    .then(async () => {   
        let txn = {
            type: 'acfg',
            from: account.address,
            fee: txParams['fee'],
            firstRound: txParams['last-round'],
            lastRound: txParams['last-round'] + 1000,
            genesisID: txParams['genesis-id'],
            genesisHash: txParams['genesis-hash'],

            assetTotal: 1000,
            assetDecimals: 0,
            assetDefaultFrozen: false,
            assetUnitName:  'xxxx'.replace(/[x]/g, () => {return (Math.random() * 16 | 0).toString(16)}),
            assetName: 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => {return (Math.random() * 16 | 0).toString(16)}),
            assetManager: account.address,
            assetFreeze: account.address,
            assetClawback: account.address,
        };
        selfLog(`Prepared Create Tx: ${JSON.stringify(txn)}`);
        await sign(txn);
    })
    .catch((e) => {
        selfLog(JSON.stringify(e));
    });
}

async function modifyAsset(){   
    await setupTx() 
    .then(async () => {  
        let txn = {
            type: 'acfg',
            from: account.address,
            fee: txParams['fee'],
            firstRound: txParams['last-round'],
            lastRound: txParams['last-round'] + 1000,
            genesisID: txParams['genesis-id'],
            genesisHash: txParams['genesis-hash'],
            
            assetIndex: 1,
            assetDecimals: 1
        };
        selfLog(`Prepared Modify Tx: ${JSON.stringify(txn)}`);
        await sign(txn);
    })
    .catch((e) => {
        selfLog(JSON.stringify(e));
    });
}

async function destroyAsset(){   
    await setupTx() 
    .then(async () => { 
        let txn = {
            type: 'acfg',
            from: account.address,
            fee: txParams['fee'],
            firstRound: txParams['last-round'],
            lastRound: txParams['last-round'] + 1000,
            genesisID: txParams['genesis-id'],
            genesisHash: txParams['genesis-hash'],
            
            assetIndex: 1
        };
        selfLog(`Prepared Destroy Tx: ${JSON.stringify(txn)}`);
        await sign(txn);
    })
    .catch((e) => {
        selfLog(e,'bad');
    });
}