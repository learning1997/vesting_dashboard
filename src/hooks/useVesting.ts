"use client";

import { useState, useEffect, useCallback } from "react";
import { mcp } from "@/lib/mcp";
import { useWallet } from "./useWallet";
import { VestingSchedule } from "@/contracts/VestingContract";

export function useVesting() {
  const { address, isConnected } = useWallet();
  const [schedule, setSchedule] = useState<VestingSchedule | null>(null);
  const [claimable, setClaimable] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!address || !isConnected) {
      setSchedule(null);
      setClaimable(0);
      setBalance(0);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [sched, claim, bal] = await Promise.all([
        mcp.getVestingSchedule(address),
        mcp.getClaimableAmount(address),
        mcp.getTokenBalance(address),
      ]);
      setSchedule(sched);
      setClaimable(claim);
      setBalance(bal);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch vesting data");
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [fetchData]);

  const claim = async () => {
    if (!address) return;
    try {
      await mcp.claimTokens(address);
      await fetchData(); // Refresh data
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    schedule,
    claimable,
    balance,
    isLoading,
    error,
    refresh: fetchData,
    claim,
  };
}
