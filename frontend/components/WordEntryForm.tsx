"use client";
import { useState } from 'react';
import { useGameLogic } from '@/hooks/useGameLogic';
import { Room } from '@/firebase/types';
import { isWordSimilar } from '@/utils/similarity';

export default function WordEntryForm({ roomId, room }: { roomId: string, room: Room }) {
    const [word, setWord] = useState('');
    const [warning, setWarning] = useState('');
    const { addWord } = useGameLogic(roomId);
  
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      const trimmed = word.trim();
      if(!trimmed) return;
  
      if (isWordSimilar(trimmed, room.words)) {
        setWarning(`A similar word to "${trimmed}" has already been added!`);
        return;
      }
  
      await addWord(trimmed);
      setWord('');
      setWarning('');
    }
  
    return (
      <div className="flex flex-col items-start">
        <form onSubmit={handleSubmit} className="flex space-x-2 mb-2">
          <input 
            className="border px-2 py-1 rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter a word"
            value={word} 
            onChange={(e) => { setWord(e.target.value); setWarning(''); }} />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded" type="submit">Add</button>
        </form>
        {warning && <p className="text-red-600">{warning}</p>}
      </div>
    );
  }