import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Clock, DollarSign, AlertCircle } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import axios from "axios";
interface Team {
  name: string;
  logo: string;
  odds: number;
}

interface UserBet {
  address: string;
  team: "home" | "away"; // The team the user is betting on
  bettingAmount: number; // The amount the user is betting
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
  users: UserBet[];
  score: { home: number; away: number }; // Array of users and their betting details
}

interface Bet {
  user: string;
  amount: number;
  team: string;
  timestamp: Date;
}

interface BettingPanelProps {
  matchData: Match;
}

const BettingPanel: React.FC<BettingPanelProps> = ({ matchData }) => {
  const [selectedTeam, setSelectedTeam] = useState<"home" | "away" | null>(null);
  const { connected, account } = useWallet();
  const [betAmount, setBetAmount] = useState<string>("");
  const [recentBets, setRecentBets] = useState<Bet[]>([
    { user: "Alex Thompson", amount: 50, team: "home", timestamp: new Date() },
    { user: "Sarah Chen", amount: 75, team: "away", timestamp: new Date() },
  ]);

  const handlePlaceBet = async () => {
    if (!selectedTeam || !betAmount || Number(betAmount) > matchData.maxBetting) return;

    const newBet: Bet = {
      user: account?.address as string,
      amount: Number(betAmount),
      team: selectedTeam,
      timestamp: new Date(),
    };

    console.log("New bet placed:", {
      matchId: matchData.id,
      sport: matchData.sport,
      selectedTeam: matchData.teams[selectedTeam].name,
      amount: Number(betAmount),
      timestamp: new Date(),
      user: account?.address as string,
    });

    try {
      const response = await axios.post("http://localhost:3001/place-bet", {
        matchId: matchData.id,
        address: account?.address,
        bettingAmount: Number(betAmount),
        team: selectedTeam,
      });

      if (response.data.success) {
        console.log("Bet placed successfully on the server:", response.data.match);
        setRecentBets([newBet, ...recentBets]);
      } else {
        console.error("Error placing bet:", response.data.error);
      }
    } catch (error) {
      console.error("Failed to place bet:", error);
    }

    setSelectedTeam(null);
    setBetAmount("");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  if (!connected) {
    return <>Please connect the wallet to bet </>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Match Info Card */}
        <Card className="bg-gray-800/30 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="capitalize">{matchData.sport}</span>
                <span>•</span>
                <span className="text-sm text-gray-400">Match ID: {matchData.id}</span>
              </div>
              {matchData.status === "live" && (
                <span className="text-sm flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  Live
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Start Time: {formatDateTime(matchData.startTime)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Active Bettors: {matchData.currentBettingMembers}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Max Bet: ${matchData.maxBetting}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Betting Card */}
        <Card className="bg-gray-800/30 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Place Your Bet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teams Selection */}
              <div className="space-y-4">
                {(["home", "away"] as const).map((teamType) => (
                  <div
                    key={teamType}
                    onClick={() => setSelectedTeam(teamType)}
                    className={`p-4 rounded-lg border ${
                      selectedTeam === teamType
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    } cursor-pointer transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 rounded-full border border-gray-700">
                          <AvatarImage src={matchData.teams[teamType].logo} />
                          <AvatarFallback>{matchData.teams[teamType].name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{matchData.teams[teamType].name}</p>
                          <div className="flex gap-8">
                            <p className="text-sm text-gray-400">Odds: {matchData.teams[teamType].odds}</p>
                            <p className="text-sm text-gray-400">
                              Score: {teamType === "home" ? matchData.score.home : matchData.score.away}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Betting Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount" className="text-white">
                    Bet Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder={`Enter amount (max $${matchData.maxBetting})`}
                    max={matchData.maxBetting}
                  />
                  {Number(betAmount) > matchData.maxBetting && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Amount exceeds maximum betting limit
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  Potential winnings: $
                  {selectedTeam ? (Number(betAmount) * matchData.teams[selectedTeam].odds).toFixed(2) : "0.00"}
                </div>
                <Button
                  onClick={handlePlaceBet}
                  disabled={!selectedTeam || !betAmount || Number(betAmount) > matchData.maxBetting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Place Bet
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bets */}
        <Card className="bg-gray-800/30 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Recent Bets ({matchData.currentBettingMembers})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {matchData.users.map((bet, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                  <div>
                    <p className="text-white font-medium">{bet.address}</p>
                    <p className="text-sm text-gray-400">Bet on {matchData.teams[bet.team as "home" | "away"].name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">${bet.bettingAmount}</p>
                    <p className="text-sm text-gray-400">
                      Potential win: $
                      {(bet.bettingAmount * matchData.teams[bet.team as "home" | "away"].odds).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BettingPanel;
