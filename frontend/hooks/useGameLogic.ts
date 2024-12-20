"use client";
import { db } from '@/firebase/clientApp';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { Room } from '@/firebase/types';

export function useGameLogic(roomId: string) {
  async function addWord(word: string) {
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, {
      words: arrayUnion(word),
    });
  }

  async function startGame() {
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, {
      phase: 'entry',
      startedAt: Date.now()
    });
  }

  async function finishWordEntry() {
    const roomRef = doc(db, 'rooms', roomId);
    const snapshot = await getDoc(roomRef);
    const data = snapshot.data() as Room;
    const shuffled = [...data.words].sort(() => Math.random() - 0.5);
    await updateDoc(roomRef, {
      phase: 'teams',
      remainingWords: shuffled
    });
  }

  async function setTeams(teams: { [uid: string]: number }) {
    const roomRef = doc(db, 'rooms', roomId);
    const snapshot = await getDoc(roomRef);
    const data = snapshot.data() as Room;
    const updatedPlayers = data.players.map(p => ({
      ...p,
      team: teams[p.uid]
    }));
    await updateDoc(roomRef, {
      players: updatedPlayers,
      phase: 'play',
      currentTeamTurn: 1,
      scores: {1: 0, 2: 0}
    });
  }

  async function recordTurnResults(correctWords: string[]) {
    const roomRef = doc(db, 'rooms', roomId);
    const snapshot = await getDoc(roomRef);
    const data = snapshot.data() as Room;

    const newScore = correctWords.length;
    const team = data.currentTeamTurn!;
    const updatedScore = (data.scores?.[team] ?? 0) + newScore;

    const remaining = data.remainingWords ?? [];
    const newRemaining = remaining.filter(w => !correctWords.includes(w));
    const nextTeam = team === 1 ? 2 : 1;

    const phase = newRemaining.length === 0 ? 'done' : 'play';

    await updateDoc(roomRef, {
      scores: {
        ...data.scores,
        [team]: updatedScore
      },
      remainingWords: newRemaining,
      currentTeamTurn: nextTeam,
      phase
    });
  }

  async function updatePlayerName(uid: string, newName: string) {
    const roomRef = doc(db, 'rooms', roomId);
    const snapshot = await getDoc(roomRef);
    const data = snapshot.data() as Room;
    const updatedPlayers = data.players.map(p => p.uid === uid ? { ...p, name: newName } : p);
    await updateDoc(roomRef, {
      players: updatedPlayers
    });
  }

  return { addWord, startGame, finishWordEntry, setTeams, recordTurnResults, updatePlayerName };
}