const { wallet, createWallet } = require("./dist/index.cjs");

// Basic configuration
const RGB_MANAGER_ENDPOINT = "http://127.0.0.1:8000"; // RGB Manager endpoint

async function basicExample() {
    console.log("ThunderLink RGB Wallet - Basic Example");
    console.log("=" .repeat(40));
    
    try {
        // Step 1: Generate wallet keys
        console.log("\n1. Generating wallet keys...");
        const keys = createWallet();
        console.log("Keys generated");
        console.log("Master Fingerprint:", keys.masterFingerprint);
        console.log("Vanilla XPub:", keys.accountXpubVanilla);
        console.log("Colored XPub:", keys.accountXpubColored);
        
        // Step 2: Initialize wallet
        console.log("\n2. Initializing wallet...");
        wallet.init({
            xpub_van: keys.accountXpubVanilla,
            xpub_col: keys.accountXpubColored,
            master_fingerprint: keys.masterFingerprint,
            mnemonic: keys.mnemonic,
            network: "3", // Regtest
            rgbEndpoint: RGB_MANAGER_ENDPOINT
        });
        console.log("Wallet initialized");
        
        // Step 3: Get wallet address
        console.log("\n3. Getting wallet address...");
        const address = await wallet.getAddress();
        console.log("Wallet address:", address);
        
        // Step 4: Check BTC balance
        console.log("\n4. Checking BTC balance...");
        const btcBalance = await wallet.getBtcBalance();
        console.log("BTC Balance:", JSON.stringify(btcBalance, null, 2));
        
        // Step 5: List assets
        console.log("\n5. Listing RGB assets...");
        const assets = await wallet.listAssets();
        console.log("Assets:", JSON.stringify(assets, null, 2));
        
        // Step 6: Issue a new asset (if no assets exist)
        if (!assets.nia || assets.nia.length === 0) {
            console.log("\n6. Issuing a new RGB asset...");
            const newAsset = await wallet.issueAssetNia({
                ticker: "DEMO",
                name: "Demo Token",
                amounts: [1000],
                precision: 2
            });
            console.log("New asset issued:", JSON.stringify(newAsset, null, 2));
        } else {
            console.log("\n6. Assets already exist, skipping issuance");
        }
        
        // Step 7: List assets again
        console.log("\n7. Listing assets after issuance...");
        const updatedAssets = await wallet.listAssets();
        console.log("Updated assets:", JSON.stringify(updatedAssets, null, 2));
        
        // Step 8: Get asset balance (if assets exist)
        if (updatedAssets.nia && updatedAssets.nia.length > 0) {
            const assetId = updatedAssets.nia[0].assetId;
            console.log("\n8. Getting asset balance...");
            const assetBalance = await wallet.getAssetBalance(assetId);
            console.log("Asset balance:", JSON.stringify(assetBalance, null, 2));
        }
        
        console.log("\nBasic example completed successfully!");
        
    } catch (error) {
        console.error("Error in basic example:", error.message);
        console.error("Full error:", error);
    }
}

// Run the basic example
if (require.main === module) {
    basicExample()
        .then(() => {
            console.log("\nBasic example finished!");
        })
        .catch((error) => {
            console.error("Fatal error:", error);
            process.exit(1);
        });
}

module.exports = { basicExample };
