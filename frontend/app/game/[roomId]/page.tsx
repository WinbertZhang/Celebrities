"use client";
import { useParams } from 'next/navigation';
import { useRoomState } from '@/hooks/useRoomState';
import { useGameLogic } from '@/hooks/useGameLogic';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '@/firebase/clientApp';
import { useState, useEffect } from 'react';
import Timer from '@/components/Timer';
import WordEntryForm from '@/components/WordEntryForm';
import TeamSetup from '@/components/TeamSetup';
import ScoringModal from '@/components/ScoringModal';

export default function GameRoom() {
  const { roomId } = useParams() as { roomId: string };
  const room = useRoomState(roomId);
  const { startGame, finishWordEntry, setTeams, recordTurnResults } = useGameLogic(roomId);
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [missedWords, setMissedWords] = useState<string[]>([]);
  const [time, setTime] = useState(60);
  const [turnActive, setTurnActive] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      signInAnonymously(auth).catch((error) => {
        console.error("Error signing in anonymously:", error);
      });
    }
  }, [user]);

  // State and logic for turn activation and timer
  const activeTeam = room?.currentTeamTurn;
  const myPlayer = room?.players.find((p) => p.uid === user?.uid);
  const isMyTeamTurn = myPlayer?.team === activeTeam;
  const currentWord = room?.remainingWords?.[0];

  useEffect(() => {
    if (room?.phase === 'play' && isMyTeamTurn && currentWord) {
      setTurnActive(true);
      setTime(60);
    } else {
      setTurnActive(false);
    }
  }, [room?.phase, isMyTeamTurn, currentWord]);

  useEffect(() => {
    if (turnActive) {
      const interval = setInterval(() => {
        setTime((t) => {
          if (t <= 1) {
            clearInterval(interval);
            setTurnActive(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [turnActive]);

  function gotIt() {
    if (!currentWord) return;
    setCorrectWords((cw) => [...cw, currentWord]);
    room?.remainingWords?.shift();
  }

  function skipIt() {
    if (!currentWord) return;
    setMissedWords((mw) => [...mw, currentWord]);
    room?.remainingWords?.shift();
  }

  // Early return for loading or authentication state
  if (!room) return <div>Loading...</div>;
  if (!user) return <div>Please wait, authenticating...</div>;

  const isHost = room.hostUid === user.uid;

  // Phase-specific rendering
  switch (room.phase) {
    case 'lobby':
      return (
        <div className="p-4">
          <h1 className="text-2xl font-bold">Room Code: {room.code}</h1>
          <h2>Players Joined:</h2>
          <ul>
            {room.players.map((p) => (
              <li key={p.uid}>{p.name}</li>
            ))}
          </ul>
          {isHost && (
            <button onClick={startGame} className="bg-green-500 text-white px-4 py-2 mt-4">
              Start Game
            </button>
          )}
        </div>
      );

    case 'entry':
      return (
        <div className="p-4">
          <h2>Enter your words!</h2>
          <p>
            Time left: <Timer initialSeconds={120} />
          </p>
          <WordEntryForm roomId={roomId} />
          {isHost && (
            <button onClick={finishWordEntry} className="bg-blue-500 text-white px-4 py-2 mt-4">
              Finish Word Entry
            </button>
          )}
        </div>
      );

    case 'teams':
      return (
        <TeamSetup
          players={room.players}
          onSetTeams={(teams) => setTeams(teams)}
          isHost={isHost}
        />
      );

    case 'play':
      if (turnActive && isMyTeamTurn && currentWord) {
        return (
          <div className="p-4">
            <h2>Your Team&apos;s Turn!</h2>
            <p>Time Left: {time}s</p>
            <h3 className="text-xl font-bold">{currentWord}</h3>
            <button onClick={gotIt} className="bg-green-500 text-white px-4 py-2 mt-4">
              Got it!
            </button>
            <button onClick={skipIt} className="bg-gray-300 text-black px-4 py-2 mt-4 ml-2">
              Skip
            </button>
          </div>
        );
      } else if (!turnActive && isMyTeamTurn) {
        return (
          <ScoringModal
            correctWords={correctWords}
            missedWords={missedWords}
            onConfirm={() => {
              recordTurnResults(correctWords);
              setCorrectWords([]);
              setMissedWords([]);
            }}
          />
        );
      } else {
        return (
          <div className="p-4">
            <h2>Waiting for the other team...</h2>
          </div>
        );
      }

    case 'done':
      const team1Score = room.scores?.[1] || 0;
      const team2Score = room.scores?.[2] || 0;
      return (
        <div className="p-4">
          <h2>Game Over!</h2>
          <p>Team 1: {team1Score}</p>
          <p>Team 2: {team2Score}</p>
          <h3>
            {team1Score > team2Score
              ? 'Team 1 Wins!'
              : team2Score > team1Score
              ? 'Team 2 Wins!'
              : "It's a tie!"}
          </h3>
        </div>
      );

    default:
      return <div>Loading...</div>;
  }
}