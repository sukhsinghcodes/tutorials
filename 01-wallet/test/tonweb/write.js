import dotenv from "dotenv";
dotenv.config({ path: "../../../.env" });

// step 9

import { getHttpEndpoint } from "@orbs-network/ton-access";
import tonMnemonic from "tonweb-mnemonic";
import TonWeb from "tonweb";

const mnemonic = process.env.MNEMONIC;
const key = await tonMnemonic.mnemonicToKeyPair(mnemonic.split(" "));

const endpoint = await getHttpEndpoint({
  network: "testnet"
});
//const tonweb = new TonWeb(new TonWeb.HttpProvider(endpoint));
const tonweb = new TonWeb(new TonWeb.HttpProvider("https://testnet.toncenter.com/api/v2/jsonRPC", { apiKey: "f20ff0043ded8c132d0b4b870e678b4bbab3940788cbb8c8762491935cf3a460" }));

const WalletClass = tonweb.wallet.all["v4R2"];
const wallet = new WalletClass(tonweb.provider, {
  publicKey: key.publicKey
});

// send 0.001 TON to EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI
const seqno = await wallet.methods.seqno().call() || 0;
await wallet.methods.transfer({
  secretKey: key.secretKey,
  toAddress: "EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI",
  amount: TonWeb.utils.toNano("0.001"), // 0.001 TON
  seqno: seqno,
  payload: "Hello", // optional comment
  sendMode: 3,
}).send();

// wait until confirmed
let currentSeqno = seqno;
while (currentSeqno == seqno) {
  await sleep(1500);
  currentSeqno = await wallet.methods.seqno().call() || 0;
}
console.log("transaction confirmed!");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}