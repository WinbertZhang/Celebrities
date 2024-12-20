"use client";
import { db } from "@/firebase/clientApp";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { Player, Room } from "@/firebase/types";

export function useGameLogic(roomId: string) {
  async function addWord(word: string) {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      words: arrayUnion(word),
    });
  }

  async function startGame() {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      phase: "entry", // Transition to the word entry phase
      clueGivers: {}, // Reset clue givers
    });
  }
  
  async function finishWordEntry() {
    const roomRef = doc(db, "rooms", roomId);
    const snapshot = await getDoc(roomRef);
    const data = snapshot.data() as Room;
    const shuffled = [...data.words].sort(() => Math.random() - 0.5);
    await updateDoc(roomRef, {
      phase: "teams",
      remainingWords: shuffled,
    });
  }

  async function setTeams(teams: { [uid: string]: number }) {
    const roomRef = doc(db, "rooms", roomId);
    const snapshot = await getDoc(roomRef);
    const data = snapshot.data() as Room;
    const updatedPlayers = data.players.map((p) => ({
      ...p,
      team: teams[p.uid],
    }));
    await updateDoc(roomRef, {
      players: updatedPlayers,
      phase: "play",
      currentTeamTurn: 1,
      scores: { 1: 0, 2: 0 },
    });

    await setInitialClueGivers(roomId);
  }

  async function recordTurnResults(correctWords: string[]) {
    const roomRef = doc(db, "rooms", roomId);
    const snapshot = await getDoc(roomRef);
    const data = snapshot.data() as Room;

    const newScore = correctWords.length;
    const team = data.currentTeamTurn!;
    const updatedScore = (data.scores?.[team] ?? 0) + newScore;

    const remaining = data.remainingWords ?? [];
    const newRemaining = remaining.filter((w) => !correctWords.includes(w));
    const nextTeam = team === 1 ? 2 : 1;

    const phase = newRemaining.length === 0 ? "done" : "play";

    await updateDoc(roomRef, {
      scores: {
        ...data.scores,
        [team]: updatedScore,
      },
      remainingWords: newRemaining,
      currentTeamTurn: nextTeam,
      phase,
    });
  }

  async function updatePlayerName(uid: string, newName: string) {
    const roomRef = doc(db, "rooms", roomId);
    const snapshot = await getDoc(roomRef);
    const data = snapshot.data() as Room;
    const updatedPlayers = data.players.map((p) =>
      p.uid === uid ? { ...p, name: newName } : p
    );
    await updateDoc(roomRef, {
      players: updatedPlayers,
    });
  }

  const rotateClueGiver = async (teamId: number) => {
    const roomRef = doc(db, "rooms", roomId);
    const roomData = (await getDoc(roomRef)).data();
    if (!roomData) return;

    const teamPlayers = roomData.players.filter(
      (p: Player) => p.team === teamId
    );
    const currentClueGiverIndex = teamPlayers.findIndex(
      (p: Player) => p.uid === roomData.clueGivers[teamId]
    );

    const nextClueGiver =
      teamPlayers[(currentClueGiverIndex + 1) % teamPlayers.length].uid;

    await updateDoc(roomRef, {
      [`clueGivers.${teamId}`]: nextClueGiver,
    });
  };

  const setInitialClueGivers = async (roomId: string) => {
    const roomRef = doc(db, "rooms", roomId);
    const roomData = (await getDoc(roomRef)).data() as Room;
  
    if (!roomData?.players) {
      console.error("No players found in the room.");
      return;
    }
  
    const team1Players = roomData.players.filter((p: Player) => p.team === 1);
    const team2Players = roomData.players.filter((p: Player) => p.team === 2);
  
    await updateDoc(roomRef, {
      clueGivers: {
        1: team1Players[0]?.uid || null, // Assign the first player as the clue giver or null
        2: team2Players[0]?.uid || null,
      },
    });
  };

  return {
    addWord,
    startGame,
    finishWordEntry,
    setTeams,
    recordTurnResults,
    updatePlayerName,
    rotateClueGiver,
    setInitialClueGivers,
  };
}