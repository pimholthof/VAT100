export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
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
