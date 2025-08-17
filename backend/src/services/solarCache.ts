export async function getSolarFromCacheOrSource({ lat, lng, key }: { lat: number; lng: number; key: string }) {
  console.log(`Cache-Check für ${key} (lat=${lat}, lng=${lng})`);
  return { source: 'mock', ageHours: null };
}
