export async function fetchLattice() {
  const res = await fetch("/data/lattice_enriched.json", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Lattice fetch failed: HTTP ${res.status}`);
  }

  return await res.json();
}
