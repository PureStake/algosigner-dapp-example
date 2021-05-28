
async function makeApplication(){
    selfLog(`Algosdk keys: ${Object.keys(algosdk)}`)

    await setupTx() 
    .then(async () => {   
        // let txn = {
        //     type: 'appl',
        //     from: account.address,
        //     fee: txParams['fee'],
        //     firstRound: txParams['last-round'],
        //     lastRound: txParams['last-round'] + 1000,
        //     genesisID: txParams['genesis-id'],
        //     genesisHash: txParams['genesis-hash'],

        //     appIndex: 1
        // };
        try {
            let numLocalInts = 1; 
            let numLocalByteSlices = 1; 
            let numGlobalInts = 1;
            let numGlobalByteSlices = 0; 
            let approvalProgram = new Uint8Array(atob("ASABACI=").split("").map(x => x.charCodeAt(0)));
            let clearProgram = undefined;
            let onComplete = undefined;

            selfLog(`txParams: ${JSON.stringify(txParams)}`);
            let suggestedParams = {
                fee: txParams['fee'],
                firstRound: txParams['last-round'],
                lastRound: txParams['last-round'] + 1000,
                genesisID: txParams['genesis-id'],
                genesisHash: txParams['genesis-hash']
            };

            let applcreate = algosdk.makeApplicationCreateTxn(account.address, suggestedParams, onComplete, 
                approvalProgram, clearProgram, numLocalInts, numLocalByteSlices, numGlobalInts, 
                numGlobalByteSlices);

           //let fjkd = algosdk.encodeObj(applcreate);
           let fjkd = algosdk.encodeUnsignedTransaction(applcreate);
           selfLog(`fjkd Application Create Tx: ${JSON.stringify(fjkd)}`);

            //selfLog(`Removing "name" and "tag" fields from applcreate`);
            //applcreate.name = undefined;
            //applcreate.tag = undefined;
            //delete person.age
            
            //applcreate.from = account.address;

            let ttxn = {
                'type': 'pay', 
                'from': 'YBZ7UIDL34AKFTFXZ5KHCLQQKG62VOIBLFSAEILQE57N3GEBUUQ3W4NYUA', 
                'to': '2SLXGKWLIGSDDLC7RZY7DMGCXOAWMT6GAGO3AJM22T6Q4ZGYTNQHSOLSWA', 
                'amount': 2110, 
                'fee': 0, 
                'firstRound': suggestedParams.firstRound, 
                'lastRound': suggestedParams.lastRound,           
                'genesisID': suggestedParams.genesisID, 
                'genesisHash': suggestedParams.genesisHash,           
                // 'note': undefined, 
                // 'group': undefined, 
                // 'lease': undefined,         
                // 'reKeyTo': undefined,          
                // 'closeRemainderTo': undefined
            }

            selfLog(`Prepared Application Create Tx: ${JSON.stringify(ttxn)}`);
            await sign(ttxn);      
        }
        catch(e) {
            selfLog(`Rawrs: ${e}`)
        }
        // selfLog(`Prepared Application Tx: ${JSON.stringify(txn)}`);
        // await sign(txn);
    }).catch((e) => {
        selfLog(e,'bad');
    });
}