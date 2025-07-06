import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to Indonesian
 * @param {number} num - number to format
 * @returns {string} - formatted number
 * @example
 * formatNumberToIndonesian(1000000) // "1.000.000"
 */
export function formatNumberToIndonesian(num: number): string {
  return num?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Truncate string
 * @param {string} str - string to truncate
 * @param {number} length - length of truncated string
 * @returns {string} - truncated string
 * @example
 * truncateString("Hello, World!", 5) // "Hello..."
 */
export function truncateString(str: string, length: number): string {
  return str?.length > length ? str?.substring(0, length) + "..." : str;
}

/**
 * debounce adalah fungsi utilitas untuk menunda eksekusi dari fungsi `func`
 * hingga tidak ada pemanggilan lagi selama `delay` milidetik.
 *
 * Cocok digunakan untuk search input, resize event, scroll event, dll.
 *
 * @param func - Fungsi yang ingin di-debounce
 * @param delay - Waktu tunggu dalam milidetik
 * @returns Fungsi baru yang sudah dibungkus dengan mekanisme debounce
 */
// Sementara eslint di disable sampai waktu yang tidak di tentukan
/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  // Simpan ID timer agar bisa dibatalkan jika fungsi dipanggil ulang dalam waktu cepat
  let timer: ReturnType<typeof setTimeout> | null = null;

  // Kembalikan fungsi baru yang membungkus fungsi asli dengan logika debounce
  return function (this: any, ...args: Parameters<T>): void {
    /* eslint-disable @typescript-eslint/no-this-alias */
    const context = this; // Simpan konteks `this` agar tetap konsisten jika digunakan dalam class

    // Jika masih ada timer sebelumnya, batalkan dulu
    if (timer) clearTimeout(timer);

    // Buat timer baru untuk menjalankan fungsi setelah `delay` milidetik
    timer = setTimeout(() => {
      func.apply(context, args); // Panggil fungsi dengan `this` dan argumen yang sesuai
    }, delay);
  };
}
