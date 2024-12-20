"use client";
import { useState } from 'react';
import { Player } from '@/firebase/types';

export default function TeamSetup({ players, onSetTeams, isHost }:
{ players: Player[], onSetTeams: (teams: {[uid:string]:number}) => void, isHost: boolean }) {
  const [teams, setTeams] = useState<{[uid:string]: number}>({});

  function assignTeam(uid: string, team: number) {
    setTeams((t) => ({...t, [uid]: team}));
  }

  return (
    <div className="p-4">
      <h2>Team Setup</h2>
      <ul>
        {players.map(p => (
          <li key={p.uid} className="flex items-center space-x-2 my-2">
            <span>{p.name}</span>
            <button onClick={() => assignTeam(p.uid, 1)} className="bg-red-500 text-white px-2 py-1 rounded">Team 1</button>
            <button onClick={() => assignTeam(p.uid, 2)} className="bg-blue-500 text-white px-2 py-1 rounded">Team 2</button>
          </li>
        ))}
      </ul>
      {isHost && <button onClick={() => onSetTeams(teams)} className="bg-green-500 text-white px-4 py-2 mt-4">Confirm Teams</button>}
    </div>
  );
}