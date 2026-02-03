import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(v: string, MAX_LEN: number) {
  return v.length > MAX_LEN ? v.slice(0, MAX_LEN) : v;
}
