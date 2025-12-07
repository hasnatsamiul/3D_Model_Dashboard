import React from "react";
import { Lattice } from "../types";

type ColorMode =
  | "stress"
  | "defect"
  | "aluminium"
  | "recommended"
  | "delta";

interface Props {
  lattice: Lattice | null;
  colorMode: ColorMode;
}

const modeLabel: Record<ColorMode, string> = {
  stress: "Stress",
  defect: "Defect probability",
  aluminium: "Aluminium mass",
  recommended: "Recommended aluminium (ML)",
  delta: "Delta (rec – current aluminium)",
};

const HeatmapLegend: React.FC<Props> = ({ lattice, colorMode }) => {
  if (!lattice) return null;

  const getValue = (d: any) => {
    switch (colorMode) {
      case "stress":
        return d.stress;
      case "defect":
        return d.defect_prob_pred ?? d.defect_prob_true;
      case "aluminium":
        return d.aluminium_mass;
      case "recommended":
        return d.recommended_aluminium_mass;
      case "delta":
        if (d.aluminium_mass != null && d.recommended_aluminium_mass != null) {
          return d.recommended_aluminium_mass - d.aluminium_mass;
        }
        return null;
      default:
        return null;
    }
  };

  const vals: number[] = [];
  lattice.nodes.forEach((n) => {
    const v = getValue(n.data || {});
    if (v != null && !isNaN(v)) vals.push(v);
  });

  if (!vals.length) return null;

  const min = Math.min(...vals);
  const max = Math.max(...vals);

  return (
    <div
      style={{
        position: "absolute",
        right: 16,
        bottom: 16,
        padding: "8px 10px",
        background: "rgba(0,0,0,0.7)",
        borderRadius: 6,
        fontSize: "0.8rem",
        border: "1px solid #444",
      }}
    >
      <div style={{ marginBottom: 4, fontWeight: 600 }}>
        {modeLabel[colorMode]}
      </div>
      <div
        style={{
          width: 160,
          height: 10,
          background:
            "linear-gradient(to right, hsl(216,100%,50%), hsl(0,100%,50%))",
          marginBottom: 4,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>min: {min.toFixed(3)}</span>
        <span>max: {max.toFixed(3)}</span>
      </div>
    </div>
  );
};

export default HeatmapLegend;
