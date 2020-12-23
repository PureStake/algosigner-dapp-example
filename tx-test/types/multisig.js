// Helper used with JSON.stringify that replaces Uint8Array data with ascii text for display
function _toJsonReplace(key, value) {    
    // Return value immediately if null or undefined
    if(value === undefined || value === null){
        return value;
    }

    // Check for uint8 arrays to get buffer for print
    if(value instanceof Uint8Array || (typeof(value)==='object' && value instanceof Array && value.length > 0 && typeof(value[0]) === 'number')){
        let wasUpdated = false;
        try {
            let newvalue = algosdk.encodeAddress(value);
            if(algosdk.isValidAddress(newvalue)){
                value = newvalue;
                wasUpdated = true;
            }
        }
        catch(e){
            // Ignore as this error since it is just display related and a forced decode and fallback to a normal base64 to ascii         
        }

        if(!wasUpdated){
            value = btoa(String.fromCharCode.apply(null, value));
        }

        return value;
    }

    // Check for literal string match on object type to cycle further into the recursive replace
    if(typeof(value) === '[object Object]'){
        return JSON.stringify(value,_toJsonReplace,2);
    } 

    // Return without modification
    return value;
}

async function algosignAppendAlgosdk(ms){
    const _APPEND_MERGE_WITH_ALGOSIGNER = true;

    let amount = (Math.floor(Math.random() * 1000) + 1);
    
    // This is to demonstrate that the post mulstig image (v,thr,subsig) is accepted in AlgoSigner
    let msig = {
        subsig: [
            {
                "pk": ms.account1.addr
            },
            {
                "pk": ms.account2.addr
            },
            {
                "pk": ms.account3.addr
            }
        ],
        thr: 2,
        v: 1
    }
    let mstx = { 
        msig: msig,
        txn: {
            type: "pay",
            from: ms.multisigAddr,
            to: "7GBK5IJCWFPRWENNUEZI3K4CSE5KDIRSR55KWTSDDOBH3E3JJCKGCSFDGQ",
            amount: amount,
            fee: txParams['fee'], 
            firstRound: txParams['last-round'],
            lastRound: txParams['last-round']+1000,
            genesisID: txParams['genesis-id'],
            genesisHash: txParams['genesis-hash']
        }
    }

    // Ask for sign for the both accounts above.
    var signedStep1,signedStep2;
    await signMultisig(mstx,(d)=>{signedStep1 = d;});

    var from64bit_T1 = new Uint8Array(atob(signedStep1.blob).split("").map(x => x.charCodeAt(0)));
    selfLog(`Transaction 1:\n${JSON.stringify(algosdk.decodeObj(from64bit_T1),_toJsonReplace,0)}`,'extra');

    let account2_sk = algosdk.mnemonicToSecretKey(ms.account2.mno).sk; 
    let preimg = {
        version: msig.v,
        threshold: msig.thr,
        addrs: ms.mparams.addrs
    };

    let returnBlob;
    if(_APPEND_MERGE_WITH_ALGOSIGNER) {
        let newmsig = JSON.stringify(algosdk.decodeObj(from64bit_T1).msig,_toJsonReplace,0);
        selfLog(`Newmsig:\n${newmsig}`, 'extra')

        mstx.msig = JSON.parse(newmsig);
        await signMultisig(mstx,(d)=>{signedStep2 = d;});

        let from64bit_T2 = new Uint8Array(atob(signedStep2.blob).split("").map(x => x.charCodeAt(0)));
        selfLog(`Transaction 2:\n${JSON.stringify(algosdk.decodeObj(from64bit_T2),_toJsonReplace,0)}`,'extra');

        returnBlob = algosdk.mergeMultisigTransactions([from64bit_T1, from64bit_T2])
    }
    else {
        signedStep2 = await algosdk.appendSignMultisigTransaction(from64bit_T1, preimg, account2_sk); 
        selfLog(`Transaction 2 appended:\n${JSON.stringify(algosdk.decodeObj(signedStep2.blob),_toJsonReplace,0)}`,'extra');
        returnBlob = signedStep2.blob;
    } 

    // If we rejected a sign then just return.
    if(!(signedStep1 && signedStep2)){
        return;
    }
    return btoa(String.fromCharCode.apply(null, returnBlob));
}

async function algosdkMergeAlgoSigner(ms){
    let amount = (Math.floor(Math.random() * 1000) + 1); 
    // Here we show that you can use the pre image multisig values in AlgoSigner (version,threshold,addrs)
    let mstx = { 
        msig: ms.mparams,
        txn: {
            type: "pay",
            from: ms.multisigAddr,
            to: "7GBK5IJCWFPRWENNUEZI3K4CSE5KDIRSR55KWTSDDOBH3E3JJCKGCSFDGQ",
            amount: amount,
            fee: txParams['fee'], 
            firstRound: txParams['last-round'],
            lastRound: txParams['last-round']+1000,
            genesisID: txParams['genesis-id'],
            genesisHash: txParams['genesis-hash']
        }
    }

    // Ask for sign for the both accounts above.
    var signedStep1,signedStep2;
    let account3_sk = algosdk.mnemonicToSecretKey(ms.account3.mno).sk; 
    let preimg = {
        version: ms.mparams.version,
        threshold: ms.mparams.threshold,
        addrs: ms.mparams.addrs
    };

    signedStep1 = await algosdk.signMultisigTransaction(new algosdk.Transaction({...mstx.txn}), preimg, account3_sk); 
    selfLog(`Transaction 1:\n${JSON.stringify(algosdk.decodeObj(signedStep1.blob),_toJsonReplace,0)}`,'extra');

    await signMultisig(mstx,(d)=>{signedStep2 = d;});

    if(!(signedStep1 && signedStep2)){
        return;
    }

    var from64bit = new Uint8Array(atob(signedStep2.blob).split("").map(x => x.charCodeAt(0)));
    let merged = algosdk.mergeMultisigTransactions([signedStep1.blob, from64bit])

    selfLog(`Merged:\n${JSON.stringify(algosdk.decodeObj(merged),_toJsonReplace,0)}`,'extra');
    return btoa(String.fromCharCode.apply(null, merged));
}

// Sign a multisig transaction
async function createMultisigTx() {
    // When true: will output much more transaction information as they are modified in the process
    const _EXTRA_LOGGING = true;
    const _USE_SDK_APPEND = true;

    // Setup the AlgoSigner authorized connection
    await setupTx() 
    .then(async () => { 
        // Test account information
        const ms = {
            account1: {
                addr: "LKBQQZQ7LQFNO5477GRPMY6UOGVJJOIN7WSIPY7YQIRAHKXVYQVT6EXOGY",
                sk: "189,109,20,49,69,163,31,191,72,133,27,89,89,235,176,26,245,126,44,202,15,178,160,53,154,245,69,195,73,167,133,108,90,131,8,102,31,92,10,215,119,159,249,162,246,99,212,113,170,148,185,13,253,164,135,227,248,130,34,3,170,245,196,43",
                mno: "response faculty obtain crowd dismiss cool clean breeze clinic pulp flash faculty worth mention layer rare reduce hand width crowd near hawk goddess about sail"
            },
            account2: {
                addr: "2SLXGKWLIGSDDLC7RZY7DMGCXOAWMT6GAGO3AJM22T6Q4ZGYTNQHSOLSWA",
                sk: "194,20,102,13,48,68,127,196,116,49,5,226,196,151,112,75,221,221,39,128,179,39,60,166,191,102,53,167,140,12,31,145,212,151,115,42,203,65,164,49,172,95,142,113,241,176,194,187,129,102,79,198,1,157,176,37,154,212,253,14,100,216,155,96",
                mno: "obscure obscure allow drink write country merry ahead ordinary gallery reunion start roof antique orchard chicken shy write rebuild infant bone segment material above treat"
            },
            account3: {
                addr: "KQVFM6F6ZNPO76XGPNG7QT5E5UJK62ZFICFMMH3HI4GNWYZD5RFHGAJSPQ",
                sk: "67,142,76,34,221,147,83,74,119,29,21,61,23,29,114,191,76,120,45,244,224,224,197,220,194,246,170,206,97,103,233,229,84,42,86,120,190,203,94,239,250,230,123,77,248,79,164,237,18,175,107,37,64,138,198,31,103,71,12,219,99,35,236,74",
                mno: "silent cram muffin differ poet spoon two bench tray inmate ribbon slogan vacuum area amateur thought obvious arena kiwi turkey seminar flush consider abstract monster"
            },
            multisigAddr: "DZ7POUYOOYW4PEKD3LZE7ZZTBT5JGIYZ3M7VECEPZ2HLHE7RGTGJIORBCI",
            mparams: {
                version: 1,
                threshold: 2,
                addrs: [
                    "LKBQQZQ7LQFNO5477GRPMY6UOGVJJOIN7WSIPY7YQIRAHKXVYQVT6EXOGY",
                    "2SLXGKWLIGSDDLC7RZY7DMGCXOAWMT6GAGO3AJM22T6Q4ZGYTNQHSOLSWA",
                    "KQVFM6F6ZNPO76XGPNG7QT5E5UJK62ZFICFMMH3HI4GNWYZD5RFHGAJSPQ"
                ]
            }
        }

        let signedBlob;
        if(_USE_SDK_APPEND) {
            // This will get a blob to send by using AlgoSigner for one signature, then appending another afterwards
            signedBlob = await algosignAppendAlgosdk(ms);
        }
        else {
            // This weill demonstrate multiple AlgoSigner signs being merged via the sdk
            signedBlob = await algosdkMergeAlgoSigner(ms);
        }

        // Use AlgoSigner to send this multisig, fully signed transaction to the Algorand test network
        if(signedBlob !== undefined && sendSignedTx()) {        
            AlgoSigner.send({
                ledger: 'TestNet',
                tx: signedBlob 
            }).then((tx) =>{
                selfLog(JSON.stringify(tx,_toJsonReplace,0),'good');
            }).catch((e)=>{selfLog(JSON.stringify(e),'bad')});
        }
    }).catch((e) => {
        selfLog(e,'bad');  
    });
}