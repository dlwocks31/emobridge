import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Reference: https://youtu.be/re2JFITR7TI?t=409
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
