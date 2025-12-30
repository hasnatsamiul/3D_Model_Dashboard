export const API_BASE = "https://threed-model-dashboard.onrender.com";

type FetchLatticeOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
};

function combineSignals(signals: AbortSignal[]) {
  const controller = new AbortController();

  const onAbort = () => controller.abort();

  for (const sig of signals) {
    if (sig.aborted) {
      controller.abort();
      break;
    }
    sig.addEventListener("abort", onAbort, { once: true });
  }

  return controller;
}

export async function fetchLattice(options: FetchLatticeOptions = {}) {
  const { signal, timeoutMs = 120_000 } = options;

  const timeoutController = new AbortController();
  const timeoutId = window.setTimeout(() => timeoutController.abort(), timeoutMs);

  const combined = signal
    ? combineSignals([signal, timeoutController.signal])
    : timeoutController;

  try {
    const res = await fetch(`${API_BASE}/lattice`, {
      method: "GET",
      signal: combined.signal, // real AbortSignal
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Lattice fetch failed: HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new Error("Request aborted or timed out");
    }
    throw err;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
