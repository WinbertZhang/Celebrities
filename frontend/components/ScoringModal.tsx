"use client";

export default function ScoringModal({
  correctWords,
  missedWords,
  onConfirm,
}: {
  correctWords: string[];
  missedWords: string[];
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Confirm Scoring</h2>
        <h3 className="font-semibold mb-2">Correct Words</h3>
        <ul className="list-disc list-inside mb-4">
          {correctWords.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
        <h3 className="font-semibold mb-2">Missed Words</h3>
        <ul className="list-disc list-inside mb-4">
          {missedWords.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
        <button
          onClick={onConfirm}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
