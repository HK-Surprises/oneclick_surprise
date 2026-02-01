"use client";

import { useState } from "react";
import BirthdayForm from "./forms/BirthdayForm-1";
import AnniversaryForm_1 from "./forms/AnniversaryForm_1";
import RosedayForm_1 from "./forms/RosedayForm_1";

// Theme images (extend these when adding more
// images for other themes)
import b1_1 from "./Theme_Image/Birthday_1/1.jpeg";
import b1_2 from "./Theme_Image/Birthday_1/2.jpeg";
import b1_3 from "./Theme_Image/Birthday_1/3.jpeg";
import b1_4 from "./Theme_Image/Birthday_1/4.jpeg";
import b1_5 from "./Theme_Image/Birthday_1/5.jpeg";
import b1_6 from "./Theme_Image/Birthday_1/6.jpeg";

// Anniversary previews
import a1_1 from "./Theme_Image/Anniversary_1/1.jpeg";
import a1_2 from "./Theme_Image/Anniversary_1/2.jpeg";
import a1_3 from "./Theme_Image/Anniversary_1/3.jpeg";
import a1_4 from "./Theme_Image/Anniversary_1/4.jpeg";
import a1_5 from "./Theme_Image/Anniversary_1/5.jpeg";
import a1_6 from "./Theme_Image/Anniversary_1/6.jpeg";

// Roseday previews
import r1_1 from "./Theme_Image/Roseday_1/1.jpeg";
import r1_2 from "./Theme_Image/Roseday_1/2.jpeg";
import r1_3 from "./Theme_Image/Roseday_1/3.jpeg";
import r1_4 from "./Theme_Image/Roseday_1/4.jpeg";

const THEME_PREVIEWS = {
  "birthday-1": [b1_1, b1_2, b1_3, b1_4, b1_5, b1_6],
  "anniversary-1": [a1_1, a1_2, a1_3, a1_4, a1_5, a1_6],
  "roseday-1": [r1_1, r1_2, r1_3, r1_4],
};

export default function SetupForm({ qrId }) {
  const [theme, setTheme] = useState("");
  const [previewed, setPreviewed] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const handleSelectTheme = (value) => {
    setTheme(value);
    setPreviewed(false);
    setPreviewIndex(0);
  };

  const resetTheme = () => {
    setTheme("");
    setPreviewed(false);
    setPreviewIndex(0);
  };

  const proceedToForm = () => setPreviewed(true);

  const nextPreview = () => {
    const images = THEME_PREVIEWS[theme] || [];
    setPreviewIndex((i) => (images.length ? (i + 1) % images.length : 0));
  };

  const prevPreview = () => {
    const images = THEME_PREVIEWS[theme] || [];
    setPreviewIndex((i) => (images.length ? (i - 1 + images.length) % images.length : 0));
  };

  return (
    <div className="wrapper">
      <h2 className="title">Activate QR</h2>

      {/* STEP 1: THEME OPTIONS */}
      {!theme && (
        <div className="card">
          <h3>Select a Theme</h3>

          <div className="themeGrid">
            <ThemeCard
              label="Birthday - 1"
              emoji="🎂"
              onClick={() => handleSelectTheme("birthday-1")}
            />

            {/* <ThemeCard
              label="Birthday - 2"
              emoji="🎂"
              onClick={() => handleSelectTheme("birthday-2")}
            /> */}

            <ThemeCard
              label="Anniversary"
              emoji="💍"
              onClick={() => handleSelectTheme("anniversary-1")}
            />

            <ThemeCard
              label="Rose Day"
              emoji="🌹"
              onClick={() => handleSelectTheme("roseday-1")}
            />
          </div>

          <button className="secondaryBtn" onClick={resetTheme}>
            Cancel
          </button>
        </div>
      )}

      {/* STEP 2: PREVIEW (shown after theme select) */}
      {theme && !previewed && (
        <div className="card previewCard">
          <h3>Preview Theme</h3>
          <div className="previewActions">
            <button className="secondaryBtn" onClick={resetTheme}>
              ← Change Theme
            </button>
          </div>
          <div className="previewArea">
            {THEME_PREVIEWS[theme] ? (
              <>
                <img
                  src={THEME_PREVIEWS[theme][previewIndex].src || THEME_PREVIEWS[theme][previewIndex]}
                  alt={theme}
                  className="previewImage"
                />

                {THEME_PREVIEWS[theme].length > 1 && (
                  <div className="previewControls">
                    <button type="button" onClick={prevPreview} className="secondaryBtn">◀</button>
                    <span>{previewIndex + 1} / {THEME_PREVIEWS[theme].length}</span>
                    <button type="button" onClick={nextPreview} className="secondaryBtn">▶</button>
                  </div>
                )}
              </>
            ) : (
              <div className="placeholderPreview">
                <div className="emoji">{theme.includes("birthday") ? "🎂" : theme.includes("roseday") ? "🌹" : "✨"}</div>
                <p>No preview available for this theme yet</p>
              </div>
            )}
          </div>

          <div className="previewActions">
            <button className="primary-btn" onClick={proceedToForm}>
              Use this theme
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: FORM */}
      {theme && previewed && (
        <>
          <button className="secondaryBtn" onClick={() => setPreviewed(false)}>
            ← Back to Preview
          </button>

          {theme === "birthday-1" && <BirthdayForm qrId={qrId} />}
          {theme === "anniversary-1" && <AnniversaryForm_1 qrId={qrId} />}
          {theme === "roseday-1" && <RosedayForm_1 qrId={qrId} />}
          {theme === "birthday-2" && <BirthdayForm qrId={qrId} />}
        </>
      )}
    </div>
  );
}

function ThemeCard({ label, emoji, onClick }) {
  return (
    <button className="themeCard" onClick={onClick}>
      <span className="emoji">{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
