"use client";

import { useEffect, useState } from "react";
import { VestingSchedule } from "@/contracts/VestingContract";
import { mcp } from "@/lib/mcp";
import { formatTokenAmount } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, Lock, Unlock } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";

export function VestingPositionsList({ refreshTrigger }: { refreshTrigger: number }) {
  const { address } = useWallet();
  const [schedules, setSchedules] = useState<VestingSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const fetchSchedules = async () => {
    if (!address) return;
    setIsLoading(true);
    try {
      const data = await mcp.getUserVestingSchedules(address);
      setSchedules(data);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [address, refreshTrigger]);

  const handleClaim = async (scheduleId: string) => {
    setClaimingId(scheduleId);
    try {
      await mcp.claimTokens(scheduleId);
      await fetchSchedules(); // Refresh data after claim
    } catch (error) {
      console.error("Claim failed:", error);
    } finally {
      setClaimingId(null);
    }
  };

  if (isLoading && schedules.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">Loading positions...</div>;
  }

  if (schedules.length === 0) {
    return (
      <Card className="border-border border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="bg-secondary/50 p-4 rounded-full mb-4">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Vesting Positions</h3>
          <p className="text-muted-foreground max-w-sm">
            You don't have any active vesting positions yet. Create one to start earning APR rewards.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Clock className="h-6 w-6 text-primary" />
        Your Vesting Positions
      </h2>
      
      <div className="grid gap-4">
        {schedules.map((schedule) => {
          const isAprPosition = schedule.apr > 0;
          const endTime = schedule.startTime + schedule.vestingDuration;
          const now = Math.floor(Date.now() / 1000);
          const isCompleted = now >= endTime;
          const progress = Math.min(100, Math.max(0, ((now - schedule.startTime) / schedule.vestingDuration) * 100));
          
          // Calculate claimable amount
          // For APR positions: principal + reward if completed
          // For linear: vested amount - claimed
          let claimable = 0;
          if (isAprPosition) {
             claimable = isCompleted && schedule.amountClaimed === 0 
              ? schedule.totalAmount + schedule.rewardAmount 
              : 0;
          } else {
             // Simplified calculation for display purposes - logic should match contract
             if (now >= endTime) {
               claimable = schedule.totalAmount - schedule.amountClaimed;
             } else if (now > schedule.startTime + schedule.cliffDuration) {
               const vested = (schedule.totalAmount * (now - schedule.startTime)) / schedule.vestingDuration;
               claimable = Math.max(0, vested - schedule.amountClaimed);
             }
          }

          const isClaimed = schedule.amountClaimed >= schedule.totalAmount;

          return (
            <Card key={schedule.id} className="border-border overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Left Status Bar */}
                <div className={`w-full md:w-2 h-2 md:h-auto ${isCompleted ? "bg-green-500" : "bg-primary"}`} />
                
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-muted-foreground">Locked Amount</span>
                        {isAprPosition && (
                          <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded font-bold">
                            {schedule.apr}% APR
                          </span>
                        )}
                      </div>
                      <div className="text-2xl font-bold">
                        {formatTokenAmount(schedule.totalAmount)} tBTC
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end">
                      <span className="text-sm text-muted-foreground">Rewards Earned</span>
                      <div className="text-xl font-bold text-green-500">
                        +{formatTokenAmount(isAprPosition ? schedule.rewardAmount : 0)} tBTC
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {isCompleted ? "Vesting Completed" : "Vesting Progress"}
                        </span>
                        <span className="font-mono">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-border">
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground block text-xs">Start Date</span>
                          <span className="font-medium">
                            {new Date(schedule.startTime * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-xs">Unlock Date</span>
                          <span className="font-medium">
                            {new Date(endTime * 1000).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {isClaimed ? (
                        <Button disabled variant="outline" className="gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Fully Claimed
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleClaim(schedule.id)}
                          disabled={claimable <= 0 || claimingId === schedule.id}
                          className="w-full sm:w-auto gap-2"
                        >
                          {claimingId === schedule.id ? (
                            "Claiming..."
                          ) : (
                            <>
                              <Unlock className="h-4 w-4" />
                              Claim {formatTokenAmount(claimable)} tBTC
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
