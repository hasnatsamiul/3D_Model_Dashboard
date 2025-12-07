export interface NodeData {
  strength_score?: number;
  material_mass?: number;
  cost_factor?: number;

  recommended_aluminium_mass?: number;
  aluminium_ratio?: number;
  steel_ratio?: number;

  defect_prob_pred?: number;
}

export interface LatticeNode {
  id: number;
  x: number;
  y: number;
  z: number;
  data?: NodeData;
}

export interface Lattice {
  nodes: LatticeNode[];
  edges: { start: number; end: number }[];
}
