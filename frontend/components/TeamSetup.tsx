"use client";
import { useState } from "react";
import { Player } from "@/firebase/types";

export default function TeamSetup({
  players,
  onSetTeams,
  isHost,
}: {
  players: Player[];
  onSetTeams: (teams: { [uid: string]: number }) => void;
  isHost: boolean;
}) {
  const [team1, setTeam1] = useState<Player[]>([]);
  const [team2, setTeam2] = useState<Player[]>([]);

  // Initialize random teams
  useState(() => {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const midpoint = Math.ceil(shuffledPlayers.length / 2);
    setTeam1(shuffledPlayers.slice(0, midpoint));
    setTeam2(shuffledPlayers.slice(midpoint));
  });

  // Shuffle teams
  const shuffleTeams = () => {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const midpoint = Math.ceil(shuffledPlayers.length / 2);
    setTeam1(shuffledPlayers.slice(0, midpoint));
    setTeam2(shuffledPlayers.slice(midpoint));
  };

  // Handle drag and drop
  const handleDragStart = (player: Player, team: number) => {
    const data = JSON.stringify({ player, team });
    return (event: React.DragEvent) => {
      event.dataTransfer.setData("application/json", data);
    };
  };

  const handleDrop = (targetTeam: number) => {
    return (event: React.DragEvent) => {
      event.preventDefault();
      const { player, team } = JSON.parse(
        event.dataTransfer.getData("application/json")
      ) as { player: Player; team: number };

      if (team === targetTeam) return; // Do nothing if dropped on the same team

      if (team === 1) {
        setTeam1((prev) => prev.filter((p) => p.uid !== player.uid));
        setTeam2((prev) => [...prev, player]);
      } else {
        setTeam2((prev) => prev.filter((p) => p.uid !== player.uid));
        setTeam1((prev) => [...prev, player]);
      }
    };
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // Confirm teams
  const confirmTeams = () => {
    const teamAssignments: { [uid: string]: number } = {};
    team1.forEach((p) => (teamAssignments[p.uid] = 1));
    team2.forEach((p) => (teamAssignments[p.uid] = 2));
    onSetTeams(teamAssignments);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Team Setup</h2>

      <div className="flex space-x-4">
        {/* Team 1 */}
        <div
          onDrop={handleDrop(1)}
          onDragOver={handleDragOver}
          className="flex-1 bg-red-100 p-4 rounded shadow min-h-[200px]"
        >
          <h3 className="text-lg font-semibold text-red-600 mb-2">Team 1</h3>
          <ul>
            {team1.map((player) => (
              <li
                key={player.uid}
                draggable
                onDragStart={handleDragStart(player, 1)}
                className="bg-white p-2 mb-2 rounded shadow cursor-move"
              >
                {player.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Team 2 */}
        <div
          onDrop={handleDrop(2)}
          onDragOver={handleDragOver}
          className="flex-1 bg-blue-100 p-4 rounded shadow min-h-[200px]"
        >
          <h3 className="text-lg font-semibold text-blue-600 mb-2">Team 2</h3>
          <ul>
            {team2.map((player) => (
              <li
                key={player.uid}
                draggable
                onDragStart={handleDragStart(player, 2)}
                className="bg-white p-2 mb-2 rounded shadow cursor-move"
              >
                {player.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Shuffle and Confirm Buttons */}
      {isHost && (
        <div className="mt-4 flex space-x-4">
          <button
            onClick={shuffleTeams}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Shuffle Teams
          </button>
          <button
            onClick={confirmTeams}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Confirm Teams
          </button>
        </div>
      )}
    </div>
  );
}