async function createMultisigTx() {
    // Setup the AlgoSigner authorized connection
    await setupTx() 
    .then(async () => { 
        const ms = {
            account1: {
                addr: "LKBQQZQ7LQFNO5477GRPMY6UOGVJJOIN7WSIPY7YQIRAHKXVYQVT6EXOGY",
                mno: "response faculty obtain crowd dismiss cool clean breeze clinic pulp flash faculty worth mention layer rare reduce hand width crowd near hawk goddess about sail"
            },
            account2: {
                addr: "2SLXGKWLIGSDDLC7RZY7DMGCXOAWMT6GAGO3AJM22T6Q4ZGYTNQHSOLSWA",
                mno: "obscure obscure allow drink write country merry ahead ordinary gallery reunion start roof antique orchard chicken shy write rebuild infant bone segment material above treat"
            },
            account3: {
                addr: "KQVFM6F6ZNPO76XGPNG7QT5E5UJK62ZFICFMMH3HI4GNWYZD5RFHGAJSPQ",
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


        const multiSigAddr = algosdk.multisigAddress(ms.mparams);
        const account3 = algosdk.mnemonicToSecretKey(ms.account3.mno); 
        const amount = (Math.floor(Math.random() * 1000) + 1);
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: multiSigAddr,
            to: account3.addr,
            amount: amount,
            suggestedParams: {...txParamsJS}
        });

        selfLog(`Prepared Multisig Pay Tx: ${JSON.stringify(txn,toJsonReplace,1)}`, 'info');
        
        // Use the AlgoSigner encoding library to make the transactions base64
        const txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());

        const mstx = { 
            msig: ms.mparams,
            txn: txn_b64
        }

        await AlgoSigner.signTxn([mstx])
        .then((d) => {       
            selfLog(`Signed transaction: ${JSON.stringify(d,toJsonReplace,1)}`,'good');

            // First transaction debug check
            const primaryBlob = d[0]['blob'];

            if(sendSignedTx()) {
                //Forcing testnet only to prevent accidental mainnet calls
                AlgoSigner.send({
                    ledger: 'TestNet',
                    tx: primaryBlob
                }).then((tx) =>{
                    selfLog(`Transaction Sent: ${JSON.stringify(tx,toJsonReplace,1)}`,'good');
                }).catch((e)=>{selfLog(e,'bad')});          
            }
        }).catch((e) => {
            selfLog(`Error:${JSON.stringify(e)}`,'bad');  
        });

    }).catch((e) => {
        selfLog(`Error:${JSON.stringify(e)}`,'bad');  
    });
}