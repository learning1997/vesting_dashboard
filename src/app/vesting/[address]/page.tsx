"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { mcp } from "@/lib/mcp";
import { useWallet } from "@/hooks/useWallet";
import { VestingSchedule } from "@/contracts/VestingContract";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTokenAmount, formatAddress } from "@/lib/utils";
import { ArrowLeft, Calendar, Clock, Coins, Shield } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function VestingDetails() {
  const params = useParams();
  const addressParam = params.address as string;
  const { address: connectedAddress } = useWallet();
  
  const [schedule, setSchedule] = useState<VestingSchedule | null>(null);
  const [claimable, setClaimable] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const [sched, claim] = await Promise.all([
          mcp.getVestingSchedule(addressParam),
          mcp.getClaimableAmount(addressParam),
        ]);
        setSchedule(sched);
        setClaimable(claim);
      } catch (error) {
        console.error("Failed to fetch schedule", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (addressParam) {
      fetchSchedule();
    }
  }, [addressParam]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Schedule Not Found</CardTitle>
            <CardDescription>No vesting schedule found for address {addressParam}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalVested = schedule.totalAmount;
  const claimed = schedule.amountClaimed;
  const progress = Math.min(100, ((claimed + claimable) / totalVested) * 100);
  const startDate = new Date(schedule.startTime * 1000);
  const cliffDate = new Date((schedule.startTime + schedule.cliffDuration) * 1000);
  const endDate = new Date((schedule.startTime + schedule.vestingDuration) * 1000);

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="mb-6">
        <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vesting Schedule Details</h1>
          <p className="text-muted-foreground font-mono mt-1">
            Recipient: {addressParam}
          </p>
        </div>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Schedule Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Total Progress</span>
              <span>{progress.toFixed(2)}%</span>
            </div>
            <Progress value={progress} className="h-4" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Start: {format(startDate, "MMM d, yyyy")}</span>
              <span>End: {format(endDate, "MMM d, yyyy")}</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <Coins className="h-4 w-4" />
                <span className="text-sm">Total Allocation</span>
              </div>
              <div className="text-2xl font-bold">{formatTokenAmount(totalVested)}</div>
              <div className="text-xs text-muted-foreground mt-1">OPNet Tokens</div>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Claimed Amount</span>
              </div>
              <div className="text-2xl font-bold">{formatTokenAmount(claimed)}</div>
              <div className="text-xs text-muted-foreground mt-1">Successfully claimed</div>
            </div>

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Coins className="h-4 w-4" />
                <span className="text-sm font-semibold">Claimable Now</span>
              </div>
              <div className="text-2xl font-bold text-primary">{formatTokenAmount(claimable)}</div>
              {connectedAddress === addressParam && claimable > 0 && (
                 <div className="mt-2 text-xs text-primary font-medium">
                   Go to Dashboard to claim
                 </div>
              )}
            </div>
          </div>

          {/* Timeline Details */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Schedule Timeline
              </h3>
              <div className="space-y-4 border-l-2 border-border pl-4 ml-2">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full bg-muted-foreground" />
                  <div className="text-sm font-medium">Vesting Start</div>
                  <div className="text-sm text-muted-foreground">{format(startDate, "PPpp")}</div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full bg-orange-500" />
                  <div className="text-sm font-medium">Cliff End (Tokens unlock)</div>
                  <div className="text-sm text-muted-foreground">{format(cliffDate, "PPpp")}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Cliff duration: {(schedule.cliffDuration / 86400).toFixed(0)} days
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full bg-green-500" />
                  <div className="text-sm font-medium">Vesting End</div>
                  <div className="text-sm text-muted-foreground">{format(endDate, "PPpp")}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Total duration: {(schedule.vestingDuration / 86400).toFixed(0)} days
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" /> Vesting Rules
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                <li>Tokens are locked until the Cliff End date.</li>
                <li>After the cliff, tokens vest linearly until the End Date.</li>
                <li>You can claim vested tokens at any time.</li>
                <li>This schedule is immutable and secured by OPNet smart contracts.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
