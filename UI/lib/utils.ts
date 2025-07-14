import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format số điện thoại để ẩn các số ở giữa
 * Ví dụ: 0912345678 -> 09******78
 * @param phone Số điện thoại cần format
 * @returns Số điện thoại đã được format
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone || phone.length < 4) return phone

  const length = phone.length
  const firstTwo = phone.slice(0, 2)
  const lastTwo = phone.slice(-2)
  const middleStars = '*'.repeat(length - 4)

  return `${firstTwo}${middleStars}${lastTwo}`
}
