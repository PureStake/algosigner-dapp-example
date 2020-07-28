# AlgoSigner dApp Examples

Try it live at <a href="https://purestake.github.io/algosigner-dapp-example/" target="_blank" rel="noopener noreferrer">purestake.github.io/algosigner-dapp-example/</a>

A sample dApp demonstrating integration with the AlgoSigner Wallet. 

_The AlgoSigner project is in pre-release development, it may be necessary to refresh the sample dApp page on to resolve issues or to re-install the AlgoSigner Wallet._ 

### Functions
1. Allows dApp to request connectivity to a user's Wallet
2. Allows for retrieval of connected users Algorand TestNet Accounts
3. Send sample transaction to AlgoSigner for signature approval and stores signed transaction 
4. Send signed transaction to Algorand network*
5. Allows for accessing the public methods of the Alogd and Indexer APIs

* Signed transaction binary blob is encoded in base64 when returned by the extension, in addition to the standard encoding the Algorand SDK performs. No extra steps are required to send it through AlgoSigner - which expects and requires the base64 encoding of the binary blob. T 

### Prerequisites
1. Chrome Browser
2. Developer install of unpacked AlgoSigner extension
3. Imported or Created TestNet Wallet in AlgoSigner - dApp example uses the first returned

### End to End Example Steps
1. Open page from the link above or host it yourself* 
2. Select 'AlgoSigner.connect()' and authorize the dApp in AlgoSigner
3. Select 'AlgoSigner.accounts("TestNet")' - provides the dApp an array of TestNet accounts
4. Select 'AlgoSigner.algod("params")' - populates the transaction parameters like 'first-round', 'last-round' and 'genesisID'
5. Select 'AlgoSigner.sign()' to send a sample transction to AlgoSigner and review and approve in AlgoSigner (requires password). The dApp receives back the signed transaction object. 
6. Select 'AlgoSigner.send(tx.blob)' - sends the signed transaction blob (in base64) - back to AlgoSigner for submission to the network
7. Select 'AlgoSigner.algod('pending transaction') - verify the status of the transaction

* A simple self hosted solution is to copy/clone the page locally and run `python3 -m http.server 9000` from the directory 
