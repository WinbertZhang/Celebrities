"use client";
import { useParams } from "next/navigation";
import { useRoomState } from "@/hooks/useRoomState";
import { useGameLogic } from "@/hooks/useGameLogic";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import { useState, useEffect } from "react";
import Timer from "@/components/Timer";
import WordEntryForm from "@/components/WordEntryForm";
import TeamSetup from "@/components/TeamSetup";
import ScoringModal from "@/components/ScoringModal";

export default function GameRoom() {
  const { roomId } = useParams() as { roomId: string };
  const room = useRoomState(roomId);
  const {
    startGame,
    finishWordEntry,
    setTeams,
    recordTurnResults,
    updatePlayerName,
  } = useGameLogic(roomId);

  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [missedWords, setMissedWords] = useState<string[]>([]);
  const [time, setTime] = useState<number>(60);
  const [turnActive, setTurnActive] = useState<boolean>(false);
  const [editStates, setEditStates] = useState<
    Record<string, { name: string; editing: boolean }>
  >({});

  const user = auth.currentUser;

  // Variables derived from `room` and `user`
  const isHost = room?.hostUid === user?.uid;
  const myPlayer = room?.players.find((p) => p.uid === user?.uid);
  const activeTeam = room?.currentTeamTurn;
  const isMyTeamTurn = myPlayer?.team === activeTeam;
  const currentWord = room?.remainingWords?.[0];

  // Effect to handle anonymous sign-in
  useEffect(() => {
    if (!user) {
      signInAnonymously(auth).catch((error) =>
        console.error("Error signing in anonymously:", error)
      );
    }
  }, [user]);

  // Effect to initialize editing states for players
  useEffect(() => {
    if (room?.players) {
      const initialEditStates: Record<
        string,
        { name: string; editing: boolean }
      > = {};
      room.players.forEach((p) => {
        initialEditStates[p.uid] = { name: p.name, editing: false };
      });
      setEditStates(initialEditStates);
    }
  }, [room?.players]);

  // Effect to manage turn activation
  useEffect(() => {
    if (room?.phase === "play" && isMyTeamTurn && currentWord) {
      setTurnActive(true);
      setTime(60);
    } else {
      setTurnActive(false);
    }
  }, [room?.phase, isMyTeamTurn, currentWord]);

  // Effect to handle timer during active turn
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

  // Handlers for player name editing
  const handleNameChange = async (uid: string, newName: string) => {
    if (room?.phase === "lobby" && user) {
      await updatePlayerName(uid, newName);
      setEditStates((prev) => ({
        ...prev,
        [uid]: { ...prev[uid], name: newName, editing: false },
      }));
    }
  };

  const toggleEditing = (uid: string, editing: boolean) => {
    setEditStates((prev) => ({
      ...prev,
      [uid]: { ...prev[uid], editing },
    }));
  };

  // Handlers for word guessing
  const gotIt = () => {
    if (!currentWord) return;
    setCorrectWords((cw) => [...cw, currentWord]);
    room?.remainingWords?.shift();
  };

  const skipIt = () => {
    if (!currentWord) return;
    setMissedWords((mw) => [...mw, currentWord]);
    room?.remainingWords?.shift();
  };

  // Early returns for loading or authentication state
  if (!room) return <div className="p-4">Loading...</div>;
  if (!user) return <div className="p-4">Please wait, authenticating...</div>;

  // Phase-specific rendering
  if (room.phase === "lobby") {
    return (
      <div className="p-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Room Code: {room.code}</h1>
        <h2 className="text-xl font-semibold mb-2">Players Joined:</h2>
        <ul className="mb-4 w-full max-w-md space-y-2">
          {room.players.map((p) => {
            const isCurrent = p.uid === user?.uid;
            const { name, editing } = editStates[p.uid] || {
              name: p.name,
              editing: false,
            };

            return (
              <li
                key={p.uid}
                className="flex items-center justify-between bg-white p-2 rounded shadow"
              >
                {isCurrent ? (
                  <>
                    {editing ? (
                      <input
                        className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={name}
                        onChange={(e) =>
                          setEditStates((prev) => ({
                            ...prev,
                            [p.uid]: { ...prev[p.uid], name: e.target.value },
                          }))
                        }
                      />
                    ) : (
                      <span>{name}</span>
                    )}
                    <div className="flex space-x-2">
                      {!editing && (
                        <button
                          onClick={() => toggleEditing(p.uid, true)}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                      )}
                      {editing && (
                        <>
                          <button
                            onClick={() => handleNameChange(p.uid, name)}
                            className="text-green-600 hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={() =>
                              setEditStates((prev) => ({
                                ...prev,
                                [p.uid]: { name: p.name, editing: false },
                              }))
                            }
                            className="text-red-600 hover:underline"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <span>{p.name}</span>
                )}
              </li>
            );
          })}
        </ul>
        {isHost && (
          <button
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Start Game
          </button>
        )}
      </div>
    );
  }

  if (room.phase === "entry") {
    return (
      <div className="p-4 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2">Enter Your Words!</h2>
        <p className="mb-4">
          Time left:{" "}
          <span className="font-semibold text-red-600">
            <Timer initialSeconds={120} />
          </span>{" "}
          seconds
        </p>
        <WordEntryForm roomId={roomId} room={room} />
        {isHost && (
          <button
            onClick={finishWordEntry}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-4 rounded"
          >
            Finish Word Entry
          </button>
        )}
      </div>
    );
  }

  if (room.phase === "teams") {
    return (
      <TeamSetup
        players={room.players}
        onSetTeams={(teams) => setTeams(teams)}
        isHost={isHost}
      />
    );
  }

  if (room.phase === "play") {
    if (turnActive && isMyTeamTurn && currentWord) {
      return (
        <div className="p-4 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-2">Your Team&apos;s Turn!</h2>
          <p className="text-lg mb-4">
            Time Left:{" "}
            <span className="text-red-600 font-semibold">{time}s</span>
          </p>
          <h3 className="text-xl font-bold mb-4">{currentWord}</h3>
          <div className="space-x-4">
            <button
              onClick={gotIt}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Got it!
            </button>
            <button
              onClick={skipIt}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              Skip
            </button>
          </div>
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
        <div className="p-4 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-2">
            Waiting for the other team...
          </h2>
        </div>
      );
    }
  }

  if (room.phase === "done") {
    const team1Score = room.scores?.[1] || 0;
    const team2Score = room.scores?.[2] || 0;

    return (
      <div className="p-4 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
        <p className="text-xl font-semibold mb-2">Final Scores:</p>
        <p className="mb-2">Team 1: {team1Score}</p>
        <p className="mb-4">Team 2: {team2Score}</p>
        <h3 className="text-2xl font-bold">
          {team1Score > team2Score
            ? "Team 1 Wins!"
            : team2Score > team1Score
            ? "Team 2 Wins!"
            : "It's a tie!"}
        </h3>
      </div>
    );
  }

  return <div className="p-4">Loading...</div>;
}
