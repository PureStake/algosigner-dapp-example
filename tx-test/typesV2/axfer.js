async function acceptAsset() {
    await setupTx()
    .then(async () => {
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: account.address,
        to: account.address,
        amount: 0,
        assetIndex: 1530000,
        suggestedParams: { ...txParamsJS },
    });

    selfLog(
        `Prepared Asset Accept Txn: ${JSON.stringify(txn, toJsonReplace, 1)}`
    );

    // Use the AlgoSigner encoding library to make the transactions base64
    const txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());

    await AlgoSigner.signTxn([{ txn: txn_b64 }])
        .then((d) => {
        selfLog(
            `Signed transaction: ${JSON.stringify(d, toJsonReplace, 1)}`,
            "good"
        );

        // First transaction debug check
        const primaryBlob = d[0]["blob"];
        const byteBlob = AlgoSigner.encoding.stringToByteArray(
            atob(primaryBlob)
        );
        selfLog(
            `${JSON.stringify(algosdk.decodeObj(byteBlob), toJsonReplace, 1)}`,
            "debug"
        );

        if (sendSignedTx()) {
            //Forcing testnet only to prevent accidental mainnet calls
            AlgoSigner.send({
            ledger: "TestNet",
            tx: d.blob,
            })
            .then((tx) => {
                selfLog(
                `Transaction Sent: ${JSON.stringify(tx, toJsonReplace, 1)}`,
                "good"
                );
            })
            .catch((e) => {
                selfLog(e, "bad");
            });
        }
        })
        .catch((e) => {
        selfLog(`Sign error ${e}`, "bad");
        });
    })
    .catch((e) => {
    selfLog(e, "bad");
    });
}

async function closeAsset() {
    await setupTx()
    .then(async () => {
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: account.address,
        to: account.address,
        closeRemainderTo: account.address,
        assetIndex: 1530000,
        suggestedParams: { ...txParamsJS },
    });

    selfLog(
        `Prepared Asset Close Txn: ${JSON.stringify(txn, toJsonReplace, 1)}`
    );

    // Use the AlgoSigner encoding library to make the transactions base64
    const txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());

    await AlgoSigner.signTxn([{ txn: txn_b64 }])
        .then((d) => {
        selfLog(
            `Signed transaction: ${JSON.stringify(d, toJsonReplace, 1)}`,
            "good"
        );

        // First transaction debug check
        const primaryBlob = d[0]["blob"];
        const byteBlob = AlgoSigner.encoding.stringToByteArray(
            atob(primaryBlob)
        );
        selfLog(
            `${JSON.stringify(algosdk.decodeObj(byteBlob), toJsonReplace, 1)}`,
            "debug"
        );

        if (sendSignedTx()) {
            //Forcing testnet only to prevent accidental mainnet calls
            AlgoSigner.send({
            ledger: "TestNet",
            tx: d.blob,
            })
            .then((tx) => {
                selfLog(
                `Transaction Sent: ${JSON.stringify(tx, toJsonReplace, 1)}`,
                "good"
                );
            })
            .catch((e) => {
                selfLog(e, "bad");
            });
        }
        })
        .catch((e) => {
        selfLog(`Sign error ${e}`, "bad");
        });
    })
    .catch((e) => {
    selfLog(e, "bad");
    });
}

async function transferAsset() {
    await setupTx()
    .then(async () => {
    // **NOTE**
    // Transfer asset uses the JS SDK makeTxn without object to show an example alternate way
    // For using the object structure look at one of the other transaction types
    const sender = account.address;
    const recipient =
        "KQVFM6F6ZNPO76XGPNG7QT5E5UJK62ZFICFMMH3HI4GNWYZD5RFHGAJSPQ";
    const amount = Math.floor(Math.random() * 10) + 1;
    const assetIndex = 1530000;
    const suggestedParams = { ...txParamsJS };

    let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        recipient,
        undefined,
        undefined,
        amount,
        undefined,
        assetIndex,
        suggestedParams
    );
    selfLog(
        `Prepared Transfer Tx: ${JSON.stringify(txn, toJsonReplace, 1)}`,
        "info"
    );

    // Use the AlgoSigner encoding library to make the transactions base64
    let txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());

    await AlgoSigner.signTxn([{ txn: txn_b64 }])
        .then((d) => {
        selfLog(
            `Signed transaction: ${JSON.stringify(d, toJsonReplace, 1)}`,
            "good"
        );

        // First transaction debug check
        const primaryBlob = d[0]["blob"];
        const byteBlob = AlgoSigner.encoding.stringToByteArray(
            atob(primaryBlob)
        );
        selfLog(
            `${JSON.stringify(algosdk.decodeObj(byteBlob), toJsonReplace, 1)}`,
            "debug"
        );

        if (sendSignedTx()) {
            //Forcing testnet only to prevent accidental mainnet calls
            AlgoSigner.send({
            ledger: "TestNet",
            tx: primaryBlob,
            })
            .then((tx) => {
                selfLog(
                `Transaction Sent: ${JSON.stringify(tx, toJsonReplace, 1)}`,
                "good"
                );
            })
            .catch((e) => {
                selfLog(e, "bad");
            });
        }
        })
        .catch((e) => {
        selfLog(`Sign error ${e}`, "bad");
        });
    })
    .catch((e) => {
    selfLog(e, "bad");
    });
}

async function clawbackAsset() {
    await setupTx()
    .then(async () => {
    const { addr: targetAddr } = algosdk.generateAccount();
    const amount = Math.floor(Math.random() * 10) + 1;
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: account.address,
        to: account.address,
        revocationTarget: targetAddr,
        amount: amount,
        assetIndex: 1530000,
        suggestedParams: { ...txParamsJS },
    });

    selfLog(
        `Prepared Clawback/Revoke Tx: ${JSON.stringify(txn, toJsonReplace, 1)}`,
        "info"
    );

    // Use the AlgoSigner encoding library to make the transactions base64
    let txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());

    await AlgoSigner.signTxn([{ txn: txn_b64 }])
        .then((d) => {
        selfLog(
            `Signed transaction: ${JSON.stringify(d, toJsonReplace, 1)}`,
            "good"
        );

        // First transaction debug check
        const primaryBlob = d[0]["blob"];
        const byteBlob = AlgoSigner.encoding.stringToByteArray(
            atob(primaryBlob)
        );
        selfLog(
            `${JSON.stringify(algosdk.decodeObj(byteBlob), toJsonReplace, 1)}`,
            "debug"
        );

        if (sendSignedTx()) {
            //Forcing testnet only to prevent accidental mainnet calls
            AlgoSigner.send({
            ledger: "TestNet",
            tx: primaryBlob,
            })
            .then((tx) => {
                selfLog(
                `Transaction Sent: ${JSON.stringify(tx, toJsonReplace, 1)}`,
                "good"
                );
            })
            .catch((e) => {
                selfLog(e, "bad");
            });
        }
        })
        .catch((e) => {
        selfLog(`Sign error ${e}`, "bad");
        });
    })
    .catch((e) => {
    selfLog(e, "bad");
    });
}