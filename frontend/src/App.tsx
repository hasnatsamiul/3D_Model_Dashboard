import React, { useEffect, useRef, useState } from "react";
import { Lattice, LatticeNode } from "./types";
import { fetchLattice } from "./api";
import LatticeViewer from "./components/LatticeViewer";
import Sidebar from "./components/Sidebar";
import ChartsPanel from "./components/ChartsPanel";
import NodeDetails from "./components/NodeDetails";

type ColorMode = "stress" | "defect" | "aluminium" | "recommended" | "delta";

const App: React.FC = () => {
  const [lattice, setLattice] = useState<Lattice | null>(null);
  const [colorMode, setColorMode] = useState<ColorMode>("stress");

  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectedNode, setSelectedNode] = useState<LatticeNode | null>(null);

  // Prevent double-fetch (React 18 StrictMode/dev)
  const loadedOnceRef = useRef(false);

  // Abort in-flight request if reloading
  const abortRef = useRef<AbortController | null>(null);

  // Status timer
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);

  const stopTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    startedAtRef.current = Date.now();

    timerRef.current = window.setInterval(() => {
      const secs = Math.floor((Date.now() - startedAtRef.current) / 1000);
      setStatus((prev) => {
        const base = prev?.split(" (")[0] ?? "Loading lattice...";
        return `${base} (${secs}s)`;
      });
    }, 1000);
  };

  const loadLattice = async () => {
    // Cancel any previous request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setError(null);
    setStatus("Loading lattice & ML predictions... It may take some time");
    startTimer();

    try {
      const data = await fetchLattice({
        signal: abortRef.current.signal,
        timeoutMs: 120000,
      });

      setLattice(data);
      setStatus(null);
    } catch (e: any) {
      const msg = e?.message ? String(e.message) : "Failed to load lattice.";

      // Matches api.ts behavior ("Request aborted or timed out")
      if (msg.toLowerCase().includes("aborted") || msg.toLowerCase().includes("timed out")) {
        setStatus("Request cancelled / timed out.");
        setError(null);
      } else {
        setStatus(null);
        setError(msg);
      }
    } finally {
      stopTimer();
    }
  };

  useEffect(() => {
    if (loadedOnceRef.current) return;
    loadedOnceRef.current = true;

    loadLattice();

    return () => {
      if (abortRef.current) abortRef.current.abort();
      stopTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-root">
      <div className="sidebar">
        <Sidebar onReload={loadLattice} colorMode={colorMode} setColorMode={setColorMode} />

        {status && <div className="status">{status}</div>}

        {error && <div className="status" style={{ color: "#ff6b6b" }}>{error}</div>}

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
