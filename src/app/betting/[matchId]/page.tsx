// app/betting/[matchId]/page.tsx
"use client";
import BettingPanel from "@/components/BettingPanel";
import { notFound } from "next/navigation";

// Types
interface Team {
  name: string;
  logo: string;
  odds: number;
}

interface MatchData {
  id: string;
  sport: string;
  teams: {
    home: Team;
    away: Team;
  };
  startTime: string;
  maxBetting: number;
  currentBettingMembers: number;
  status: "live" | "upcoming";
}

// Sample data - In a real app, this would come from an API or database
const matchesData: MatchData[] = [
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
    maxBetting: 100,
    currentBettingMembers: 2,
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
    maxBetting: 100,
    currentBettingMembers: 2,
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
    maxBetting: 100,
    currentBettingMembers: 2,
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
    maxBetting: 100,
    currentBettingMembers: 2,
    status: "upcoming",
  },
];

// Page Props Type
interface PageProps {
  params: {
    matchId: string;
  };
}

// Metadata generation
// export async function generateMetadata({ params }: PageProps) {
//   const match = matchesData.find((m) => m.id === params.matchId);

//   if (!match) {
//     return {
//       title: "Match Not Found",
//     };
//   }

//   return {
//     title: `${match.teams.home.name} vs ${match.teams.away.name} - Betting`,
//     description: `Place your bets on the ${match.sport} match between ${match.teams.home.name} and ${match.teams.away.name}`,
//   };
// }

// Main Page Component
export default function BettingPage({ params }: PageProps) {
  const match = matchesData.find((m) => m.id === params.matchId);

  if (!match) {
    notFound();
  }

  return (
    <main>
      <BettingPanel matchData={match} />
    </main>
  );
}
