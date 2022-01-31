import { Keypair, Account, Networks, Operation } from "stellar-base";
import { TransactionBuilder, BASE_FEE } from "stellar-sdk";

var keypair = Keypair.fromSecret(
  "SCU36VV2OYTUMDSSU4EIVX4UUHY3XC7N44VL4IJ26IOG6HVNC7DY5UJO",
);
var account = new Account(keypair.publicKey(), "1451501377552384");

var amount = "100";
var transaction = new TransactionBuilder(account, {
    networkPassphrase: Networks.TESTNET,
    fee: BASE_FEE,
  })
  .addOperation(
    Operation.createAccount({
      destination: Keypair.random().publicKey(),
      startingBalance: amount,
    }),
  )
  .setTimeout(180)
  .build();

transaction.sign(keypair);

console.log(transaction.toEnvelope().toXDR().toString("base64"));
