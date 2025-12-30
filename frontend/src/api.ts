export const API_BASE = "https://threed-model-dashboard.onrender.com";

type FetchLatticeOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
};

export async function fetchLattice(
  options: FetchLatticeOptions = {}
) {
  const { signal, timeoutMs = 120_000 } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  // Combine external signal (from React) + timeout signal
  const combinedSignal = signal
    ? new AbortSignalAny([signal, controller.signal])
    : controller.signal;

  try {
    const res = await fetch(`${API_BASE}/lattice`, {
      method: "GET",
      signal: combinedSignal,
      headers: {
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Lattice fetch failed: HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("Request aborted or timed out");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Utility to combine multiple AbortSignals
 * (Browser-safe implementation)
 */
class AbortSignalAny {
  signal: AbortSignal;

  constructor(signals: AbortSignal[]) {
    const controller = new AbortController();
    this.signal = controller.signal;

    signals.forEach((sig) => {
      if (sig.aborted) {
        controller.abort();
      } else {
        sig.addEventListener("abort", () => controller.abort(), { once: true });
      }
    });
  }
}
