"use client";
import { db } from "@/firebase/clientApp";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { Player, Room } from "@/firebase/types";

export function useGameLogic(roomId: string) {
  /**
   * Adds a new word to the "words" array in Firestore
   */
  async function addWord(word: string) {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      words: arrayUnion(word),
    });
  }

  /**
   * Moves game from LOBBY -> ENTRY phase
   */
  async function startGame() {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      phase: "entry",
      clueGivers: {},
    });
  }

  /**
   * Shuffles words after entry; moves game to TEAMS phase
   */
  async function finishWordEntry() {
    const roomRef = doc(db, "rooms", roomId);
    const snapshot = await getDoc(roomRef);
    const data = snapshot.data() as Room;
    const shuffled = [...(data.words || [])].sort(() => Math.random() - 0.5);
    await updateDoc(roomRef, {
      phase: "teams",
      remainingWords: shuffled,
    });
  }

  /**
   * Assigns teams, initializes scores, moves game to PLAY phase
   */
  async function setTeams(teams: { [uid: string]: number }) {
    const roomRef = doc(db, "rooms", roomId);
    const snapshot = await getDoc(roomRef);
    const data = snapshot.data() as Room;
    if (!data) return;

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

  /**
   * Logic to record turn results:
   *  - correctWords are removed from the global pool & the team’s score is incremented
   *  - missedWords are reintroduced into the global pool
   *  - if no words remain => game done
   *  - if forceEndTurn => switch team
   */
  async function recordTurnResults(
    correctWords: string[],
    missedWords: string[],
    forceEndTurn = false
  ) {
    const roomRef = doc(db, "rooms", roomId);
    const snapshot = await getDoc(roomRef);
    const data = snapshot.data() as Room;
    if (!data) return;
  
    const currentTeam = data.currentTeamTurn!;
    const newScore = (data.scores?.[currentTeam] ?? 0) + correctWords.length;
  
    // Start with the remaining global words
    let newRemaining = data.remainingWords || [];
  
    // Remove correctly guessed words from the global array
    newRemaining = newRemaining.filter((w) => !correctWords.includes(w));
  
    if (newRemaining.length === 0) {
      // If no words remain, set the phase to "done" and end the game
      await updateDoc(roomRef, {
        scores: {
          ...data.scores,
          [currentTeam]: newScore,
        },
        remainingWords: [],
        phase: "done",
        currentTeamTurn: null,
      });
      return;
    }
  
    // Reintroduce missed words into the pool
    let nextTurnPool = [...newRemaining, ...missedWords];
    nextTurnPool = nextTurnPool.filter((val, idx, arr) => arr.indexOf(val) === idx); // Ensure unique words
  
    if (forceEndTurn) {
      // Switch teams if forcing turn end
      const nextTeam = currentTeam === 1 ? 2 : 1;
      await updateDoc(roomRef, {
        scores: {
          ...data.scores,
          [currentTeam]: newScore,
        },
        remainingWords: nextTurnPool,
        currentTeamTurn: nextTeam,
      });
    } else {
      // Continue with the current team's turn
      await updateDoc(roomRef, {
        scores: {
          ...data.scores,
          [currentTeam]: newScore,
        },
        remainingWords: nextTurnPool,
      });
    }
  }

  /**
   * Update a player's name
   */
  async function updatePlayerName(uid: string, newName: string) {
    const roomRef = doc(db, "rooms", roomId);
    const snapshot = await getDoc(roomRef);
    const data = snapshot.data() as Room;
    if (!data) return;

    const updatedPlayers = data.players.map((p) =>
      p.uid === uid ? { ...p, name: newName } : p
    );
    await updateDoc(roomRef, {
      players: updatedPlayers,
    });
  }

  /**
   * Rotate the clue giver among that team's players
   */
  const rotateClueGiver = async (teamId: number) => {
    const roomRef = doc(db, "rooms", roomId);
    const roomData = (await getDoc(roomRef)).data();
    if (!roomData) return;

    const teamPlayers = roomData.players.filter((p: Player) => p.team === teamId);
    const currentIndex = teamPlayers.findIndex(
      (p: Player) => p.uid === roomData.clueGivers[teamId]
    );

    const nextGiver = teamPlayers[(currentIndex + 1) % teamPlayers.length]?.uid;

    await updateDoc(roomRef, {
      [`clueGivers.${teamId}`]: nextGiver,
    });
  };

  /**
   * Sets the very first clue givers (e.g. the first player in each team)
   */
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
        1: team1Players[0]?.uid || null,
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