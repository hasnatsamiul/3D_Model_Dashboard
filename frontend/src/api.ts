export const API_BASE = "https://threed-model-dashboard.onrender.com";

export async function fetchLattice() {
  const res = await fetch(`${API_BASE}/lattice`);
  return await res.json();
}
