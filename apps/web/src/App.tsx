import { useEffect, useState } from "react";

import { getHealth } from "./lib/api";

function App() {
  const [status, setStatus] = useState("Checking API connection...");

  useEffect(() => {
    async function checkApi() {
      try {
        const data = await getHealth();

        setStatus(
          data.status === "ok"
            ? `Connected to ${data.service}`
            : "API unavailable",
        );
      } catch {
        setStatus("Unable to connect to API");
      }
    }

    checkApi();
  }, []);

  return (
    <main>
      <h1>TraceGraph</h1>

      <p>{status}</p>
    </main>
  );
}

export default App;