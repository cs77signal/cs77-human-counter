
"use client";

import { useEffect, useState } from "react";

const initialStats = {
  uniqueHumans: 0,
  verificationRequests: 0,
  successfulVerifications: 0,
  failedAttempts: 0,
  blockedByWorldId: 0,
  alreadyVerified: 0,
  nullifierReplayed: 0,
};

export default function Home() {
  const [stats, setStats] = useState(initialStats);
  const [status, setStatus] = useState("CONNECTING");

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const response = await fetch("/api/stats", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || data.success !== true) {
          throw new Error("Statistics unavailable");
        }

        if (active) {
          setStats({
            ...initialStats,
            ...data.stats,
          });
          setStatus("LIVE");
        }
      } catch {
        if (active) {
          setStatus("UNAVAILABLE");
        }
      }
    }

    loadStats();

    const interval = setInterval(loadStats, 10000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const metrics = [
    ["UNIQUE HUMANS", stats.uniqueHumans],
    ["VERIFICATION REQUESTS", stats.verificationRequests],
    ["SUCCESSFUL VERIFICATIONS", stats.successfulVerifications],
    ["FAILED ATTEMPTS", stats.failedAttempts],
    ["BLOCKED BY WORLD ID", stats.blockedByWorldId],
    ["ALREADY VERIFIED", stats.alreadyVerified],
    ["NULLIFIER REPLAYED", stats.nullifierReplayed],
  ];

  return (
    <main>
      <p>⊕ CS77 • WORLD ID</p>

      <h1>HUMAN VERIFICATION</h1>

      <div className="status">
        <span className={status === "LIVE" ? "status-dot live" : "status-dot"} />
        SYSTEM {status}
      </div>

      <div className="metrics">
        {metrics.map(([label, value]) => (
          <section key={label}>
            <p>{label}</p>
            <strong>{Number(value).toLocaleString("en-US")}</strong>
          </section>
        ))}
      </div>

      <footer>
        @cs77signal
      </footer>
    </main>
  );
}
