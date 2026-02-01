"use client";

import "./anniversaryform-1.css";
import { useState, useRef } from "react";

const SONG_MAP = {
  anniversary1: "/songs/Anniversary_1/anniversary1.mp3",
  anniversary2: "/songs/Anniversary_1/anniversary2.mp3",
  anniversary3: "/songs/Anniversary_1/anniversary3.mp3",
};

export default function AnniversaryForm_1({ qrId }) {
  const [coupleName, setCoupleName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [monthsTogether, setMonthsTogether] = useState("");
  const [useCustomImages, setUseCustomImages] = useState("no");
  const [photos, setPhotos] = useState([]);
  const [useCustomMessage, setUseCustomMessage] = useState("no");
  const [message, setMessage] = useState("");
  const [song, setSong] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  /* ---------------- SONG PREVIEW ---------------- */
  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleSongChange = (e) => {
    setSong(e.target.value);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  /* ---------------- IMAGE VALIDATION ---------------- */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 3) {
      alert("Maximum 3 images allowed");
      return;
    }

    for (let file of files) {
      if (file.size > 20 * 1024 * 1024) {
        alert("Each image must be less than 20MB");
        return;
      }
    }

    setPhotos(files);
  };

  /* ---------------- SUBMIT ---------------- */
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (audioRef.current) audioRef.current.pause();

    const payload = {
      couple_name: coupleName,
      partner_name: partnerName,
      months_together: monthsTogether,
      song,
      use_ai_images: useCustomImages === "no",
      use_default_message: useCustomMessage === "no",
      ...(useCustomMessage === "yes" ? { message } : {}),
    };

    const formData = new FormData();
    formData.append("qrId", qrId);
    formData.append("theme_id", "anniversary_1");

    // 👇 payload as JSON string
    formData.append("payload", JSON.stringify(payload));

    // photos stay as files
    for (let i = 0; i < photos.length; i++) {
      formData.append("photos", photos[i]);
    }

    await fetch("/api/activate-qr", {
      method: "POST",
      body: formData,
    });

    window.location.reload();
  }

  const songSrc = SONG_MAP[song];

  return (
    <div className="form-wrapper">
      <h2>Anniversary Details 💍</h2>

      <form onSubmit={handleSubmit}>
        {/* Couple Name */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Couple Name"
            value={coupleName}
            onChange={(e) => setCoupleName(e.target.value)}
            required
          />
        </div>

        {/* Partner Name */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Partner Name"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            required
          />
        </div>

        {/* Months Together */}
        <div className="form-group">
          <input
            type="number"
            placeholder="Months Together"
            value={monthsTogether}
            onChange={(e) => setMonthsTogether(e.target.value)}
            required
          />
        </div>

        {/* Image Choice */}
        <div className="form-group">
          <p>Upload your images?</p>
          <div className="radio-group" role="radiogroup" aria-label="Upload images">
            <label className={`radio-option ${useCustomImages === "yes" ? "active" : ""}`}>
              <input
                type="radio"
                name="useCustomImages"
                value="yes"
                checked={useCustomImages === "yes"}
                onChange={() => setUseCustomImages("yes")}
                className="radio-input"
              />
              <span className="radio-label-text">Custom Images</span>
            </label>

            <label className={`radio-option ${useCustomImages === "no" ? "active" : ""}`}>
              <input
                type="radio"
                name="useCustomImages"
                value="no"
                checked={useCustomImages === "no"}
                onChange={() => setUseCustomImages("no")}
                className="radio-input"
              />
              <span className="radio-label-text">Use AI Images</span>
            </label>
          </div>
        </div>

        {/* Image Upload */}
        {useCustomImages === "yes" && (
          <div className="form-group">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            <small>Max 3 images, 20MB each</small>
          </div>
        )}

        {/* Message Choice */}
        <div className="form-group">
          <p>Add your own message?</p>
          <div className="radio-group" role="radiogroup" aria-label="Custom message">
            <label className={`radio-option ${useCustomMessage === "yes" ? "active" : ""}`}>
              <input
                type="radio"
                name="useCustomMessage"
                value="yes"
                checked={useCustomMessage === "yes"}
                onChange={() => setUseCustomMessage("yes")}
                className="radio-input"
              />
              <span className="radio-label-text">Yes</span>
            </label>

            <label className={`radio-option ${useCustomMessage === "no" ? "active" : ""}`}>
              <input
                type="radio"
                name="useCustomMessage"
                value="no"
                checked={useCustomMessage === "no"}
                onChange={() => setUseCustomMessage("no")}
                className="radio-input"
              />
              <span className="radio-label-text">Use Default Message</span>
            </label>
          </div>
        </div>

        {/* Custom Message */}
        {useCustomMessage === "yes" && (
          <div className="form-group">
            <textarea
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
        )}

        {/* Song Select */}
        <div className="form-group">
          <select value={song} onChange={handleSongChange} required>
            <option value="">Select Song</option>
            <option value="anniversary1">Anniversary Song 1 💍</option>
            <option value="anniversary2">Anniversary Song 2 💍</option>
            <option value="anniversary3">Anniversary Song 3 💍</option>
          </select>
        </div>

        {/* Song Preview */}
        {songSrc && (
          <div className="form-group">
            <button type="button" className="preview-btn" onClick={togglePlay}>
              {isPlaying ? "⏸ Pause Song" : "▶ Play Song"}
            </button>
            <audio
              ref={audioRef}
              src={songSrc}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        )}

        {/* Submit */}
        <button className="primary-btn" disabled={loading}>
          {loading ? "Saving..." : "Activate QR"}
        </button>
      </form>
    </div>
  );
}
