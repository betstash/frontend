"use client";

// import { AccountInfo } from "@/components/AccountInfo";
import { Header } from "@/components/Header";
import { Icons } from "@/components/Icons";
// import { MessageBoard } from "@/components/MessageBoard";
// import { NetworkInfo } from "@/components/NetworkInfo";
import { TopBanner } from "@/components/TopBanner";
import { Button } from "@/components/ui/button";
// import { TransferAPT } from "@/components/TransferAPT";
// import { WalletDetails } from "@/components/WalletDetails";
// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { WalletSelector } from "@/components/WalletSelector";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Badge, Bell, ChevronRight, CreditCard, DollarSign, Gamepad2, Menu, Trophy, User } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

const sportIcons = {
  cricket: "/sports/cricket.svg",
  football: "/sports/football.svg",
  baseball: "/sports/baseball.svg",
};

interface Team {
  name: string;
  logo: string;
  odds: number;
}

interface Match {
  id: string;
  sport: "cricket" | "football" | "baseball";
  teams: {
    home: Team;
    away: Team;
  };
  startTime: string;
  status: "live" | "upcoming";
  maxBetting: number;
  currentBettingMembers: number;
}

// Mock data
const ongoingMatches = [
  {
    id: "m1",
    sport: "cricket",
    teams: {
      home: {
        name: "Mumbai Indians",
        logo: "/cricket/mumbai.jpg",
        odds: 1.75,
      },
      away: {
        name: "Chennai Super Kings",
        logo: "/cricket/chennai.jpg",
        odds: 2.1,
      },
    },
    startTime: "2025-02-18T14:30:00",
    status: "live",
  },
  {
    id: "m2",
    sport: "football",
    teams: {
      home: {
        name: "Real Madrid",
        logo: "/football/madrid.jpg",
        odds: 1.6,
      },
      away: {
        name: "Barcelona",
        logo: "/football/barcelona.jpg",
        odds: 2.3,
      },
    },
    startTime: "2025-02-18T18:45:00",
    status: "live",
  },
  {
    id: "m3",
    sport: "baseball",
    teams: {
      home: {
        name: "NY Yankees",
        logo: "/baseball/yankees.jpg",
        odds: 1.9,
      },
      away: {
        name: "Boston Red Sox",
        logo: "/baseball/redsox.jpg",
        odds: 1.85,
      },
    },
    startTime: "2025-02-18T17:00:00",
    status: "live",
  },
  {
    id: "m4",
    sport: "cricket",
    teams: {
      home: {
        name: "Delhi Capitals",
        logo: "/cricket/delhi.jpg",
        odds: 2.05,
      },
      away: {
        name: "Rajasthan Royals",
        logo: "/cricket/rajasthan.jpg",
        odds: 1.8,
      },
    },
    startTime: "2025-02-18T20:00:00",
    status: "upcoming",
  },
];

function App() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState("all");

  const [ongoingMatches, setOngoingMatches] = useState<Match[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const updatedMatch = JSON.parse(event.data);
      setOngoingMatches((prevMatches) => {
        const matchExists = prevMatches.find((match) => match.id === updatedMatch.id);
        return matchExists
          ? prevMatches.map((match) => (match.id === updatedMatch.id ? updatedMatch : match))
          : [...prevMatches, updatedMatch];
      });
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center ">
        {/* {connected ? ( */}
        {/* 
            <Card>
              <CardContent className="flex flex-col gap-10 pt-6">
                <WalletDetails />
                <NetworkInfo />
                <AccountInfo />
                <TransferAPT />
                <MessageBoard />
              </CardContent>
            </Card> */}
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
          <Head>
            <title>BetStash - Smart Betting with AI Onchain</title>
            <meta
              name="description"
              content="Bet on your favorite sports with AI-powered insights on the Aptos blockchain"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>

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

          <main className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <section className="py-10 lg:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    <span className="block">Smart Betting with</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                      AI Onchain
                    </span>
                  </h1>
                  <p className="text-lg text-gray-300 max-w-lg">
                    Experience the future of betting with AI-powered insights on the Aptos blockchain. Get personalized
                    predictions and secure transactions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      Start Betting
                    </Button>
                    <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800">
                      Learn More <ChevronRight className="ml-2 h-4 w-4" />
                    </Button> */}
                  </div>
                  <div className="pt-4 flex items-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                      <span>Secure Payments Powered By Aptos</span>
                    </div>
                    <div className="flex items-center">
                      {/* <User className="mr-2 h-4 w-4 text-blue-400" /> */}
                      {/* <span>24/7 Support</span> */}
                    </div>
                  </div>
                </div>
                {/* <div className="rounded-2xl overflow-hidden shadow-xl shadow-purple-500/10 border border-gray-800 bg-black/40">
                  <img src="/api/placeholder/600/400" alt="BetStash App Interface" className="w-full h-auto" />
                </div> */}
              </div>
            </section>

            {/* Live Matches Carousel */}
            <section className="py-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  <span className="mr-2">🔴</span> Live & Upcoming Matches
                </h2>
                <Link href="/matches" className="text-sm text-blue-400 hover:text-blue-300 flex items-center">
                  View all <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent>
                  {ongoingMatches.map((match) => (
                    <CarouselItem key={match.id} className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4">
                      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm overflow-hidden hover:border-purple-500/50 transition-all duration-300">
                        <CardContent className="p-0">
                          <div className="p-4 relative">
                            {match.status === "live" && (
                              <span className="mr-2 absolute top-4 right-4 text-white">🔴 Live</span>
                            )}
                            <div className="flex items-center mb-3">
                              <img src={sportIcons[match.sport]} alt={match.sport} className="h-5 w-5 mr-2" />
                              <span className="text-sm text-gray-300 capitalize">{match.sport}</span>
                            </div>
                            <div className="space-y-3">
                              {(["home", "away"] as const).map((teamType) => (
                                <div key={teamType} className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10 rounded-full border border-gray-700">
                                      <AvatarImage src={match.teams[teamType].logo} />
                                      <AvatarFallback>{match.teams[teamType].name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{match.teams[teamType].name}</p>
                                      <p className="text-sm text-gray-400">{teamType === "home" ? "Home" : "Away"}</p>
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-700">
                                    {match.teams[teamType].odds}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-gray-900/50 p-3 flex justify-between items-center">
                            <p className="text-sm text-gray-400">
                              {new Date(match.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                            >
                              Place Bet
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 bg-black/50 border-gray-700 text-white" />
                <CarouselNext className="right-0 bg-black/50 border-gray-700 text-white" />
              </Carousel>
            </section>

            {/* Popular Sports */}
            <section className="py-10">
              <h2 className="text-2xl font-bold mb-6">Popular Sports</h2>

              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start bg-gray-800/30  mb-6 gap-5 ">
                  <TabsTrigger value="all" className="data-[state=active]:bg-gray-700 p-2">
                    All Sports
                  </TabsTrigger>
                  <TabsTrigger value="cricket" className="p-2 data-[state=active]:bg-gray-700">
                    Cricket
                  </TabsTrigger>
                  <TabsTrigger value="football" className="p-2 data-[state=active]:bg-gray-700">
                    Football
                  </TabsTrigger>
                  <TabsTrigger value="baseball" className="p-2 data-[state=active]:bg-gray-700">
                    Baseball
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ongoingMatches.map((match) => (
                      <Card
                        key={match.id}
                        className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 transition-all cursor-pointer overflow-hidden"
                      >
                        <CardContent className="p-0">
                          <div className="p-4 relative">
                            {match.status === "live" && (
                              <span className="mr-2 absolute top-4 right-4 text-white">🔴 Live</span>
                            )}
                            <div className="flex items-center mb-3">
                              <img src={sportIcons[match.sport]} alt={match.sport} className="h-5 w-5 mr-2" />
                              <span className="text-sm text-gray-300 capitalize">{match.sport}</span>
                            </div>
                            <div className="space-y-3">
                              {(["home", "away"] as const).map((teamType) => (
                                <div key={teamType} className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10 rounded-full border border-gray-700">
                                      <AvatarImage src={match.teams[teamType].logo} />
                                      <AvatarFallback>{match.teams[teamType].name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{match.teams[teamType].name}</p>
                                      <p className="text-sm text-gray-400">{teamType === "home" ? "Home" : "Away"}</p>
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-700">
                                    {match.teams[teamType].odds}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-gray-900/50 p-3 flex justify-between items-center">
                            <p className="text-sm text-gray-400">
                              {new Date(match.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                            >
                              Place Bet
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                {/* Other Tab Content would go here, filtered by sport */}
              </Tabs>
            </section>

            {/* AI Insights Section */}
            <section className="py-10">
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-900/50 p-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="space-y-6 max-w-2xl">
                    <h2 className="text-3xl font-bold">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                        AI-Powered Insights
                      </span>
                    </h2>
                    <p className="text-lg text-gray-300">
                      Our advanced AI agents analyze millions of data points in real-time to give you the edge in your
                      betting decisions. Get personalized predictions based on team form, player performance, historical
                      data, and more.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="p-2 bg-purple-500/20 rounded-lg mr-4">
                          <Icons.chart className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Data-Driven Predictions</h4>
                          <p className="text-sm text-gray-400">
                            Get match predictions backed by advanced statistical models
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="p-2 bg-blue-500/20 rounded-lg mr-4">
                          <Icons.bot className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Personalized Recommendations</h4>
                          <p className="text-sm text-gray-400">
                            Receive tailored betting suggestions based on your preferences
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button className="bg-white text-gray-900 hover:bg-gray-200">Try AI Insights</Button>
                  </div>
                  <div className="hidden lg:block relative">
                    <div className="absolute -top-10 -left-10 h-48 w-48 bg-purple-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -right-10 h-48 w-48 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <img src="/api/placeholder/350/350" alt="AI Insights" className="relative z-10 rounded-lg" />
                  </div>
                </div>
              </div>
            </section>

            {/* Blockchain Benefits */}
            <section className="py-10">
              <h2 className="text-2xl font-bold mb-8">Powered by Aptos Blockchain</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-gray-800/30 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="p-3 bg-purple-500/20 rounded-full w-fit mb-4">
                      <CreditCard className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Instant Payouts</h3>
                    <p className="text-gray-400">
                      Withdraw your winnings instantly with blockchain-powered transactions. No more waiting for days to
                      receive your money.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/30 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="p-3 bg-blue-500/20 rounded-full w-fit mb-4">
                      <Icons.lock className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Secure & Transparent</h3>
                    <p className="text-gray-400">
                      All bets are recorded on the Aptos blockchain, ensuring complete transparency and security for
                      every transaction.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/30 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="p-3 bg-green-500/20 rounded-full w-fit mb-4">
                      <Gamepad2 className="h-6 w-6 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Smart Contracts</h3>
                    <p className="text-gray-400">
                      Automated smart contracts ensure fair play and instant settlement of bets without any human
                      intervention.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-12">
              <div className="text-center max-w-2xl mx-auto space-y-8">
                <h2 className="text-3xl font-bold">Ready to experience the future of betting?</h2>
                <p className="text-lg text-gray-300">
                  Join thousands of smart bettors who are already using BetStash to make data-driven betting decisions.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    Sign Up Now
                  </Button>
                  <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800">
                    Learn More
                  </Button>
                </div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 border-t border-gray-800 py-10">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <Link href="/" className="flex items-center space-x-2 mb-6">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">BetStash</span>
                  </Link>
                  <p className="text-gray-400 text-sm mb-6">
                    Smart betting powered by AI and blockchain technology. Get the edge with data-driven predictions on
                    your favorite sports.
                  </p>
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Icons.twitter className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Icons.facebook className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Icons.instagram className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li>
                      <Link href="#" className="hover:text-white transition-colors">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-white transition-colors">
                        Sports
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-white transition-colors">
                        Live Betting
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-white transition-colors">
                        Promotions
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-white transition-colors">
                        AI Insights
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Support</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li>
                      <Link href="#" className="hover:text-white transition-colors">
                        Help Center
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-white transition-colors">
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-white transition-colors">
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-white transition-colors">
                        Responsible Gambling
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-white transition-colors">
                        Terms & Conditions
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Download Our App</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Get the full experience on mobile with our dedicated app.
                  </p>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start border-gray-700">
                      <Icons.apple className="mr-2 h-5 w-5" />
                      App Store
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-gray-700">
                      <Icons.google className="mr-2 h-5 w-5" />
                      Google Play
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-500">© 2025 BetStash. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-400">
                    Privacy Policy
                  </Link>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-400">
                    Terms of Service
                  </Link>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-400">
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
        )
        {/* // : (
        //   <CardHeader>
        //     <CardTitle>To get started Connect a wallet</CardTitle>
        //   </CardHeader>
        // )} */}
      </div>
    </>
  );
}

export default App;

// // pages/index.tsx
// import { useState } from 'react';
// import Head from 'next/head';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from '@/components/ui/carousel';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Icons } from '@/components/icons';
// import { Badge } from '@/components/ui/badge';
// import { Bell, ChevronRight, CreditCard, DollarSign, Gamepad2, Menu, Trophy, User } from 'lucide-react';

// export default function Home() {
//   const [activeTab, setActiveTab] = useState('all');

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
//       <Head>
//         <title>BetStash - Smart Betting with AI & Blockchain</title>
//         <meta name="description" content="Bet on your favorite sports with AI-powered insights on the Aptos blockchain" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       {/* Navbar */}
//       <header className="sticky top-0 z-50 border-b border-gray-800 backdrop-blur-md bg-black/60">
//         <div className="container mx-auto flex items-center justify-between h-16 px-4">
//           <div className="flex items-center space-x-2">
//             <Button variant="ghost" size="icon" className="lg:hidden">
//               <Menu className="h-6 w-6" />
//             </Button>
//             <Link href="/" className="flex items-center space-x-2">
//               <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
//                 <Trophy className="h-5 w-5 text-white" />
//               </div>
//               <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">BetStash</span>
//             </Link>
//           </div>

//           <nav className="hidden lg:flex space-x-8">
//             <Link href="/sports" className="flex items-center text-sm opacity-80 hover:opacity-100 transition-opacity">
//               Sports
//             </Link>
//             <Link href="/live" className="flex items-center text-sm opacity-80 hover:opacity-100 transition-opacity">
//               Live
//               <Badge variant="outline" className="ml-2 py-0 border-green-500 text-green-500">12</Badge>
//             </Link>
//             <Link href="/promotions" className="flex items-center text-sm opacity-80 hover:opacity-100 transition-opacity">
//               Promotions
//             </Link>
//             <Link href="/ai-insights" className="flex items-center text-sm font-medium">
//               <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">AI Insights</span>
//               <Badge variant="default" className="ml-2 py-0 px-2 bg-gradient-to-r from-purple-500 to-blue-500">New</Badge>
//             </Link>
//           </nav>

//           <div className="flex items-center space-x-3">
//             <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
//               <Bell className="h-5 w-5" />
//             </Button>
//             <Button variant="outline" className="hidden md:flex">Sign In</Button>
//             <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
//               Register
//             </Button>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         {/* Hero Section */}
//         <section className="py-10 lg:py-16">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
//             <div className="space-y-6">
//               <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
//                 <span className="block">Smart Betting with</span>
//                 <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">AI & Blockchain</span>
//               </h1>
//               <p className="text-lg text-gray-300 max-w-lg">
//                 Experience the future of betting with AI-powered insights on the Aptos blockchain.
//                 Get personalized predictions and secure transactions.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
//                   Start Betting
//                 </Button>
//                 <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800">
//                   Learn More <ChevronRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </div>
//               <div className="pt-4 flex items-center space-x-6 text-sm text-gray-400">
//                 <div className="flex items-center">
//                   <DollarSign className="mr-2 h-4 w-4 text-green-500" />
//                   <span>Secure Payments</span>
//                 </div>
//                 <div className="flex items-center">
//                   <User className="mr-2 h-4 w-4 text-blue-400" />
//                   <span>24/7 Support</span>
//                 </div>
//               </div>
//             </div>
//             <div className="rounded-2xl overflow-hidden shadow-xl shadow-purple-500/10 border border-gray-800 bg-black/40">
//               <img
//                 src="/api/placeholder/600/400"
//                 alt="BetStash App Interface"
//                 className="w-full h-auto"
//               />
//             </div>
//           </div>
//         </section>

//         {/* Live Matches Carousel */}
//         <section className="py-10">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold">
//               <span className="mr-2">🔴</span> Live & Upcoming Matches
//             </h2>
//             <Link href="/matches" className="text-sm text-blue-400 hover:text-blue-300 flex items-center">
//               View all <ChevronRight className="ml-1 h-4 w-4" />
//             </Link>
//           </div>

//           <Carousel
//             opts={{
//               align: 'start',
//             }}
//             className="w-full"
//           >
//             <CarouselContent>
//               {ongoingMatches.map((match) => (
//                 <CarouselItem key={match.id} className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4">
//                   <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm overflow-hidden hover:border-purple-500/50 transition-all duration-300">
//                     <CardContent className="p-0">
//                       <div className="p-4 relative">
//                         {match.status === 'live' && (
//                           <Badge className="absolute top-4 right-4 bg-red-500 text-white">LIVE</Badge>
//                         )}
//                         <div className="flex items-center mb-3">
//                           <img
//                             src={sportIcons[match.sport]}
//                             alt={match.sport}
//                             className="h-5 w-5 mr-2"
//                           />
//                           <span className="text-sm text-gray-300 capitalize">{match.sport}</span>
//                         </div>
//                         <div className="space-y-3">
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-3">
//                               <Avatar className="h-10 w-10 rounded-full border border-gray-700">
//                                 <AvatarImage src={match.teams.home.logo} />
//                                 <AvatarFallback>{match.teams.home.name.substring(0, 2)}</AvatarFallback>
//                               </Avatar>
//                               <div>
//                                 <p className="font-medium">{match.teams.home.name}</p>
//                                 <p className="text-sm text-gray-400">Home</p>
//                               </div>
//                             </div>
//                             <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-700">
//                               {match.teams.home.odds}
//                             </Button>
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-3">
//                               <Avatar className="h-10 w-10 rounded-full border border-gray-700">
//                                 <AvatarImage src={match.teams.away.logo} />
//                                 <AvatarFallback>{match.teams.away.name.substring(0, 2)}</AvatarFallback>
//                               </Avatar>
//                               <div>
//                                 <p className="font-medium">{match.teams.away.name}</p>
//                                 <p className="text-sm text-gray-400">Away</p>
//                               </div>
//                             </div>
//                             <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-700">
//                               {match.teams.away.odds}
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="bg-gray-900/50 p-3 flex justify-between items-center">
//                         <p className="text-sm text-gray-400">
//                           {new Date(match.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                         </p>
//                         <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
//                           Place Bet
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </CarouselItem>
//               ))}
//             </CarouselContent>
//             <CarouselPrevious className="left-0 bg-black/50 border-gray-700 text-white" />
//             <CarouselNext className="right-0 bg-black/50 border-gray-700 text-white" />
//           </Carousel>
//         </section>

//         {/* Popular Sports */}
//         <section className="py-10">
//           <h2 className="text-2xl font-bold mb-6">
//             Popular Sports
//           </h2>

//           <Tabs
//             defaultValue="all"
//             value={activeTab}
//             onValueChange={setActiveTab}
//             className="w-full"
//           >
//             <TabsList className="w-full justify-start bg-gray-800/30 p-1 mb-6">
//               <TabsTrigger value="all" className="data-[state=active]:bg-gray-700">All Sports</TabsTrigger>
//               <TabsTrigger value="cricket" className="data-[state=active]:bg-gray-700">Cricket</TabsTrigger>
//               <TabsTrigger value="football" className="data-[state=active]:bg-gray-700">Football</TabsTrigger>
//               <TabsTrigger value="baseball" className="data-[state=active]:bg-gray-700">Baseball</TabsTrigger>
//             </TabsList>
//             <TabsContent value="all" className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {ongoingMatches.map(match => (
//                   <Card key={match.id} className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 transition-all cursor-pointer overflow-hidden">
//                     <CardContent className="p-0">
//                       <div className="p-4">
//                         <div className="flex items-center justify-between mb-4">
//                           <div className="flex items-center space-x-2">
//                             <img
//                               src={sportIcons[match.sport]}
//                               alt={match.sport}
//                               className="h-5 w-5"
//                             />
//                             <span className="text-sm text-gray-300 capitalize">{match.sport}</span>
//                           </div>
//                           {match.status === 'live' ? (
//                             <Badge className="bg-red-500 text-white">LIVE</Badge>
//                           ) : (
//                             <Badge variant="outline" className="border-gray-600 text-gray-300">UPCOMING</Badge>
//                           )}
//                         </div>
//                         <div className="flex justify-between items-center mb-4">
//                           <div className="flex items-center space-x-3">
//                             <Avatar className="h-8 w-8 rounded-full">
//                               <AvatarImage src={match.teams.home.logo} />
//                               <AvatarFallback>{match.teams.home.name.substring(0, 2)}</AvatarFallback>
//                             </Avatar>
//                             <span className="font-medium">{match.teams.home.name}</span>
//                           </div>
//                           <span className="font-bold">{match.teams.home.odds}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <div className="flex items-center space-x-3">
//                             <Avatar className="h-8 w-8 rounded-full">
//                               <AvatarImage src={match.teams.away.logo} />
//                               <AvatarFallback>{match.teams.away.name.substring(0, 2)}</AvatarFallback>
//                             </Avatar>
//                             <span className="font-medium">{match.teams.away.name}</span>
//                           </div>
//                           <span className="font-bold">{match.teams.away.odds}</span>
//                         </div>
//                       </div>
//                       <div className="bg-black/30 p-3 flex justify-between items-center">
//                         <p className="text-sm text-gray-400">
//                           {new Date(match.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                         </p>
//                         <Button size="sm" variant="outline" className="border-gray-700 hover:bg-gray-700">
//                           View
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </TabsContent>
//             {/* Other Tab Content would go here, filtered by sport */}
//           </Tabs>
//         </section>

//         {/* AI Insights Section */}
//         <section className="py-10">
//           <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-900/50 p-8">
//             <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
//               <div className="space-y-6 max-w-2xl">
//                 <h2 className="text-3xl font-bold">
//                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
//                     AI-Powered Insights
//                   </span>
//                 </h2>
//                 <p className="text-lg text-gray-300">
//                   Our advanced AI agents analyze millions of data points in real-time to give you the edge
//                   in your betting decisions. Get personalized predictions based on team form, player performance,
//                   historical data, and more.
//                 </p>
//                 <div className="space-y-4">
//                   <div className="flex items-start">
//                     <div className="p-2 bg-purple-500/20 rounded-lg mr-4">
//                       <Icons.chart className="h-5 w-5 text-purple-400" />
//                     </div>
//                     <div>
//                       <h4 className="font-medium mb-1">Data-Driven Predictions</h4>
//                       <p className="text-sm text-gray-400">Get match predictions backed by advanced statistical models</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <div className="p-2 bg-blue-500/20 rounded-lg mr-4">
//                       <Icons.bot className="h-5 w-5 text-blue-400" />
//                     </div>
//                     <div>
//                       <h4 className="font-medium mb-1">Personalized Recommendations</h4>
//                       <p className="text-sm text-gray-400">Receive tailored betting suggestions based on your preferences</p>
//                     </div>
//                   </div>
//                 </div>
//                 <Button className="bg-white text-gray-900 hover:bg-gray-200">
//                   Try AI Insights
//                 </Button>
//               </div>
//               <div className="hidden lg:block relative">
//                 <div className="absolute -top-10 -left-10 h-48 w-48 bg-purple-500/20 rounded-full blur-3xl"></div>
//                 <div className="absolute -bottom-10 -right-10 h-48 w-48 bg-blue-500/20 rounded-full blur-3xl"></div>
//                 <img
//                   src="/api/placeholder/350/350"
//                   alt="AI Insights"
//                   className="relative z-10 rounded-lg"
//                 />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Blockchain Benefits */}
//         <section className="py-10">
//           <h2 className="text-2xl font-bold mb-8">
//             Powered by Aptos Blockchain
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <Card className="bg-gray-800/30 border-gray-700">
//               <CardContent className="pt-6">
//                 <div className="p-3 bg-purple-500/20 rounded-full w-fit mb-4">
//                   <CreditCard className="h-6 w-6 text-purple-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">Instant Payouts</h3>
//                 <p className="text-gray-400">
//                   Withdraw your winnings instantly with blockchain-powered transactions.
//                   No more waiting for days to receive your money.
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-gray-800/30 border-gray-700">
//               <CardContent className="pt-6">
//                 <div className="p-3 bg-blue-500/20 rounded-full w-fit mb-4">
//                   <Icons.lock className="h-6 w-6 text-blue-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">Secure & Transparent</h3>
//                 <p className="text-gray-400">
//                   All bets are recorded on the Aptos blockchain, ensuring complete
//                   transparency and security for every transaction.
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-gray-800/30 border-gray-700">
//               <CardContent className="pt-6">
//                 <div className="p-3 bg-green-500/20 rounded-full w-fit mb-4">
//                   <Gamepad2 className="h-6 w-6 text-green-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">Smart Contracts</h3>
//                 <p className="text-gray-400">
//                   Automated smart contracts ensure fair play and instant settlement of
//                   bets without any human intervention.
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </section>

//         {/* CTA Section */}
//         <section className="py-12">
//           <div className="text-center max-w-2xl mx-auto space-y-8">
//             <h2 className="text-3xl font-bold">
//               Ready to experience the future of betting?
//             </h2>
//             <p className="text-lg text-gray-300">
//               Join thousands of smart bettors who are already using BetStash to make
//               data-driven betting decisions.
//             </p>
//             <div className="flex flex-col sm:flex-row justify-center gap-4">
//               <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
//                 Sign Up Now
//               </Button>
//               <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800">
//                 Learn More
//               </Button>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-900 border-t border-gray-800 py-10">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             <div>
//               <Link href="/" className="flex items-center space-x-2 mb-6">
//                 <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
//                   <Trophy className="h-5 w-5 text-white" />
//                 </div>
//                 <span className="text-xl font-bold tracking-tight">BetStash</span>
//               </Link>
//               <p className="text-gray-400 text-sm mb-6">
//                 Smart betting powered by AI and blockchain technology. Get the edge with
//                 data-driven predictions on your favorite sports.
//               </p>
//               <div className="flex space-x-4">
//                 <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
//                   <Icons.twitter className="h-5 w-5" />
//                 </Button>
//                 <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
//                   <Icons.facebook className="h-5 w-5" />
//                 </Button>
//                 <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
//                   <Icons.instagram className="h-5 w-5" />
//                 </Button>
//               </div>
//             </div>

//             <div>
//               <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
//               <ul className="space-y-3 text-gray-400">
//                 <li><Link href="#" className="hover:text-white transition-colors">Home</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">Sports</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">Live Betting</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">Promotions</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">AI Insights</Link></li>
//               </ul>
//             </div>

//             <div>
//               <h3 className="font-semibold text-lg mb-4">Support</h3>
//               <ul className="space-y-3 text-gray-400">
//                 <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">Responsible Gambling</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
//               </ul>
//             </div>

//             <div>
//               <h3 className="font-semibold text-lg mb-4">Download Our App</h3>
//               <p className="text-gray-400 text-sm mb-4">
//                 Get the full experience on mobile with our dedicated app.
//               </p>
//               <div className="space-y-3">
//                 <Button variant="outline" className="w-full justify-start border-gray-700">
//                   <Icons.apple className="mr-2 h-5 w-5" />
//                   App Store
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start border-gray-700">
//                   <Icons.google className="mr-2 h-5 w-5" />
//                   Google Play
//                 </Button>
//               </div>
//             </div>
//           </div>

//           <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
//             <p className="text-sm text-gray-500">
//               © 2025 BetStash. All rights reserved.
//             </p>
//             <div className="flex space-x-4 mt-4 md:mt-0">
//               <Link href="#" className="text-sm text-gray-500 hover:text-gray-400">Privacy Policy</Link>
//               <Link href="#" className="text-sm text-gray-500 hover:text-gray-400">Terms of Service</Link>
//               <Link href="#" className="text-sm text-gray-500 hover:text-gray-400">Cookie Policy</Link>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
