"use client";
import { useState } from 'react';
import { useGameLogic } from '@/hooks/useGameLogic';

export default function WordEntryForm({ roomId }: { roomId: string }) {
  const [word, setWord] = useState('');
  const { addWord } = useGameLogic(roomId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if(word.trim()) {
      await addWord(word.trim());
      setWord('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input 
        className="border px-2 py-1"
        placeholder="Enter a word"
        value={word} 
        onChange={(e) => setWord(e.target.value)} />
      <button className="bg-blue-500 text-white px-4 py-1 rounded" type="submit">Add</button>
    </form>
  );
}