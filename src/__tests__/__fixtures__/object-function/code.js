type a = {
  x: () => void,
  y?: (x: string, y?: number, ...z: Array<number>) => boolean,
  (): void,
  (number): string,
  (x: number): string,
}
