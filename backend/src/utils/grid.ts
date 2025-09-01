const PREC = 0.01;
const round = (x: number) => Math.round(x / PREC) * PREC;

export function gridKey(lat: number, lng: number) {
  return `${round(lat).toFixed(2)}_${round(lng).toFixed(2)}`;
}

export function generateSolarKey(lat: number, lng: number, area: number, tilt: number, azimuth: number) {
  const latRounded = round(lat).toFixed(2);
  const lngRounded = round(lng).toFixed(2);
  const areaRounded = Math.round(area);
  const tiltRounded = Math.round(tilt);
  const azimuthRounded = Math.round(azimuth);
  
  return `${latRounded}_${lngRounded}_${areaRounded}_${tiltRounded}_${azimuthRounded}`;
}
