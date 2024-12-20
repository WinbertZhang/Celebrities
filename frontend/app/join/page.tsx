"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInAnonymously } from 'firebase/auth';
import { auth, db } from '../../firebase/clientApp';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export default function Join() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  async function handleJoin() {
    await signInAnonymously(auth);
    const uid = auth.currentUser?.uid;
    const roomRef = doc(db, 'rooms', code);
    const snapshot = await getDoc(roomRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      await updateDoc(roomRef, {
        players: [...data.players, { uid, name, team: null }]
      });
      router.push(`/game/${code}`);
    } else {
      alert("Room not found");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Join a Room</h2>
      <input 
        className="border px-2 py-1 mb-2"
        placeholder="Room Code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())} />
      <input 
        className="border px-2 py-1 mb-2"
        placeholder="Your Name"
        value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleJoin} className="bg-blue-500 text-white px-4 py-2 rounded">Join</button>
    </div>
  );
}