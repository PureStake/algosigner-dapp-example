const algosdk = require('algosdk');
const address = require('algosdk/src/encoding/address');
const fs = require('fs');

var LOG_COMPONENTS = false;
var LOG_CHECKS = false;

async function main() {
    var conn = JSON.parse(fs.readFileSync('./connectinfo.json'));
    var ms = JSON.parse(fs.readFileSync('./ms_account.json'));

    let algodclient = new algosdk.Algodv2(conn.token, conn.server, conn.port);
    let params = await algodclient.getTransactionParams().do();

    let txn = {
        "from": ms.multisigAddr,
        "to": "7GBK5IJCWFPRWENNUEZI3K4CSE5KDIRSR55KWTSDDOBH3E3JJCKGCSFDGQ",
        "fee": params.fee,
        "amount": Math.floor((Math.random() * 1000) + 1),
        "firstRound": params.firstRound,
        "lastRound": params.lastRound,
        "genesisID": params.genesisID,
        "genesisHash": params.genesisHash,
        "note": new Uint8Array(0)
    };

    // Primary multisig sign
    let rawSignedTxn = algosdk.signMultisigTransaction(txn, ms.mparams, Uint8Array.from(ms.account1.sk.split(','))).blob;
    if(LOG_COMPONENTS){
        console.log(algosdk.decodeObj(rawSignedTxn).msig.subsig[0].s);
        console.log(algosdk.decodeObj(rawSignedTxn).txn);
    }

    // Direct sdk
    let directsig = algosdk.appendSignMultisigTransaction(rawSignedTxn, ms.mparams, Uint8Array.from(ms.account2.sk.split(','))).blob;
    if(LOG_COMPONENTS){
        console.log(`Direct:\n${directsig}`);
    }

    // Combine two ms txs
    let combiningSig = algosdk.signMultisigTransaction(txn, ms.mparams, Uint8Array.from(ms.account2.sk.split(','))).blob;
    let combinedSig = algosdk.mergeMultisigTransactions([rawSignedTxn,combiningSig]);
    if(LOG_COMPONENTS){
        console.log(`Combined:\n${combinedSig}`);
    }

    let firstSign = algosdk.signTransaction(txn, Uint8Array.from(ms.account1.sk.split(','))).blob;
    let secondSign = algosdk.signTransaction(txn, Uint8Array.from(ms.account2.sk.split(','))).blob;
    if(LOG_COMPONENTS){
        console.log(algosdk.decodeObj(firstSign).sig);
        console.log(algosdk.decodeObj(firstSign).txn);
        console.log(`\nSame Tx? ${JSON.stringify(algosdk.decodeObj(firstSign).txn)==JSON.stringify(algosdk.decodeObj(rawSignedTxn).txn)}`);
    }

    let msig = {
        subsig: [
            {
                "pk": address.decode(ms.account1.addr).publicKey,
                "s" : algosdk.decodeObj(firstSign).sig,
            },
            {
                "pk": address.decode(ms.account2.addr).publicKey,
                "s" : algosdk.decodeObj(secondSign).sig,
            },
            {
                "pk": address.decode(ms.account3.addr).publicKey
            }
        ],
        thr: 2,
        v: 1
    }
    let sTxn = {
        msig: msig,
        txn: algosdk.decodeObj(firstSign).txn
    }

    // Build final pieced tx array
    let piecedTx = algosdk.encodeObj(sTxn);

    if(LOG_COMPONENTS){
        console.log(JSON.stringify(algosdk.decodeObj(directsig,null,2)));
        console.log(JSON.stringify(algosdk.decodeObj(piecedTx,null,2)));
        console.log(`piecedTx?\n${piecedTx}`);
    }
    if(LOG_CHECKS){      
        console.log(`Direct/Combined Compare: ${directsig.toString()==combinedSig.toString()}`);
        console.log(`Direct/Pieced Compare: ${directsig.toString()==piecedTx.toString()}`);      
    }

    //submit the transaction
    try {
        let txId = await algodclient.sendRawTransaction(piecedTx,
            (res) => console.log(JSON.stringify(res))
        ).do();
        console.log(txId);
    }
    catch(e){
        console.log(e);
    }
}
main();
