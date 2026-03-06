import type { Metadata } from "next";
import { Space_Mono, Syne } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/hooks/useWallet";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";

const spaceMono = Space_Mono({ 
  subsets: ["latin"], 
  weight: ["400", "700"],
  variable: "--font-space-mono" 
});

const syne = Syne({ 
  subsets: ["latin"], 
  variable: "--font-syne" 
});

export const metadata: Metadata = {
  title: "OPNet Vesting Dashboard",
  description: "Manage your token vesting schedules on OPNet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        spaceMono.variable, 
        syne.variable, 
        "min-h-screen bg-background text-foreground font-body antialiased"
      )}>
        <WalletProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
