// "use client";

// import { useState } from "react";

// export default function HomePage() {
//   const [msg, setMsg] = useState("");

//   async function callApi() {
//     const res = await fetch("/api/hello");
//     const data = await res.json();
//     setMsg(data.message);
//   }

//   async function callPostApi() {
//     const res = await fetch("/api/hello");
//     const data = await res.json();
//     setMsg(data.message);
//   }

//   return (
//     <div className="card p-4">
//       <h4 className="mb-3">Dashboard</h4>

//       <button className="btn btn-primary" onClick={callApi}>
//         Call API
//       </button>
//       <button className="btn btn-primary" onClick={callPostApi}>
//         Call Post API
//       </button>

//       {msg && (
//         <div className="alert alert-success mt-3">
//           API Response: <b>{msg}</b>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";

export default function HomePage() {
  const [msg, setMsg] = useState("");
  const [responseTime, setResponseTime] = useState(0);
  const [loading, setLoading] = useState(false);

  async function callApi() {
    setLoading(true);
    const startTime = performance.now();
    
    try {
      const res = await fetch("/api/hello");
      const data = await res.json();
      
      const endTime = performance.now();
      setResponseTime(endTime - startTime);
      setMsg(data.message);
    } catch (error) {
      setMsg("Error calling API");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function callPostApi() {
    setLoading(true);
    const startTime = performance.now();
    
    try {
      const requestBody = {
        name: "John Doe",
        email: "john@example.com",
        timestamp: new Date().toISOString(),
        data: {
          userId: 12345,
          action: "post_api_call",
          preferences: {
            theme: "dark",
            notifications: true
          }
        }
      };

      const res = await fetch("/api/hello", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await res.json();
      const endTime = performance.now();
      
      setResponseTime(endTime - startTime);
      setMsg(data.message || "POST request successful!");
    } catch (error) {
      setMsg("Error calling POST API");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-4">
      <h4 className="mb-3">Dashboard</h4>

      <div className="d-flex gap-2 mb-3">
        <button 
          className="btn btn-primary" 
          onClick={callApi}
          disabled={loading}
        >
          {loading ? "Loading..." : "Call GET API"}
        </button>
        
        <button 
          className="btn btn-secondary" 
          onClick={callPostApi}
          disabled={loading}
        >
          {loading ? "Loading..." : "Call POST API"}
        </button>
      </div>

      {msg && (
        <div className="alert alert-success mt-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              API Response: <b>{msg}</b>
            </div>
            <div className="text-muted">
              Response time: <b>{responseTime.toFixed(2)} ms</b>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="mt-3 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Making API request...</p>
        </div>
      )}
    </div>
  );
}