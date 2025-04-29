import React, { useState } from "react";

function Login({ onLogin }) {
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rollNumber || !name) {
      setError("Both fields are required.");
      return;
    }
    try {
      const res = await fetch("https://dynamic-form-generator-9rl7.onrender.com/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ rollNumber, name })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(rollNumber);
      } else {
        setError(data.message || "Error logging in");
      }
    } catch (err) {
      setError("Something went wrong!");
    }
  };

    return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <input
        type="text"
        placeholder="Roll Number"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
        style={{ padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #ccc" }}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #ccc" }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" style={{ backgroundColor: "#2563eb", color: "white", padding: "0.75rem", borderRadius: "0.5rem", border: "none" }}>
        Login
      </button>
            </form>
  );
}

export default Login;
