import React from "react";
import { LatticeNode } from "../types";

interface Props {
  node: LatticeNode | null;
}

const safeNum = (value: any) => {
  return typeof value === "number" ? value.toFixed(3) : "N/A";
};

const NodeDetails: React.FC<Props> = ({ node }) => {
  if (!node) {
    return <div style={{ padding: 8 }}>Click a node to view details.</div>;
  }

  const d = node.data ?? {};

  return (
    <div style={{ padding: 8, borderTop: "1px solid #444" }}>
      <h3>Node Details</h3>

      <p><strong>ID:</strong> {node.id}</p>

      <p>
        <strong>Position:</strong><br />
        X: {safeNum(node.x)}<br />
        Y: {safeNum(node.y)}<br />
        Z: {safeNum(node.z)}
      </p>

      <h4>Material Metrics</h4>
      <ul>
        <li>Strength Score: {safeNum(d.strength_score)}</li>
        <li>Material Mass: {safeNum(d.material_mass)}</li>
        <li>Cost Factor: {safeNum(d.cost_factor)}</li>
        <li>Recommended Aluminium Mass: {safeNum(d.recommended_aluminium_mass)}</li>
        <li>Aluminium Ratio: {safeNum(d.aluminium_ratio)}</li>
        <li>Steel Ratio: {safeNum(d.steel_ratio)}</li>
        <li>Defect Probability: {safeNum(d.defect_prob_pred)}</li>
      </ul>
    </div>
  );
};

export default NodeDetails;
