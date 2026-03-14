export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  // Append T12:00:00 to date-only strings ("2024-01-15") to prevent
  // timezone-boundary shifts (UTC midnight → previous day in CET).
  const safe = dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`;
  const date = new Date(safe);
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatUnit(unit: string | null): string {
  switch (unit) {
    case "uren":
      return "Uren";
    case "dagen":
      return "Dagen";
    case "stuks":
      return "Stuks";
    default:
      return "";
  }
}
