import React from "react";

interface Props {
  onReload: () => void;
  colorMode: "stress" | "defect" | "aluminium" | "recommended" | "delta";
  setColorMode: (
    mode: "stress" | "defect" | "aluminium" | "recommended" | "delta"
  ) => void;
}

const Sidebar: React.FC<Props> = ({ onReload, colorMode, setColorMode }) => {
  return (
    <div style={{ padding: "14px", borderBottom: "1px solid #333" }}>
      <h2>Car Engine Material Dashboard</h2>

      <button
        onClick={onReload}
        style={{
          marginTop: "10px",
          padding: "8px 15px",
          background: "#2d7ef7",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Load Lattice Data
      </button>

      <div style={{ marginTop: "20px" }}>
        <strong>Color Mode</strong>
        <br />

        <label>
          <input
            type="radio"
            checked={colorMode === "stress"}
            onChange={() => setColorMode("stress")}
          />
          Stress
        </label>
        <br />

        <label>
          <input
            type="radio"
            checked={colorMode === "defect"}
            onChange={() => setColorMode("defect")}
          />
          Defect Probability
        </label>
        <br />

        <label>
          <input
            type="radio"
            checked={colorMode === "aluminium"}
            onChange={() => setColorMode("aluminium")}
          />
          Aluminium Mass
        </label>
        <br />

        <label>
          <input
            type="radio"
            checked={colorMode === "recommended"}
            onChange={() => setColorMode("recommended")}
          />
          Recommended Aluminium Mass
        </label>
        <br />

        <label>
          <input
            type="radio"
            checked={colorMode === "delta"}
            onChange={() => setColorMode("delta")}
          />
          Delta (Rec – Current)
        </label>
      </div>
    </div>
  );
};

export default Sidebar;
