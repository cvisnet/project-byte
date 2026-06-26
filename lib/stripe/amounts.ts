export const PRESET_PHP = [100, 250, 500, 1000] as const;

export const MIN_PHP = 50;
export const MAX_PHP = 500_000;

export const CURRENCY = "php" as const;

export function toCentavos(amountPhp: number): number {
  return Math.round(amountPhp * 100);
}

export function formatPhp(amountPhp: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(amountPhp);
}
