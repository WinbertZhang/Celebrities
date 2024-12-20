function levenshteinDistance(a: string, b: string): number {
  const an = a.length;
  const bn = b.length;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = Array.from({ length: bn + 1 }, (_, i) => [i]);
  for (let j = 1; j <= an; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[bn][an];
}

export function isWordSimilar(newWord: string, existingWords: string[], threshold = 0.75): boolean {
  newWord = newWord.toLowerCase();
  return existingWords.some(w => {
    const dist = levenshteinDistance(newWord, w.toLowerCase());
    const similarity = 1 - dist / Math.max(newWord.length, w.length);
    return similarity >= threshold;
  });
}