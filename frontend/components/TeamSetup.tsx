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
        <div className="p-4 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Team Setup</h2>
          <ul className="w-full max-w-md space-y-2 mb-4">
            {players.map(p => (
              <li key={p.uid} className="flex items-center justify-between bg-white p-2 rounded shadow">
                <span>{p.name}</span>
                <div className="space-x-2">
                  <button onClick={() => assignTeam(p.uid, 1)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Team 1</button>
                  <button onClick={() => assignTeam(p.uid, 2)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">Team 2</button>
                </div>
              </li>
            ))}
          </ul>
          {isHost && 
            <button onClick={() => onSetTeams(teams)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Confirm Teams
            </button>
          }
        </div>
      );
    }