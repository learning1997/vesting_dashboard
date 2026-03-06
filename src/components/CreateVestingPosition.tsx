"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { mcp } from "@/lib/mcp";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatTokenAmount } from "@/lib/utils";
import { Coins } from "lucide-react";

interface VestingOption {
  durationLabel: string;
  durationSeconds: number;
  apr: number;
}

const VESTING_OPTIONS: VestingOption[] = [
  { durationLabel: "1 Day", durationSeconds: 86400, apr: 5 },
  { durationLabel: "3 Months", durationSeconds: 7776000, apr: 12 },
  { durationLabel: "6 Months", durationSeconds: 15552000, apr: 20 },
  { durationLabel: "12 Months", durationSeconds: 31104000, apr: 40 },
];

import { VAULT_WALLET_ADDRESS } from "@/lib/vault";

export function CreateVestingPosition({ onCreated }: { onCreated: () => void }) {
  const { isConnected, connect, address } = useWallet();
  const [amount, setAmount] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<VestingOption>(VESTING_OPTIONS[1]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);

  // Fetch balance when wallet connects
  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        const bal = await mcp.getTokenBalance(address);
        setBalance(bal);
      } else {
        setBalance(0);
      }
    };
    fetchBalance();
  }, [address]);

  // Calculate rewards whenever amount or option changes
  // Formula: Amount * (APR/100) * (DurationSeconds / SecondsInYear)
  const SECONDS_IN_YEAR = 31536000;
  const estimatedReward = amount && !isNaN(Number(amount)) && Number(amount) > 0
    ? (Number(amount) * (selectedOption.apr / 100) * (selectedOption.durationSeconds / SECONDS_IN_YEAR))
    : 0;

  const handlePercentageClick = (percentage: number) => {
    if (balance > 0) {
      const newAmount = (balance * (percentage / 100)).toFixed(8); // Use 8 decimals for BTC
      setAmount(newAmount);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (Number(amount) > balance) {
      setError("Insufficient balance");
      return;
    }

    if (!isConnected) {
      connect();
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await mcp.createUserVesting(
        Number(amount),
        selectedOption.durationSeconds,
        selectedOption.apr
      );
      setAmount(""); // Clear input after successful creation
      setSuccess(`Vesting created! Tx: ${result.txHash.substring(0, 10)}...`);
      onCreated();
      // Refresh balance
      if (address) {
        const bal = await mcp.getTokenBalance(address);
        setBalance(bal);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create vesting position");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-6 w-6 text-primary" />
          Create Vesting Position
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-muted-foreground">Amount to Lock</label>
              <span className="text-xs text-muted-foreground">
                Balance: <span className="text-foreground font-medium">{formatTokenAmount(balance)} tBTC</span>
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-12 px-4 pr-16 bg-secondary rounded-lg border border-input focus:border-primary outline-none transition-colors"
                min="0.00000001"
                step="any"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                tBTC
              </div>
            </div>
            
            {/* Percentage Buttons */}
            <div className="flex gap-2 mt-2">
              {[25, 50, 75, 100].map((percent) => (
                <button
                  key={percent}
                  type="button"
                  onClick={() => handlePercentageClick(percent)}
                  className="flex-1 py-1 text-xs font-medium rounded bg-secondary hover:bg-secondary/80 border border-border transition-colors"
                >
                  {percent === 100 ? "Max" : `${percent}%`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Select Duration</label>
            <div className="grid grid-cols-2 gap-3">
              {VESTING_OPTIONS.map((option) => (
                <button
                  key={option.durationLabel}
                  type="button"
                  onClick={() => setSelectedOption(option)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedOption.durationLabel === option.durationLabel
                      ? "bg-primary/10 border-primary ring-1 ring-primary"
                      : "bg-secondary border-input hover:border-primary/50"
                  }`}
                >
                  <div className="text-sm font-bold">{option.durationLabel}</div>
                  <div className="text-xs text-primary mt-1 font-medium">{option.apr}% APR</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">APR Rate</span>
              <span className="font-bold text-primary">{selectedOption.apr}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Lock Duration</span>
              <span className="font-bold">{selectedOption.durationLabel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Rewards</span>
              <span className="font-bold text-green-500">
                +{formatTokenAmount(estimatedReward)} tBTC
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-border pt-3">
              <span className="text-muted-foreground">Vault Address</span>
              <a 
                href="https://opscan.org/accounts/opt1pqmtk9n9ep53jjr0cu769lgsvre02h9d9ylv0tsgd72wmsemft54q9lu63l?network=op_testnet"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-primary underline hover:text-primary/80" 
                title={VAULT_WALLET_ADDRESS}
              >
                {VAULT_WALLET_ADDRESS.substring(0, 8)}...{VAULT_WALLET_ADDRESS.substring(VAULT_WALLET_ADDRESS.length - 8)}
              </a>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-md border border-red-500/20">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-green-500 text-sm bg-green-500/10 p-3 rounded-md border border-green-500/20">
              {success}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-lg font-bold bg-primary text-black hover:bg-primary/90"
          >
            {isSubmitting ? "Locking Tokens..." : isConnected ? "Create Position" : "Connect Wallet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
