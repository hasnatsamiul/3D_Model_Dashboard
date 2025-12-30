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

  // Prevent double-fetch (React 18 dev StrictMode / accidental re-renders)
  const loadedOnceRef = useRef(false);

  // For aborting previous request if user reloads quickly
  const abortRef = useRef<AbortController | null>(null);

  // Status timer
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);

  const stopTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    startedAtRef.current = Date.now();

    timerRef.current = window.setInterval(() => {
      const secs = Math.floor((Date.now() - startedAtRef.current) / 1000);
      // Update status with elapsed time
      setStatus((prev) => {
        // Keep the message but add elapsed seconds
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
    setStatus("Loading lattice & ML predictions... It will take some time");
    startTimer();

    try {
      // If your fetchLattice supports a signal + timeout, use it:
      // const data = await fetchLattice({ signal: abortRef.current.signal, timeoutMs: 120000 });

      // Otherwise, at least pass the signal if supported
      const data = await fetchLattice(abortRef.current.signal as any);

      setLattice(data);
      setStatus(null);
    } catch (e: any) {
      if (e?.name === "AbortError") {
        setStatus("Request cancelled.");
      } else {
        setStatus(null);
        setError(e?.message ? String(e.message) : "Failed to load lattice.");
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
      // cleanup on unmount
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

        {error && (
          <div className="status" style={{ color: "#ff6b6b" }}>
            {error}
          </div>
        )}

        <ChartsPanel lattice={lattice} />
        <NodeDetails node={selectedNode} />
      </div>

      <div className="viewer">
        <LatticeViewer lattice={lattice} colorMode={colorMode} onSelectNode={setSelectedNode} />
      </div>
    </div>
  );
};

export default App;
