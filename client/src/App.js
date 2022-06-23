import React from "react";
import { useState } from "react";
import "./app.css";

function App() {
  const [key, setKey] = useState("");
  const [email, setEmail] = useState("");
  const [fetching, setFetching] = useState(false);

  const getKey = async (e) => {
    e.preventDefault();
    console.log(email);
    if (email === "") {
      setKey("Must enter email!");
      return;
    }
    if (fetching) return;
    setFetching(true);
    setKey("Generating...");
    const url =
      process.env.NODE_ENV === "production"
        ? "/api"
        : "http://localhost:5000/api";

    const res = await fetch(url + "/getAPIKey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });
    const data = await res.json();
    setEmail("");
    setFetching(false);
    setKey(data.key);
  };

  return (
    <div className="mainContainer">
      <h2>Enter your email to get an API key</h2>
      <form onSubmit={getKey}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Get Key</button>
      </form>
      <div>{key}</div>
      <div>Base API Url: https://tofik-bank-api.herokuapp.com/api</div>
      <div>
        For documentation check my Github wiki:{" "}
        <a
          href="https://github.com/TofikSaliba/bank-api"
          rel="noreferrer"
          target="_blank"
        >
          Here
        </a>
      </div>
    </div>
  );
}

export default App;
