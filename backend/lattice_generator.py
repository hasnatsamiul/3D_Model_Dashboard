import json
from pathlib import Path

def generate_lattice(nx=6, ny=6, nz=3, spacing=1.0, out_path="backend/data/lattice.json"):
    nodes = []
    node_id = 0
    id_by_coord = {}

    for i in range(nx):
        for j in range(ny):
            for k in range(nz):
                nodes.append({"id": node_id, "x": i * spacing, "y": j * spacing, "z": k * spacing})
                id_by_coord[(i, j, k)] = node_id
                node_id += 1

    edges = []
    def add_edge(a, b):
        edges.append({"start": a, "end": b})

    for i in range(nx):
        for j in range(ny):
            for k in range(nz):
                this_id = id_by_coord[(i, j, k)]
                if i + 1 < nx: add_edge(this_id, id_by_coord[(i + 1, j, k)])
                if j + 1 < ny: add_edge(this_id, id_by_coord[(i, j + 1, k)])
                if k + 1 < nz: add_edge(this_id, id_by_coord[(i, j, k + 1)])

    lattice = {"nodes": nodes, "edges": edges}
    Path("backend/data").mkdir(parents=True, exist_ok=True)
    Path(out_path).write_text(json.dumps(lattice, indent=2))
    print(f" Saved lattice: {len(nodes)} nodes, {len(edges)} edges -> {out_path}")

if __name__ == "__main__":
    generate_lattice()
