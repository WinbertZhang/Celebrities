"use client";
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import { db, auth } from '../firebase/clientApp';
import { doc, setDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

export default function Home() {
  const router = useRouter();

  async function handleHost() {
    await signInAnonymously(auth);
    const roomId = uuid().slice(0,6).toUpperCase();
    const uid = auth.currentUser?.uid;
    await setDoc(doc(db, 'rooms', roomId), {
      code: roomId,
      hostUid: uid,
      players: [{ uid, name: 'Host', team: null }],
      words: [],
      phase: 'lobby',
      scores: {},
      usedWords: [],
      remainingWords: []
    });
    router.push(`/game/${roomId}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Celebrities Game</h1>
      <div className="flex space-x-4">
        <button onClick={handleHost} className="bg-blue-500 text-white px-4 py-2 rounded">Host a Room</button>
        <button onClick={() => router.push('/join')} className="bg-gray-500 text-white px-4 py-2 rounded">Join a Room</button>
      </div>
    </div>
  );
}