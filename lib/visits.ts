const VISITS_KEY = "connectvibe:visits";
const SESSION_FLAG = "connectvibe:visit-logged";
const DAYS_WINDOW = 14;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function readCounts(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(VISITS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

/**
 * Records one visit for today, at most once per browser session (tab),
 * so refreshes and page navigations don't inflate the count.
 */
export function trackVisit() {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(SESSION_FLAG)) return;
    sessionStorage.setItem(SESSION_FLAG, "1");
    const data = readCounts();
    const key = todayKey();
    data[key] = (data[key] || 0) + 1;
    localStorage.setItem(VISITS_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable - ignore
  }
}

export interface VisitDay {
  label: string;
  date: string;
  count: number;
}

export function getVisitsByDay(): VisitDay[] {
  const data = readCounts();
  const now = new Date();
  const result: VisitDay[] = [];
  for (let i = DAYS_WINDOW - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({
      date: key,
      count: data[key] || 0,
      label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    });
  }
  return result;
}

export function getTotalVisits(): number {
  const data = readCounts();
  return Object.values(data).reduce((sum, n) => sum + n, 0);
}
