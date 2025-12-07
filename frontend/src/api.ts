export async function fetchLattice() {
  const res = await fetch("http://localhost:8000/lattice");
  return await res.json();
}
