const PREC = 0.01;
const round = (x: number) => Math.round(x / PREC) * PREC;

export function gridKey(lat: number, lng: number) {
  return `${round(lat).toFixed(2)}_${round(lng).toFixed(2)}`;
}
