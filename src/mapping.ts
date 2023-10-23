import { TransferSingle } from "../generated/Token/ERC1155";
import { Account } from "../generated/schema";
import { BigInt, ethereum } from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const BIGINT_ZERO = BigInt.fromI32(0);

export function createAccount(accountID: string): Account {
  const account = new Account(accountID);
  account.save();
  return account;
}

export function handleTransfer(event: TransferSingle): void {
  const to = event.params.to;
  const operator = event.params.operator;
  const from = event.params.from;

  // grab accounts
  let toAccount = Account.load(to.toHexString());
  if (!toAccount) {
    toAccount = createAccount(to.toHexString());
  }

  if (toAccount) {
    toAccount.operator = operator;
    toAccount.from = from;

    toAccount.blockNumber = event.block.number;
    toAccount.txHash = event.transaction.hash;
    toAccount.nonce = event.transaction.nonce;
    toAccount.save();
  }
}
