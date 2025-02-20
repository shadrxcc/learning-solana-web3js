"use client"

import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [keyPair, setkeyPair] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [checkingBalance, setCheckingBalance] = useState(false);

  const handleGenerateKeyPair = async () => {
    setGenerating(true);
    try {
      const key = Keypair.generate();
      toast.success("Solana wallet created! 🎉⚡");
      setkeyPair(key.publicKey.toBase58());
    } catch (error) {
      toast.error("Failed to create Solana wallet. Please try again.🥹");
    } finally {
      setGenerating(false);
    }
  };

  const handleFetchBalance = async () => {
    if (keyPair) {
      setCheckingBalance(true);
      try {
        const connection = new Connection(clusterApiUrl("devnet"));
        const address = new PublicKey(keyPair);

        const balance = await connection.getBalance(address);
        const balanceInSol = balance / LAMPORTS_PER_SOL;
        setBalance(balanceInSol);
        toast.success("Balance fetched! 🎉⚡");
      } catch (error) {
        toast.error("Failed to fetch balance. Please try again.🥹");
      } finally {
        setCheckingBalance(false);
      }
    }
  };

  return (
    <>
      <div className="py-20 flex flex-col gap-y-20">
        <h1 className="text-2xl mx-auto max-w-sm sm:max-w-lg sm:text-3xl font-bold text-lime-400 text-center">
          Keypair Creation & Balance Check
        </h1>

        <div className="flex flex-col gap-y-14">
          {keyPair && (
            <div className="bg-white border w-fit mx-auto border-lime-400 rounded p-2">
              <p className="text-[10px] text-indigo-950" id="keyPair">
                {keyPair}
              </p>
            </div>
          )}

          {balance !== null && (
            <h1 className="text-4xl sm:text-6xl font-black text-white text-center leading-4">
              {balance} SOL
            </h1>
          )}

          <div className="flex flex-col gap-y-3.5 items-center">
            {!keyPair && (
              <button
                onClick={handleGenerateKeyPair}
                disabled={generating}
                className="bg-lime-400 flex items-center gap-x-2.5 text-white rounded px-4 py-2.5"
              >
                Generate Key Pair
                {generating && (
                  <div className="w-3 h-3 rounded-full bg-transparent border-2 border-white animate-spin" />
                )}
              </button>
            )}
            {keyPair && (
              <button
                disabled={checkingBalance}
                onClick={handleFetchBalance}
                className="bg-lime-400 flex items-center gap-x-2.5 text-white rounded px-4 py-2.5"
              >
                Fetch Balance
                {checkingBalance && (
                  <div className="w-3 h-3 rounded-full bg-transparent border-2 border-white animate-spin" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
