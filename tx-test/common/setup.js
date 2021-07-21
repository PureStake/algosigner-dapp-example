let txParams = undefined;
let txParamsJS = undefined;
let account = undefined;
let logContainer = undefined;
let signedTx;
let txId = '';
let hideDebugMsgs = true;

async function statusCheck(){
    await AlgoSigner.algod({
        ledger: 'TestNet',
        path: '/v2/status'
    })
    .then((d) => {  
        selfLog(`Status: ${JSON.stringify(d)}`);
    })
    .catch((e) => {
        console.error(e);
        selfLog(JSON.stringify(e));
    });
}

async function getTestNetPrimaryAccount(){
    await AlgoSigner.accounts({ledger: 'TestNet'})
    .then((d) => {
        if(d && d.length > 0){
            selfLog(`Account found: ${JSON.stringify(d[0])}`);
            account = d[0];
        }
        else{
            throw('Primary test account not found in AlgoSigner.');
        }
    })
    .catch((e) => {
        selfLog(JSON.stringify(e),'bad');
    });
}

async function getParams(){
    await AlgoSigner.algod({
        ledger: 'TestNet',
        path: '/v2/transactions/params'
    })
    .then((d) => {
        selfLog(`Tx Params: ${JSON.stringify(d)}`);
        txParams = d;
        if(txParams) {
            // Creating copy of parameters obtained via an API in a converted state for JS Algosdk use
            txParamsJS = {
                flatFee: false,
                fee: txParams['fee'],
                firstRound: txParams['last-round'],
                lastRound: txParams['last-round'] + 1000,
                genesisID: txParams['genesis-id'],
                genesisHash: txParams['genesis-hash']
            }
        }
    })
    .catch((e) => {
        selfLog(JSON.stringify(e),'bad');
    });
}

async function setupTx(){
    if(AlgoSigner && account && txParams){
        return;
    }

    selfLog(`Setting up connection, account, and transaction parameters.`);
    await AlgoSigner.connect()
    .then(async () => {
        selfLog(`Connected to Algosigner:${JSON.stringify(Object.entries(AlgoSigner).map(([key, value]) => [key, typeof value]))}`);
        await statusCheck();
    }).then(async () => {   
        await getParams();
    }).then(async () => {      
        await getTestNetPrimaryAccount();
    })
    
}