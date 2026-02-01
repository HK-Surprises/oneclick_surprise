"use client";

import "./birthdayform-1.css";
import { useState } from "react";

export default function RosedayForm_1({ qrId }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
    };

    const formData = new FormData();
    formData.append("qrId", qrId);
    formData.append("theme_id", "roseday_1");
    formData.append("payload", JSON.stringify(payload));

    await fetch("/api/activate-qr", {
      method: "POST",
      body: formData,
    });

    window.location.reload();
  }

  return (
    <div className="form-wrapper">
      <h2>Rose Day 🌹</h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Submit */}
        <button className="primary-btn" disabled={loading}>
          {loading ? "Saving..." : "Activate QR"}
        </button>
      </form>
    </div>
  );
}
