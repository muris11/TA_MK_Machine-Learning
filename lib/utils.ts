import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function roundTo(value: number, digits = 2) {
  const multiplier = 10 ** digits

  return Math.round(value * multiplier) / multiplier
}
