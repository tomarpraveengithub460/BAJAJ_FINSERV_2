import React, { useState } from "react";
import Login from "./components/Login";
import DynamicForm from "./components/DynamicForm";

function App() {
  const [rollNumber, setRollNumber] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "2rem" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", backgroundColor: "white", padding: "2rem", borderRadius: "1rem", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
        <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "1rem" }}>Dynamic Form Builder</h1>
        {!isLoggedIn ? (
          <Login
            onLogin={(roll) => {
              setRollNumber(roll);
              setIsLoggedIn(true);
            }}
          />
        ) : (
          <DynamicForm rollNumber={rollNumber} />
        )}
      </div>
    </div>
  );
}

export default App;
