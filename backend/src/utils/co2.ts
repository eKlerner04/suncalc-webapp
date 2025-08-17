const FACTOR = Number(process.env.CO2_FACTOR_G_PER_KWH ?? 570);

export function computeCo2(annual_kWh: number) {
  return { saved_kg_per_year: (annual_kWh * FACTOR) / 1000, factor_g_per_kWh: FACTOR };
}
