"use client";

import "./anniversaryform-1.css";
import { useState, useRef } from "react";

const SONG_MAP = {
  anniversary1: "/songs/anniversary1.mp3",
  anniversary2: "/songs/anniversary2.mp3",
  anniversary3: "/songs/anniversary3.mp3",
};

export default function AnniversaryForm_1({ qrId }) {
  const [coupleName, setCoupleName] = useState("");
  const [anniversaryDate, setAnniversaryDate] = useState("");
  const [photos, setPhotos] = useState([]);
  const [song, setSong] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSongChange = (e) => {
    setSong(e.target.value);
    setIsPlaying(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (audioRef.current) audioRef.current.pause();

    const formData = new FormData();
    formData.append("qrId", qrId);
    formData.append("couple_name", coupleName);
    formData.append("anniversary_date", anniversaryDate);
    formData.append("song", song);
    formData.append("theme_id", "anniversary_1");

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

        {/* Anniversary Date */}
        <div className="form-group">
          <input
            type="date"
            value={anniversaryDate}
            onChange={(e) => setAnniversaryDate(e.target.value)}
            required
          />
        </div>

        {/* Photos */}
        <div className="form-group">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setPhotos(e.target.files)}
            required
          />
        </div>

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
            <button
              type="button"
              className="preview-btn"
              onClick={togglePlay}
            >
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
