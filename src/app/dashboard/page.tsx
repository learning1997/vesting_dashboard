"use client";

import { useWallet } from "@/hooks/useWallet";
import { useVesting } from "@/hooks/useVesting";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTokenAmount } from "@/lib/utils";
import { Lock, Unlock, Coins, Wallet } from "lucide-react";
import { useState } from "react";
import { CreateVestingPosition } from "@/components/CreateVestingPosition";
import { VestingPositionsList } from "@/components/VestingPositionsList";

export default function Dashboard() {
  const { isConnected, connect } = useWallet();
  const { schedule, claimable, balance, isLoading, refresh } = useVesting();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    refresh();
    setRefreshTrigger(prev => prev + 1);
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <Card className="max-w-md mx-auto border-border bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-foreground">Connect Wallet</CardTitle>
            <CardDescription className="text-muted-foreground">
              Please connect your OP_Wallet to view your vesting dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={connect} className="w-full bg-primary text-black hover:bg-primary/90">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading && !schedule && !balance) {
    return <DashboardSkeleton />;
  }

  // Calculate stats
  // Note: These stats might need to be updated to aggregate across all schedules
  // For now, we'll keep the wallet balance as the main reliable stat here
  
  return (
    <div className="container mx-auto py-8 px-4 space-y-8 text-foreground">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-heading">Dashboard</h1>
          <p className="text-muted-foreground font-body">Manage your OPNet token vesting and rewards</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm" className="text-foreground border-border hover:bg-secondary">
          Refresh Data
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Wallet Balance" 
          value={`${formatTokenAmount(balance)} tBTC`}
          icon={<Wallet className="h-4 w-4 text-muted-foreground" />} 
          subValue="Available to stake"
        />
        {/* Placeholder stats for now - aggregated stats could be added later */}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Create Position */}
        <div className="lg:col-span-1">
          <CreateVestingPosition onCreated={handleRefresh} />
        </div>

        {/* Right Column: List of Positions */}
        <div className="lg:col-span-2">
          <VestingPositionsList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, subValue, highlight }: any) {
  return (
    <Card className={`border-border bg-card text-card-foreground ${highlight ? "border-primary bg-primary/5" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground font-body">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold font-mono ${highlight ? "text-primary" : "text-foreground"}`}>{value}</div>
        <p className="text-xs text-muted-foreground mt-1 font-body">{subValue}</p>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full col-span-2" />
      </div>
    </div>
  );
}
