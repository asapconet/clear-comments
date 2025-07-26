import { get } from "node-emoji";
export function logVerbose(message: string): void {
  console.log(`${get("white_check_mark")} ${message}`);
}
export function logError(message: string): void {
  console.error(`${get("x")} ${message}`);
}
