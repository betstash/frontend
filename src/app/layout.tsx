"use client";

import type { ReactNode } from "react";

import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import { WalletProvider } from "@/components/WalletProvider";
import { Toaster } from "@/components/ui/toaster";
import { WrongNetworkAlert } from "@/components/WrongNetworkAlert";

import "./globals.css";
import { WalletSelector } from "@/components/WalletSelector";
import { Button } from "@/components/ui/button";
import { Badge, Bell, Menu, Trophy } from "lucide-react";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <WalletProvider>
          <ReactQueryProvider>
            <div id="root">
              {/* Navbar */}
              <header className="sticky top-0 z-50 border-b border-gray-800 backdrop-blur-md bg-black/60">
                <div className="container mx-auto flex items-center justify-between h-16 px-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <Menu className="h-6 w-6" />
                    </Button>
                    <Link href="/" className="flex items-center space-x-2">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        BetStash
                      </span>
                    </Link>
                  </div>

                  <nav className="hidden lg:flex space-x-8">
                    <Link
                      href="/sports"
                      className="flex items-center text-sm opacity-80 hover:opacity-100 transition-opacity"
                    >
                      Sports
                    </Link>
                    <Link
                      href="/live"
                      className="flex items-center text-sm opacity-80 hover:opacity-100 transition-opacity"
                    >
                      Live
                      <Badge className="ml-2 py-0 border-green-500 text-green-500">12</Badge>
                    </Link>
                    <Link
                      href="/promotions"
                      className="flex items-center text-sm opacity-80 hover:opacity-100 transition-opacity"
                    >
                      Promotions
                    </Link>
                    <Link href="/ai-insights" className="flex items-center text-sm font-medium">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        AI Insights
                      </span>
                      <Badge className="ml-2 py-0 px-2 bg-gradient-to-r from-purple-500 to-blue-500">New</Badge>
                    </Link>
                  </nav>

                  <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Bell className="h-5 w-5" />
                    </Button>

                    {/* <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"> */}
                    <WalletSelector />
                    {/* </Button> */}
                  </div>
                </div>
              </header>

              {children}
            </div>
            <WrongNetworkAlert />
            <Toaster />
          </ReactQueryProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
