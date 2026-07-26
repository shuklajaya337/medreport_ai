"use client";

import { useState } from "react";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("english");

  const handleSubmit = () => {
    console.log("Saved:", name, email, language);
    alert("Settings saved!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Settings</h1>
      <div>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
        </select>
      </div>
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}