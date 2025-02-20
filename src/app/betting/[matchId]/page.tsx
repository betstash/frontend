"use client";
import React, { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import BettingPanel from "@/components/BettingPanel"; // Assuming this is your betting component

interface PageProps {
  params: {
    matchId: string;
  };
}

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

export default function BettingPage({ params }: PageProps) {
  const [match, setMatch] = useState(null);

  useEffect(() => {
    // Connect to the WebSocket server
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "INITIAL_DATA") {
        // Find the specific match from the initial data
        const foundMatch = message.data.find((m: Match) => m.id === params.matchId);
        if (foundMatch) {
          setMatch(foundMatch);
        } else {
          notFound(); // Show 404 if the match is not found
        }
      } else if (message.type === "MATCH_UPDATE" && message.data.id === params.matchId) {
        // Update the match data if it matches the current matchId
        setMatch(message.data);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup WebSocket connection on unmount
    return () => {
      ws.close();
    };
  }, [params.matchId]); // Re-run effect if matchId changes

  if (!match) {
    return <div>Loading...</div>; // Show loading state while waiting for data
  }

  return (
    <main>
      <BettingPanel matchData={match} />
    </main>
  );
}
