"use client";

import { AlertDialog } from "@/components/ui/alert-dialog";
import ConfirmTransfer from "@/components/ui/confirmation";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import React, { useState } from "react";
import { toast } from "sonner";

type Action = "confirm" | null;

const TransferPage = () => {
  const [receiver, setReceiver] = useState<string>("");
  const [amount, setAmount] = useState<number | null>(null);
  const [action, setAction] = useState<Action>(null);
  const [sending, setSending] = useState<boolean>(false);

  const secretKey = JSON.parse(process.env.NEXT_PUBLIC_SECRET_KEY || "[]");
  const keyPair = Keypair.fromSecretKey(Uint8Array.from(secretKey));

  const handleSignTransaction = async () => {
    try {
      if (receiver && amount && keyPair) {
        setSending(true);
        let receiverPublicKey: PublicKey;

        try {
          receiverPublicKey = new PublicKey(receiver);
        } catch (error) {
          toast.error("Invalid receiver address. ❌");
          return;
        }

        const connection = new Connection(clusterApiUrl("devnet"));
        const transaction = new Transaction();

        const senderBalance = await connection.getBalance(keyPair.publicKey);
        const formattedBalance = senderBalance / LAMPORTS_PER_SOL;
        const lamports = amount * LAMPORTS_PER_SOL;

        if (formattedBalance < lamports + 5000) {
          toast.error("Insufficient balance ❌. Top up your wallet to proceed");
          return;
        }

        const makeTransfer = SystemProgram.transfer({
          fromPubkey: new PublicKey(keyPair.publicKey.toBase58()),
          toPubkey: receiverPublicKey,
          lamports,
        });
        transaction.add(makeTransfer);

        await sendAndConfirmTransaction(connection, transaction, [keyPair]);

        toast.success("Transaction successful! 🎉⚡");
      }
    } catch (error) {
      console.error(error);

      toast.error("Transaction failed, my g! 😐");
    } finally {
      setSending(false);
    }
  };

  const validateInputs = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!receiver || !amount) {
      toast.info("Please fill in all fields.");
      return;
    }

    setAction("confirm");
  };

  return (
    <div className="py-20 px-4">
      <form className="flex flex-col max-w-lg mx-auto gap-y-3">
        <div className="flex flex-col items-start w-full gap-y-2">
          <label htmlFor="receive" className="text-xs">
            Transfer SOL to
          </label>
          <input
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            name="receiver"
            placeholder="Enter recipient address"
            className="border text-xs text-white border-lime-400 w-full bg-transparent rounded-md px-2 py-2.5"
          />
        </div>

        <div className="flex flex-col items-start w-full gap-y-2">
          <label htmlFor="amount" className="text-xs">
            Amount
          </label>
          <input
            name="amount"
            value={amount ? amount : ""}
            onChange={(e) => setAmount(Number(e.target.value))}
            type="number"
            min={0}
            placeholder="Enter amount"
            className="border text-xs text-white border-lime-400 w-full bg-transparent rounded-md px-2 py-2.5"
          />
        </div>

        <button
          onClick={validateInputs}
          className="bg-lime-400 text-xs justify-center font-medium flex items-center gap-x-2.5 text-white rounded px-4 py-2.5"
        >
          Send
        </button>
      </form>

      <AlertDialog
        open={action === "confirm"}
        onOpenChange={(open) => setAction(open ? "confirm" : null)}
      >
        <ConfirmTransfer
          loading={sending}
          onSubmit={handleSignTransaction}
          amount={amount || 0}
          to={receiver}
          from={keyPair.publicKey.toBase58()}
        />
      </AlertDialog>
    </div>
  );
};

export default TransferPage;
