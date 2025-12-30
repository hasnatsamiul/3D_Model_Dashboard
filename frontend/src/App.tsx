import React, { useEffect, useState } from "react";
import { Lattice, LatticeNode } from "./types";
import { fetchLattice } from "./api";
import LatticeViewer from "./components/LatticeViewer";
import Sidebar from "./components/Sidebar";
import ChartsPanel from "./components/ChartsPanel";
import NodeDetails from "./components/NodeDetails";

const App: React.FC = () => {
  const [lattice, setLattice] = useState<Lattice | null>(null);
  const [colorMode, setColorMode] = useState<
    "stress" | "defect" | "aluminium" | "recommended" | "delta"
  >("stress");
  const [status, setStatus] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<LatticeNode | null>(null);

  const loadLattice = async () => {
    setStatus("Loading lattice & ML predictions...This will take 20 seconds");
    const data = await fetchLattice();
    setLattice(data);
    setStatus(null);
  };

  useEffect(() => {
    loadLattice(); // auto-load
  }, []);

  return (
    <div className="app-root">

      <div className="sidebar">
        <Sidebar
          onReload={loadLattice}
          colorMode={colorMode}
          setColorMode={setColorMode}
        />

        {status && <div className="status">{status}</div>}

        <ChartsPanel lattice={lattice} />
        <NodeDetails node={selectedNode} />
      </div>

      <div className="viewer">
        <LatticeViewer
          lattice={lattice}
          colorMode={colorMode}
          onSelectNode={setSelectedNode}
        />
      </div>

    </div>
  );
};

export default App;
