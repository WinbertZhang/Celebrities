"use client";

export default function ScoringModal({ correctWords, missedWords, onConfirm }:
{ correctWords: string[], missedWords: string[], onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <h2>Confirm Scoring</h2>
        <h3 className="font-semibold">Correct Words</h3>
        <ul>
          {correctWords.map(w => <li key={w}>{w}</li>)}
        </ul>
        <h3 className="font-semibold">Missed Words</h3>
        <ul>
          {missedWords.map(w => <li key={w}>{w}</li>)}
        </ul>
        <button onClick={onConfirm} className="bg-green-500 text-white px-4 py-2 mt-4">Confirm</button>
      </div>
    </div>
  );
}