"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { 
  ArrowRight, 
  ShieldCheck, 
  Wallet, 
  TrendingUp, 
  Lock, 
  LayoutDashboard,
  Coins,
  Clock,
  Gift,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { isConnected, connect, isConnecting, error } = useWallet();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight font-heading">
                Smart Vesting <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600">
                  Automated Vault
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
                Secure your Bitcoin yield on OPNet.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full"
            >
              {isConnected ? (
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full text-lg px-8 h-14 bg-primary text-black hover:bg-primary/90 rounded-xl">
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    onClick={connect}
                    isLoading={isConnecting}
                    className="w-full sm:w-auto text-lg px-8 h-14 bg-primary text-black hover:bg-primary/90 rounded-xl"
                  >
                    Connect Wallet <Wallet className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Why Stake Section */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Stake Your Tokens?</h2>
            <p className="text-muted-foreground text-lg">
              Maximize your potential returns while securing the network. Our vesting system is designed for long-term growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<TrendingUp className="h-8 w-8 text-primary" />}
              title="Flexible Vesting"
              description="Choose vesting durations that suit your strategy, from 1 day to 12 months."
            />
            <FeatureCard 
              icon={<Coins className="h-8 w-8 text-primary" />}
              title="High APR Rewards"
              description="Earn up to 40% APR by locking your tokens for longer periods."
            />
            <FeatureCard 
              icon={<Lock className="h-8 w-8 text-primary" />}
              title="Secure Vault System"
              description="Tokens are locked in a secure vault wallet and rewards are distributed automatically."
            />
            <FeatureCard 
              icon={<LayoutDashboard className="h-8 w-8 text-primary" />}
              title="Transparent Dashboard"
              description="Track your vesting positions, accrued rewards, and unlock times in real-time."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Vesting Works</h2>
            <p className="text-muted-foreground text-lg">
              Start earning rewards in just a few simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10" />
            
            <StepCard 
              number={1}
              icon={<Wallet className="h-6 w-6" />}
              title="Connect Wallet"
              description="Connect your OP_Wallet to access the dashboard."
            />
            <StepCard 
              number={2}
              icon={<Coins className="h-6 w-6" />}
              title="Choose Amount"
              description="Select how many tokens you want to vest securely."
            />
            <StepCard 
              number={3}
              icon={<Clock className="h-6 w-6" />}
              title="Select Duration"
              description="Pick a period (1 day to 12 months) to boost your APR."
            />
            <StepCard 
              number={4}
              icon={<Gift className="h-6 w-6" />}
              title="Earn & Claim"
              description="Wait for maturity and claim your principal plus rewards."
            />
          </div>
        </div>
      </section>

      {/* Reward Tiers Section */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Vesting Reward Tiers</h2>
            <p className="text-muted-foreground text-lg">
              Higher commitment, higher returns. Choose your tier wisely.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <RewardCard duration="1 Day" apr={5} />
            <RewardCard duration="3 Months" apr={12} recommended />
            <RewardCard duration="6 Months" apr={20} />
            <RewardCard duration="12 Months" apr={40} highlight />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-3xl p-12 border border-primary/20">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Earning?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users securing their yield on the OPNet ecosystem today.
            </p>
            <Button 
              size="lg" 
              onClick={isConnected ? () => window.location.href = '/dashboard' : connect}
              className="text-lg px-10 h-14 bg-primary text-black hover:bg-primary/90 rounded-xl"
            >
              {isConnected ? "Go to Dashboard" : "Connect Wallet Now"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5 group"
    >
      <div className="mb-6 p-4 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StepCard({ number, icon, title, description }: { number: number, icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="relative flex flex-col items-center text-center p-6">
      <div className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary font-bold text-xl mb-4 z-10 relative shadow-[0_0_0_8px_rgba(var(--background))]">
        {number}
      </div>
      <div className="mb-4 text-primary bg-primary/10 p-3 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

function RewardCard({ duration, apr, recommended, highlight }: { duration: string, apr: number, recommended?: boolean, highlight?: boolean }) {
  return (
    <div className={`relative p-8 rounded-2xl border transition-all ${
      highlight 
        ? "bg-primary/10 border-primary shadow-lg shadow-primary/10 scale-105 z-10" 
        : "bg-card border-border hover:border-primary/50"
    }`}>
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
          Recommended
        </div>
      )}
      <div className="text-center space-y-4">
        <h3 className="text-lg font-medium text-muted-foreground">{duration}</h3>
        <div className="text-5xl font-bold text-foreground">
          {apr}% <span className="text-xl text-muted-foreground font-normal">APR</span>
        </div>
        <ul className="space-y-3 pt-6 text-sm text-left">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Guaranteed Yield</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Full Principal Back</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Auto-compounding</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
