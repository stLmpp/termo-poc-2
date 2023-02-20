export function shuffleArray<T>(_array: readonly T[]): readonly T[] {
  const array = [..._array];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let uid = 0;

export function getRowId(): number {
  return uid++;
}
