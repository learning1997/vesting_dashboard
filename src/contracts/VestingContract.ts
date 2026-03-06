export interface VestingSchedule {
  id: string; // Unique ID for each schedule
  recipient: string;
  totalAmount: number;
  startTime: number;
  cliffDuration: number;
  vestingDuration: number;
  amountClaimed: number;
  apr: number; // Added APR field
  rewardAmount: number; // Calculated reward amount
  txHash?: string; // Transaction hash of the lock
  status?: 'active' | 'completed' | 'claimed';
}

export class VestingContract {
  // Use a map where the key is the schedule ID, not just the recipient
  private schedules: Map<string, VestingSchedule> = new Map();
  // Map to store list of schedule IDs per user
  private userSchedules: Map<string, string[]> = new Map();
  private tokenBalance: Map<string, number> = new Map();
  private totalLocked: number = 0;
  private totalReleased: number = 0;

  constructor() {
    // Initialize with some dummy data for testing
    this.createVestingSchedule(
      "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      10000,
      Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60, // Started 30 days ago
      60 * 24 * 60 * 60, // 60 days cliff
      365 * 24 * 60 * 60, // 1 year vesting
      0 // Default 0 APR for admin created schedules
    );
  }

  createVestingSchedule(
    recipient: string,
    amount: number,
    start: number,
    cliff: number,
    duration: number,
    apr: number = 0
  ) {
    const id = Math.random().toString(36).substring(2, 15);
    
    // Calculate reward based on APR: (amount * APR/100 * duration_in_years)
    // Duration is in seconds, so convert to years: duration / (365 * 24 * 60 * 60)
    const durationInYears = duration / (365 * 24 * 60 * 60);
    const rewardAmount = Math.floor(amount * (apr / 100) * durationInYears);

    const schedule: VestingSchedule = {
      id,
      recipient,
      totalAmount: amount,
      startTime: start,
      cliffDuration: cliff,
      vestingDuration: duration,
      amountClaimed: 0,
      apr,
      rewardAmount,
    };

    this.schedules.set(id, schedule);
    
    // Add to user's list of schedules
    const userList = this.userSchedules.get(recipient) || [];
    userList.push(id);
    this.userSchedules.set(recipient, userList);

    this.totalLocked += amount;
    return schedule;
  }

  // Get all schedules for a specific user
  getUserVestingSchedules(user: string): VestingSchedule[] {
    const scheduleIds = this.userSchedules.get(user) || [];
    return scheduleIds
      .map(id => this.schedules.get(id))
      .filter((s): s is VestingSchedule => s !== undefined);
  }

  // Kept for backward compatibility, returns the first schedule found or undefined
  getVestingSchedule(user: string): VestingSchedule | undefined {
    const schedules = this.getUserVestingSchedules(user);
    return schedules.length > 0 ? schedules[0] : undefined;
  }

  getClaimableAmount(scheduleId: string): number {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    
    // For APR pools, users can only claim AFTER the vesting duration ends
    if (schedule.apr > 0) {
      if (currentTime < schedule.startTime + schedule.vestingDuration) {
        return 0;
      }
      // Return principal + full reward
      return (schedule.totalAmount + schedule.rewardAmount) - schedule.amountClaimed;
    }

    // Standard linear vesting logic (for admin created schedules)
    if (currentTime < schedule.startTime + schedule.cliffDuration) {
      return 0;
    }

    if (currentTime >= schedule.startTime + schedule.vestingDuration) {
      return schedule.totalAmount - schedule.amountClaimed;
    }

    const timeVested = currentTime - schedule.startTime;
    const vestedAmount = Math.floor(
      (schedule.totalAmount * timeVested) / schedule.vestingDuration
    );
    
    return Math.max(0, vestedAmount - schedule.amountClaimed);
  }

  // Calculate total claimable across all schedules for a user
  getTotalClaimableAmount(user: string): number {
    const schedules = this.getUserVestingSchedules(user);
    return schedules.reduce((total, schedule) => {
      return total + this.getClaimableAmount(schedule.id);
    }, 0);
  }

  claimTokens(scheduleId: string): number {
    const claimable = this.getClaimableAmount(scheduleId);
    if (claimable <= 0) {
      throw new Error("No tokens to claim");
    }

    const schedule = this.schedules.get(scheduleId);
    if (schedule) {
      schedule.amountClaimed += claimable;
      this.totalReleased += claimable;
      
      // Update user token balance
      const currentBalance = this.tokenBalance.get(schedule.recipient) || 0;
      this.tokenBalance.set(schedule.recipient, currentBalance + claimable);
    }
    return claimable;
  }

  getTokenBalance(user: string): number {
    return this.tokenBalance.get(user) || 0;
  }

  getAllSchedules(): VestingSchedule[] {
    return Array.from(this.schedules.values());
  }

  getStats() {
    return {
      totalLocked: this.totalLocked,
      totalReleased: this.totalReleased,
    };
  }
}

// Singleton instance to simulate the deployed contract
export const vestingContract = new VestingContract();
