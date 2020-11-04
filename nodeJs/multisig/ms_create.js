const algosdk = require('algosdk');
var fs = require('fs');

var account1 = algosdk.generateAccount();
var account2 = algosdk.generateAccount();
var account3 = algosdk.generateAccount();

//Setup the parameters for the multisig account
const mparams = {
    version: 1,
    threshold: 2,
    addrs: [
        account1.addr,
        account2.addr,
        account3.addr,
    ],
};
//create multisig account
var multsigAddr = algosdk.multisigAddress(mparams);

var comboAddresses = { 
    "account1":{
        "addr": account1.addr,
        "sk": account1.sk.toString(),
        "mno": algosdk.secretKeyToMnemonic(account1.sk)
    },
    "account2":{
        "addr": account2.addr,
        "sk": account2.sk.toString(),
        "mno": algosdk.secretKeyToMnemonic(account2.sk)
    },
    "account3":{
        "addr": account3.addr,
        "sk": account3.sk.toString(),
        "mno": algosdk.secretKeyToMnemonic(account3.sk)
    },
    "multisigAddr": multsigAddr,
    "mparams": {
        version: 1,
        threshold: 2,
        addrs: [
            account1.addr,
            account2.addr,
            account3.addr,
        ],
    }
}

fs.writeFile("ms_account.json", JSON.stringify(comboAddresses,null,2), function(err) {
    if (err) {
        console.log(err);
    }
});