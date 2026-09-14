export interface HistoryItem {
  id: string;
  date: string;
  scenario: string;
  sources: number;
  findings: number;
  severity: string;
}

export function saveAnalysis(scenario: string, sources: number, findings: number, severity: string) {
  const history = getHistory();
  const newItem: HistoryItem = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
    date: new Date().toISOString(),
    scenario,
    sources,
    findings,
    severity
  };
  history.unshift(newItem);
  localStorage.setItem('alcatraz-history', JSON.stringify(history));
}

export function getHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem('alcatraz-history');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function clearHistory() {
  localStorage.removeItem('alcatraz-history');
}
