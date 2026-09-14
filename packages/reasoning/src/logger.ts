export function emitLog(message: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('alcatraz-log', { detail: message }));
  }
}
