// Helper used with JSON.stringify that replaces Uint8Array data with ascii text for display
function _toJsonReplace(key, value) {    
    // Return value immediately if null or undefined
    if(value === undefined || value === null){
        return value;
    }

    // Check for uint8 arrays to get buffer for print
    if(value instanceof Uint8Array || (typeof(value)==='object' && value instanceof Array && value.length > 0 && typeof(value[0]) === 'number')){
        return btoa(value);
    }

    // Check for literal string match on object type to cycle further into the recursive replace
    if(typeof(value) === '[object Object]'){
        return JSON.stringify(value,_toJsonReplace,2);
    } 

    // Return without modification
    return value;
}

// Groups 2 transactions. Both from the same account address. 
// With multiple accounts in AlgoSigner this could be modified, 
// or one of the transactions could be from another source. 
async function createGroupPayTx() {
    // When true: will output much more transaction information as they are modified in the process
    const _EXTRA_LOGGING = false;

    // Setup the AlgoSigner authorized connection
    await setupTx() 
    .then(async () => { 
        // Using a random amount to not block subsequent attempts
        const amount = (Math.floor(Math.random() * 1000) + 1); 
        let txn1 = {
            type: 'pay',
            from: account.address,
            to: "PBZHOKKNBUCCDJB7KB2KLHUMWCGAMBXZKGBFGGBHYNNXFIBOYI7ONYBWK4",
            fee: txParams['fee'], 
            firstRound: txParams['last-round'],
            lastRound: txParams['last-round']+1000,
            genesisID: txParams['genesis-id'],
            genesisHash: txParams['genesis-hash'],
            amount: amount
        };
        if(_EXTRA_LOGGING) selfLog(`Transaction 1:\n${JSON.stringify(txn1)}`,'extra');

        // To show a multiple AlgoSigner signs we are using the same from account address to the same random to address
        // We will have to increase the amount by 1 so it doesn't flag as the same transaction
        let txn2 = {
            type: 'pay',
            from: account.address,
            to: "PBZHOKKNBUCCDJB7KB2KLHUMWCGAMBXZKGBFGGBHYNNXFIBOYI7ONYBWK4",
            fee: txParams['fee'], 
            firstRound: txParams['last-round'],
            lastRound: txParams['last-round']+1000,
            genesisID: txParams['genesis-id'],
            genesisHash: txParams['genesis-hash'],
            amount: (amount + 1)
        };
        if(_EXTRA_LOGGING) selfLog(`Transaction 2:\n${JSON.stringify(txn2)}`,'extra');
        
        // Use the sdk to assign a group id
        let txngroup = await algosdk.assignGroupID([
            txn1,
            txn2
        ]);
        if(_EXTRA_LOGGING) selfLog(`Group Transactions from algosdk:\n${JSON.stringify(txngroup,_toJsonReplace,2)}`,'extra');

        // Modify the group fields in orginal transactions to be base64 encoded strings
        txn1.group = txngroup[0].group.toString('base64');
        txn2.group = txngroup[1].group.toString('base64');

        // Log the transactions
        selfLog(`Prepared Transaction 1:\n${JSON.stringify(txn1)}`);
        selfLog(`Prepared Transaction 2:\n${JSON.stringify(txn2)}`);

        // Ask for sign for the original created transactions. If one was already signed we only need one signature here.
        var signed1,signed2;
        await sign(txn1,(d)=>{signed1 = d;});
        await sign(txn2,(d)=>{signed2 = d;});

        // If we rejected a sign then just return.
        if(!(signed1 && signed2)){
            return;
        }

        // Get the decoded binary Uint8Array values from the blobs
        const decoded_1 = new Uint8Array(atob(signed1.blob).split("").map(x => x.charCodeAt(0)));
        if(_EXTRA_LOGGING) selfLog(`Binary values for transaction 1:\n${decoded_1}`,'extra');
        const decoded_2 = new Uint8Array(atob(signed2.blob).split("").map(x => x.charCodeAt(0)));
        if(_EXTRA_LOGGING) selfLog(`Binary values for transaction 2:\n${decoded_2}`,'extra');

        // Use their combined length to create a 3rd array
        let combined_decoded_txns = new Uint8Array(decoded_1.byteLength + decoded_2.byteLength); 

        // Starting at the 0 position, fill in the binary for the first object
        combined_decoded_txns.set(new Uint8Array(decoded_1), 0);
        // Starting at the first object byte length, fill in the 2nd binary value
        combined_decoded_txns.set(new Uint8Array(decoded_2), decoded_1.byteLength);
        if(_EXTRA_LOGGING) selfLog(`Combined binary values:${combined_decoded_txns}`,'extra');

        // Modify our combined array values back to an encoded 64bit string
        const grouped_txns = btoa(String.fromCharCode.apply(null, combined_decoded_txns));
        if(_EXTRA_LOGGING) selfLog(`Combined grouped transactions:\n${JSON.stringify(grouped_txns)}`,'extra');

        // Use AlgoSigner to send this grouped atomic transaction to the Algorand test netork
        if(sendSignedTx()) {
            AlgoSigner.send({
                ledger: 'TestNet',
                tx: grouped_txns
            }).then((tx) =>{
                selfLog(JSON.stringify(tx),'good');
            }).catch((e)=>{selfLog(JSON.stringify(e),'bad')});
        }
    }).catch((e) => {
        selfLog(e,'bad');  
    });
}