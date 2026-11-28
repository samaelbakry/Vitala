export { cn } from "cn"

export function formatDate(value: string | null) {
  if (!value) return "Not provided";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function displayValue(value: string | null) {
  return value?.trim() || "Not provided";
}
