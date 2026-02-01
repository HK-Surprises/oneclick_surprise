"use client";

import "./birthdayform-1.css";
import { useState, useRef } from "react";

const SONG_MAP = {
  birthday1: "/songs/Birthday_1/birthday1.mp3",
  birthday2: "/songs/Birthday_1/birthday2.mp3",
  birthday3: "/songs/Birthday_1/birthday3.mp3",
  birthday4: "/songs/Birthday_1/birthday4.mp3",
  birthday5: "/songs/Birthday_1/birthday5.mp3",
};

export default function BirthdayForm({ qrId }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
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

    const payload = {
      name,
      age,
      song,
    };

    const formData = new FormData();
    formData.append("qrId", qrId);
    formData.append("theme_id", "birthday_1");

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
      <h2>Birthday Details 🎂</h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Age */}
        <div className="form-group">
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
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
            <option value="birthday1">Happy Birthday 1 🎂</option>
            <option value="birthday2">Happy Birthday 2 🎂</option>
            <option value="birthday3">Happy Birthday 3 🎂</option>
            <option value="birthday4">Happy Birthday 4 🎂</option>
            <option value="birthday5">Happy Birthday 5 🎂</option>
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
