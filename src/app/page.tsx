"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { ArrowRight, ShieldCheck, Timer, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { isConnected, connect, isConnecting, error } = useWallet();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center space-y-8 bg-gradient-to-b from-background to-secondary/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-200">
            OPNet Vesting Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure, transparent, and efficient token vesting management for the OPNet ecosystem.
            Track your unlocks, claim rewards, and manage schedules with ease.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {isConnected ? (
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 h-12 bg-primary text-black hover:bg-primary/90">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                onClick={connect}
                isLoading={isConnecting}
                className="text-lg px-8 h-12 bg-primary text-black hover:bg-primary/90"
              >
                Connect Wallet <Wallet className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
          {error && (
            <div className="text-red-500 bg-red-500/10 px-4 py-2 rounded-md border border-red-500/20 animate-pulse">
              {error}
            </div>
          )}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<ShieldCheck className="h-10 w-10 text-primary" />}
            title="Secure Vesting"
            description="Smart contract based vesting ensures your tokens are safe and released according to schedule."
          />
          <FeatureCard 
            icon={<Timer className="h-10 w-10 text-primary" />}
            title="Automated Unlocks"
            description="Tokens are unlocked linearly over time. Claim your available balance whenever you want."
          />
          <FeatureCard 
            icon={<Wallet className="h-10 w-10 text-primary" />}
            title="OP_Wallet Integration"
            description="Seamlessly connect your OP_Wallet to manage your assets directly from the dashboard."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
