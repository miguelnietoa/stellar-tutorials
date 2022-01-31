import StellarSdk from 'stellar-sdk';
import fetch from 'node-fetch';

const pair = StellarSdk.Keypair.random();
const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");


// The SDK does not have tools for creating test accounts, so you'll have to
// make your own HTTP request.

(async function main() {
  try {
    console.log('Secret:', pair.secret());
    // SAV76USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7
    console.log('Pub Key:', pair.publicKey());
    // GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB

    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(
        pair.publicKey(),
      )}`,
    );
    const responseJSON = await response.json();
    console.log("SUCCESS! You have a new account :)\n", responseJSON);

    // the JS SDK uses promises for most actions, such as retrieving an account
    const account = await server.loadAccount(pair.publicKey());
    console.log("Balances for account: " + pair.publicKey());
    account.balances.forEach(function (balance) {
      console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
    });

  } catch (e) {
    console.error("ERROR!", e);
  }
})();
