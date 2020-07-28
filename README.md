# AlgoSigner dApp Examples

Try it live at <a href="https://purestake.github.io/algosigner-dapp-example/" target="_blank" rel="noopener noreferrer">purestake.github.io/algosigner-dapp-example/</a>

This sample dApp demonstrates integration with the AlgoSigner Wallet. 

The AlgoSigner project is in pre-release development, it may be necessary to refresh the sample dApp page on occasion to resolve issues or to re-install the AlgoSigner Wallet. 

### Functions
1. Allows dApp to request connectivity to a user's Wallet
2. Allows for retrieval of connected users Algorand TestNet Accounts
3. Send sample transaction to AlgoSigner for signature approval and stores signed transaction 
4. Send signed transaction to Algorand network*
5. Allows for accessing the public methods of the Alogd and Indexer APIs

* Signed transaction binary blob is encoded in base64 when returned by the extension, in addition to the standard encoding the Algorand SDK performs. 

### Prerequisites
1. Chrome Browser
2. Developer install of unpacked AlgoSigner extension
3. Imported or Created TestNet Wallet in AlgoSigner - dApp example uses the first returned

### Steps
1. Open page from the link above or host it yourself* 
2. Select 'AlgoSigner.connect()' and authorize the dApp in AlgoSigner
3. Select 'AlgoSigner.accounts("TestNet")' - provides the dApp an array of TestNet accounts
4. Select 'AlgoSigner.algod("params")' - populates the transaction parameters like 'first-round', 'last-round' and 'genesisID'
5. Select 'AlgoSigner.sign()' and review and approve the sample transaction in AlgoSigner (requires password)
6. Select 'AlgoSigner.send(tx.blob)'
7. Select 'AlgoSigner.algod('pending transaction') - verify the status of the transaction

* A simple self hosted solution is to copy/clone the page locally and run `python3 -m http.server 9000` from the directory 
