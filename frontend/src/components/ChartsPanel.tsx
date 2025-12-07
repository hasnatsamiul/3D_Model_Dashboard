import React, { useState } from "react";
import { Lattice } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface Props {
  lattice: Lattice | null;
}

const metricOptions = [
  { key: "strength_score", label: "Strength Score" },
  { key: "material_mass", label: "Material Mass" },
  { key: "cost_factor", label: "Cost Factor" },
  { key: "recommended_aluminium_mass", label: "Recommended Aluminium Mass" },
  { key: "aluminium_ratio", label: "Aluminium Ratio" },
  { key: "steel_ratio", label: "Steel Ratio" },
  { key: "defect_prob_pred", label: "Defect Probability" }
];

const ChartsPanel: React.FC<Props> = ({ lattice }) => {
  const [metric, setMetric] = useState<string>("strength_score");

  if (!lattice) {
    return <div style={{ padding: 8 }}>Loading lattice...</div>;
  }

  const values = lattice.nodes
    .map((n) => n.data?.[metric as keyof typeof n.data])
    .filter((v): v is number => v !== null && v !== undefined);

  if (values.length === 0) {
    return (
      <div style={{ padding: 8 }}>
        No values available for <strong>{metric}</strong>.
      </div>
    );
  }

  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  const chartData = values.map((v, i) => ({
    index: i,
    value: v
  }));

  return (
    <div style={{ padding: 8, borderTop: "1px solid #333" }}>
      <h3>Metric Distribution</h3>

      <label>
        <strong>Metric: </strong>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          style={{ marginLeft: 6 }}
        >
          {metricOptions.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label}
            </option>
          ))}
        </select>
      </label>

      <p style={{ fontSize: "0.9rem" }}>Average: {avg.toFixed(3)}</p>

      <div style={{ width: "100%", height: 180 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="index" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#1f77ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsPanel;
