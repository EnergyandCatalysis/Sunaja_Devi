"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// List of recent congratulatory publication announcements.
// You can add as many publications here as you want!
// Any publication published within its active window (default 7 days) will automatically show in the popup.
export const activeAnnouncements = [
  {
    id: "pub-1",
    enabled: true,
    publishDate: "2026-07-30", // Date published (YYYY-MM-DD)
    activeDays: 7, // Active for 7 days (1 week)
    publisherName: "Dr. Pushparaj L. & Cheriyan John",
    publisherRole: "Post-Doctoral Researcher & PhD Scholar",
    publisherPhoto: `${basePath}/images/pushparaj_cheriyan_announcement.png`,
    paperTitle: "ZIF-8/LDH Nanohybrids for Dye Adsorption: LDH Composition-Dependent Structure and Adsorption Performance",
    journal: "ACS Appl. Nano Mater. (2026) 9 (28): 13490–13507",
    link: "https://doi.org/10.1021/acsanm.6c02084",
  },
  // Example for a second simultaneous publication:
  // {
  //   id: "pub-2",
  //   enabled: true,
  //   publishDate: "2026-07-30",
  //   activeDays: 7,
  //   publisherName: "Jessica Jones W",
  //   publisherRole: "PhD Scholar",
  //   publisherPhoto: "",
  //   paperTitle: "Title of Second Paper...",
  //   journal: "Journal of Materials Chemistry A (2026)",
  //   link: "https://doi.org/...",
  // },
];

function getPublisherInitials(name) {
  if (!name) return "SD";
  const cleanName = name.replace(/^Dr\.\s*/i, "").replace(/\./g, " ");
  const words = cleanName.split(" ").filter(Boolean);
  return ((words[0]?.[0] || "") + (words[words.length - 1]?.[0] || "")).toUpperCase();
}

export default function CongratulatoryPopup({ announcements = activeAnnouncements }) {
  const [validItems, setValidItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  // Filter active announcements within 1-week window
  useEffect(() => {
    const list = Array.isArray(announcements) ? announcements : [announcements];
    const nowTime = new Date().getTime();

    const activeList = list.filter((item) => {
      if (!item || item.enabled === false) return false;
      if (!item.publishDate) return true;

      const pubTime = new Date(item.publishDate).getTime();
      const activeDuration = (item.activeDays || 7) * 24 * 60 * 60 * 1000;
      
      // Return true if within active window
      return (nowTime - pubTime <= activeDuration) && (nowTime >= pubTime - 86400000);
    });

    setValidItems(activeList);

    if (activeList.length === 0) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    const TOTAL_DURATION_MS = 10000; // 10 seconds total display time
    const INTERVAL_MS = 100;
    const step = (INTERVAL_MS / TOTAL_DURATION_MS) * 100;

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
    }, TOTAL_DURATION_MS);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(autoCloseTimer);
    };
  }, [announcements]);

  // Auto rotate slides if multiple active announcements exist
  useEffect(() => {
    if (validItems.length <= 1) return;

    const rotateInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validItems.length);
    }, 5000); // switch slide every 5s if multiple papers exist

    return () => clearInterval(rotateInterval);
  }, [validItems]);

  if (!isVisible || validItems.length === 0) return null;

  const currentItem = validItems[currentIndex] || validItems[0];
  const initials = getPublisherInitials(currentItem.publisherName);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + validItems.length) % validItems.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validItems.length);
  };

  return (
    <div className="popup-overlay-container" id="congratulations-popup-wrapper">
      <div className="popup-card" id="congratulations-popup-card">
        {/* Header Ribbon & Navigation / Close controls */}
        <div className="popup-header">
          <div className="popup-badge">
            <span className="popup-badge-icon">🎉</span>
            <span className="popup-badge-text">
              {validItems.length > 1 ? `New Paper (${currentIndex + 1}/${validItems.length})` : "New Publication!"}
            </span>
          </div>

          <div className="popup-header-actions">
            {validItems.length > 1 && (
              <div className="popup-nav-arrows">
                <button className="popup-nav-btn" onClick={handlePrev} title="Previous Announcement">‹</button>
                <button className="popup-nav-btn" onClick={handleNext} title="Next Announcement">›</button>
              </div>
            )}
            <button
              className="popup-close-btn"
              onClick={() => setIsVisible(false)}
              aria-label="Close Announcement"
              id="popup-close-btn"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="popup-body">
          <div className="popup-congrats-title">
            <span>Congratulations</span>
            <span className="sparkle-icon">✨</span>
          </div>

          <div className="publisher-section-large">
            {currentItem.publisherPhoto ? (
              <div className="publisher-photo-container">
                <Image
                  src={currentItem.publisherPhoto}
                  alt={currentItem.publisherName}
                  width={360}
                  height={220}
                  className="publisher-photo-large"
                />
              </div>
            ) : (
              <div className="publisher-initials-avatar">{initials}</div>
            )}
            <div className="publisher-details">
              <h4 className="publisher-name">{currentItem.publisherName}</h4>
              <p className="publisher-role">{currentItem.publisherRole}</p>
            </div>
          </div>

          <div className="publication-info-box">
            <p className="publication-paper-title">&ldquo;{currentItem.paperTitle}&rdquo;</p>
            <p className="publication-journal-tag">{currentItem.journal}</p>
          </div>

          {currentItem.link && (
            <a
              href={currentItem.link}
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

          {/* Dots Indicator if multiple active items */}
          {validItems.length > 1 && (
            <div className="popup-dots-container">
              {validItems.map((_, idx) => (
                <span
                  key={idx}
                  className={`popup-dot ${idx === currentIndex ? "active" : ""}`}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 10-Second Progress Bar */}
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
