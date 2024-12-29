"use client";
import { useParams } from "next/navigation";
import { useRoomState } from "@/hooks/useRoomState";
import { useGameLogic } from "@/hooks/useGameLogic";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import { useState, useEffect } from "react";
import WordEntryForm from "@/components/WordEntryForm";
import TeamSetup from "@/components/TeamSetup";

export default function GameRoom() {
  const { roomId } = useParams() as { roomId: string };
  const room = useRoomState(roomId);
  const {
    startGame,
    finishWordEntry,
    setTeams,
    recordTurnResults,
    updatePlayerName,
    rotateClueGiver,
  } = useGameLogic(roomId);

  // Local states for the current turn
  const [turnActive, setTurnActive] = useState<boolean>(false);
  const [turnStarted, setTurnStarted] = useState<boolean>(false);
  const [turnWords, setTurnWords] = useState<string[]>([]);
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [missedWords, setMissedWords] = useState<string[]>([]);

  // UI / editing states
  const [editStates, setEditStates] = useState<
    Record<string, { name: string; editing: boolean }>
  >({});

  // Firebase user
  const user = auth.currentUser;

  // Derived from room & user
  const isHost = room?.hostUid === user?.uid;
  const myPlayer = room?.players.find((p) => p.uid === user?.uid);
  const activeTeam = room?.currentTeamTurn;
  const isMyTeamTurn = myPlayer?.team === activeTeam;
  const isClueGiver =
    activeTeam !== undefined && room?.clueGivers?.[activeTeam] === user?.uid;

  // Current word is the first of our local turnWords array
  const currentWord = turnWords.length > 0 ? turnWords[0] : null;

  /**
   * Sign in Anonymously if no user
   */
  useEffect(() => {
    if (!user) {
      signInAnonymously(auth).catch((error) =>
        console.error("Error signing in anonymously:", error)
      );
    }
  }, [user]);

  /**
   * Initialize editing states
   */
  useEffect(() => {
    if (room?.players) {
      const initialEdits: Record<string, { name: string; editing: boolean }> = {};
      room.players.forEach((p) => {
        initialEdits[p.uid] = { name: p.name, editing: false };
      });
      setEditStates(initialEdits);
    }
  }, [room?.players]);

  /**
   * Manage whether it's this player's active turn
   */
  useEffect(() => {
    // If phase=play, it's our team's turn, and there's at least one global word => turn is "active"
    if (room?.phase === "play" && isMyTeamTurn && (room?.remainingWords?.length || 0) > 0) {
      setTurnActive(true);
    } else {
      setTurnActive(false);
    }
  }, [room?.phase, isMyTeamTurn, room?.remainingWords]);

  /**
   * Whenever turn ends (or is not active), reset local turn states
   */
  useEffect(() => {
    if (!turnActive) {
      setTurnStarted(false);
      setCorrectWords([]);
      setMissedWords([]);
      setTurnWords([]);
    }
  }, [turnActive]);

  /**
   * Handler: Updating player's name in the lobby
   */
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

  /**
   * Handler: Start the turn
   *  - copy the global remainingWords into our local turnWords
   */
  const startTurn = () => {
    setTurnStarted(true);
    setTurnWords(room?.remainingWords ?? []);
    setCorrectWords([]);
    setMissedWords([]);
  };

  /**
   * Handler: Correct guess (Got it)
   * - Remove the current word from turnWords
   * - Add to local correctWords
   */
  const gotIt = () => {
    if (!currentWord) return;
    setCorrectWords((prev) => [...prev, currentWord]);
    setTurnWords((prev) => prev.slice(1));

    console.log("Correct words:", correctWords);
    console.log("Turn words:", turnWords);

    // If no words left after removing => end turn automatically
    if (turnWords.length <= 1) {
      endTurn();
    }
  };

  /**
   * Handler: Skipped word
   * - Remove from turnWords so it won't repeat this turn
   * - Add to local missedWords
   */
  const skipIt = () => {
    if (!currentWord) return;
    setMissedWords((prev) => [...prev, currentWord]);
    setTurnWords((prev) => prev.slice(1));

    // If no words left after removing => end turn automatically
    if (turnWords.length <= 1) {
      endTurn();
    }
  };

  /**
   * Handler: End the turn manually (or automatically if no words left)
   * - We record the entire turn in Firestore all at once
   */
  const endTurn = async () => {
    if (room?.phase === "done") return;

    // Actually update Firestore: remove correctWords permanently, reintroduce missedWords, etc.
    await recordTurnResults(correctWords, missedWords, true);

    // Rotate clue giver for the next time this team plays
    if (activeTeam !== undefined) {
      rotateClueGiver(activeTeam);
    }

    // Clean up local states
    setTurnStarted(false);
    setCorrectWords([]);
    setMissedWords([]);
    setTurnWords([]);
  };

  /**
   * Check if the game is over
   */
  useEffect(() => {
    if (room?.phase === "done") {
      console.log("Game over! Transitioning to final state.");
    }
  }, [room?.phase]);

  /**
   * Early returns for loading or auth
   */
  if (!room) return <div className="p-4">Loading...</div>;
  if (!user) return <div className="p-4">Please wait, authenticating...</div>;

  /**
   * PHASES
   */
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
    // If it's our turn and we are the clue giver
    if (turnActive && isMyTeamTurn && isClueGiver) {
      // Haven't pressed "Start Turn" yet
      if (!turnStarted) {
        return (
          <div className="p-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">You are the clue giver!</h2>
            <p className="text-lg mb-4">Press the button to start your turn.</p>
            <button
              onClick={startTurn}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Start Turn
            </button>
          </div>
        );
      }
      // Turn is active, clue giver is playing
      return (
        <div className="p-4 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-2">Your Team&apos;s Turn!</h2>
          {currentWord && (
            <h3 className="text-xl font-bold mb-4">{currentWord}</h3>
          )}
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
            <button
              onClick={endTurn}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-4 rounded"
            >
              End Turn
            </button>
          </div>
        </div>
      );
    } else if (turnActive && isMyTeamTurn) {
      // It's our team's turn, but we're NOT the clue giver
      return (
        <div className="p-4 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-2">
            Waiting for the clue giver...
          </h2>
          <p className="text-lg mb-4">Your clue giver is selecting words!</p>
        </div>
      );
    } else {
      // It's not our team's turn
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
    // Game over
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

  // Default
  return <div className="p-4">Loading...</div>;
}