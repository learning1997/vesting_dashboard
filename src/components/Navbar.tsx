"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/utils";
import { Bitcoin, LayoutDashboard, Lock, ShieldCheck } from "lucide-react";

export function Navbar() {
  const { address, isConnected, isConnecting, connect, disconnect, error } = useWallet();
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Bitcoin className="h-8 w-8" />
            <span>OPNet Vesting</span>
          </Link>
          
          <div className="hidden md:flex gap-4">
            {isConnected && (
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-col sm:flex-row">
          {error && (
            <span className="text-red-500 text-xs hidden md:block animate-pulse">{error}</span>
          )}
          {isConnected ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm text-muted-foreground">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                {formatAddress(address!)}
              </div>
              <Button variant="outline" onClick={disconnect}>
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <Button 
                onClick={connect} 
                isLoading={isConnecting}
                className="bg-primary text-black hover:bg-primary/90"
              >
                Connect Wallet
              </Button>
              {error && (
                <span className="text-red-500 text-xs mt-1 md:hidden">{error}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
