"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Default configuration for latest congratulatory publication announcement
// Update these details whenever a group member publishes a new article!
export const currentAnnouncement = {
  enabled: true, // Set to false to disable popup manually
  publishDate: "2026-07-30", // Date when paper was added/published (YYYY-MM-DD)
  activeDays: 7, // Popup stays active for 7 days (1 week) from publishDate
  publisherName: "Dr. Pushparaj L. & Cheriyan John",
  publisherRole: "Post-Doctoral Researcher & PhD Scholar",
  publisherPhoto: `${basePath}/images/pushparaj_cheriyan_announcement.png`,
  paperTitle: "ZIF-8/LDH Nanohybrids for Dye Adsorption: LDH Composition-Dependent Structure and Adsorption Performance",
  journal: "ACS Appl. Nano Mater. (2026) 9 (28): 13490–13507",
  link: "https://doi.org/10.1021/acsanm.6c02084",
};

function getPublisherInitials(name) {
  if (!name) return "SD";
  const cleanName = name.replace(/^Dr\.\s*/i, "").replace(/\./g, " ");
  const words = cleanName.split(" ").filter(Boolean);
  return ((words[0]?.[0] || "") + (words[words.length - 1]?.[0] || "")).toUpperCase();
}

export default function CongratulatoryPopup({ config = currentAnnouncement }) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!config || !config.enabled) return;

    // Check if announcement is within the 1-week active window
    if (config.publishDate) {
      const pubTime = new Date(config.publishDate).getTime();
      const nowTime = new Date().getTime();
      const activeDuration = (config.activeDays || 7) * 24 * 60 * 60 * 1000;
      
      // If current date exceeds 1 week from publish date, do not show
      if (nowTime - pubTime > activeDuration || nowTime < pubTime - 86400000) {
        return;
      }
    }

    // Show popup
    setIsVisible(true);

    const DURATION_MS = 10000; // 10 seconds
    const INTERVAL_MS = 100;
    const step = (INTERVAL_MS / DURATION_MS) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressTimer);
          setIsVisible(false);
          return 0;
        }
        return prev - step;
      });
    }, INTERVAL_MS);

    const autoCloseTimer = setTimeout(() => {
      setIsVisible(false);
    }, DURATION_MS);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(autoCloseTimer);
    };
  }, [config]);

  if (!isVisible) return null;

  const initials = getPublisherInitials(config.publisherName);

  return (
    <div className="popup-overlay-container" id="congratulations-popup-wrapper">
      <div className="popup-card" id="congratulations-popup-card">
        {/* Header Ribbon & Close button */}
        <div className="popup-header">
          <div className="popup-badge">
            <span className="popup-badge-icon">🎉</span>
            <span className="popup-badge-text">New Publication!</span>
          </div>
          <button
            className="popup-close-btn"
            onClick={() => setIsVisible(false)}
            aria-label="Close Announcement"
            id="popup-close-btn"
          >
            ✕
          </button>
        </div>

        {/* Content Section */}
        <div className="popup-body">
          <div className="popup-congrats-title">
            <span>Congratulations</span>
            <span className="sparkle-icon">✨</span>
          </div>

          <div className="publisher-section-large">
            {config.publisherPhoto ? (
              <div className="publisher-photo-container">
                <Image
                  src={config.publisherPhoto}
                  alt={config.publisherName}
                  width={360}
                  height={220}
                  className="publisher-photo-large"
                />
              </div>
            ) : (
              <div className="publisher-initials-avatar">{initials}</div>
            )}
            <div className="publisher-details">
              <h4 className="publisher-name">{config.publisherName}</h4>
              <p className="publisher-role">{config.publisherRole}</p>
            </div>
          </div>

          <div className="publication-info-box">
            <p className="publication-paper-title">&ldquo;{config.paperTitle}&rdquo;</p>
            <p className="publication-journal-tag">{config.journal}</p>
          </div>

          {config.link && (
            <a
              href={config.link}
              target="_blank"
              rel="noopener noreferrer"
              className="popup-link-btn"
              id="popup-read-paper-link"
            >
              <span>View Publication</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          )}
        </div>

        {/* 20-Second Progress Bar */}
        <div className="popup-progress-track">
          <div
            className="popup-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
