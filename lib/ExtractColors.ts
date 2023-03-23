import { extractColors } from "extract-colors";

export function ExtractColors(...args: Parameters<typeof extractColors>) {
  return extractColors(...args);
}
