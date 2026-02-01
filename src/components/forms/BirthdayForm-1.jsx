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

  // image options
  const [useCustomImages, setUseCustomImages] = useState("no");

  const defaultMessage = `Happy Birthday, ! You deserve all the happiness, love, and smiles in the world today and always. You have this special way of making everything around you brighter, your smile, your kindness, and the way you make people feel truly cared for. I hope your day is filled with laughter, surprises, and moments that make your heart happy. You’re truly one of a kind, and I just want you to know how special you are. Keep being the amazing person you are, spreading joy wherever you go. Wishing you endless happiness, success, and all the sweet things life has to offer. 💗`;
  const [message, setMessage] = useState(defaultMessage);

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

    if (useCustomImages === "yes" && photos.length === 0) {
      alert("Please upload at least one image");
      setLoading(false);
      return;
    }

    const payload = {
      name,
      age,
      song,
      use_ai_images: useCustomImages === "no",
      message,
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
              <span className="radio-label-text">Custom Image</span>
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
              <span className="radio-label-text">Use Default Image</span>
            </label>
          </div>
        </div>

        {/* Image Upload (custom only) */}
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

        {/* Message */}
        <div className="form-group">
          <p>Enter your message</p>
          <textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
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
