# AlgoSigner dApp Examples

Try it live at <a href="https://purestake.github.io/algosigner-dapp-example/" target="_blank" rel="noopener noreferrer">purestake.github.io/algosigner-dapp-example/</a>

A sample dApp demonstrating integration with the AlgoSigner Wallet. 

### Functions
Demonstrates several standard scenarios:

1. Connect to a wallet and use connection to query the blockchain
2. Create a payment transaction and have the user sign it
3. Create a new asset and have the user sign the configuration transaction
4. Create an opt-in to an asset transaction for the user to sign

* Signed transaction binary blob is encoded in base64 when returned by the extension, in addition to the standard encoding the Algorand SDK performs. No extra steps are required to send it through AlgoSigner - which expects and requires the base64 encoding of the binary blob.  

### Prerequisites
1. Chrome Browser
2. Install of AlgoSigner - <a href="https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm" target="_blank" rel="noopener noreferrer">Chrome Store</a>
3. Imported or Created TestNet Wallet in AlgoSigner - dApp example uses the first returned
4. Visit the dApp <a href="https://purestake.github.io/algosigner-dapp-example/" target="_blank" rel="noopener noreferrer">live</a> or host it yourself.*

* A simple self hosted solution is to copy/clone the repo locally and run `python3 -m http.server 9000` from the directory 
