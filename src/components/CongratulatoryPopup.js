"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import rawAnnouncements from "@/data/activeAnnouncements.json";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const activeAnnouncements = rawAnnouncements.map((item) => ({
  ...item,
  publisherPhoto: item.publisherPhoto && !item.publisherPhoto.startsWith("http")
    ? item.publisherPhoto.startsWith(basePath) ? item.publisherPhoto : `${basePath}${item.publisherPhoto}`
    : item.publisherPhoto,
}));

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
  const [isClosing, setIsClosing] = useState(false);
  const [progress, setProgress] = useState(100);

  const handleClose = () => {
    setIsClosing(true);
    if (typeof window !== "undefined" && validItems[currentIndex]?.id) {
      try {
        localStorage.setItem(`dismissed_announcement_${validItems[currentIndex].id}`, "true");
      } catch (_) {}
    }
    setTimeout(() => {
      setIsVisible(false);
    }, 400);
  };

  // Filter active announcements within 4-day max window
  useEffect(() => {
    const list = Array.isArray(announcements) ? announcements : [announcements];
    const nowTime = new Date().getTime();

    const activeList = list.filter((item) => {
      if (!item || item.enabled === false) return false;

      // LocalStorage check for visitor dismissal
      if (typeof window !== "undefined" && item.id) {
        try {
          if (localStorage.getItem(`dismissed_announcement_${item.id}`) === "true") {
            return false;
          }
        } catch (_) {}
      }

      if (!item.publishDate) return true;

      const pubTime = new Date(item.publishDate).getTime();
      const activeDuration = (item.activeDays || 4) * 24 * 60 * 60 * 1000;
      
      return (nowTime - pubTime <= activeDuration) && (nowTime >= pubTime - 86400000);
    });

    setValidItems(activeList);

    if (activeList.length === 0) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    setIsClosing(false);

    const TOTAL_DURATION_MS = 10000; // 10 seconds total display time
    const INTERVAL_MS = 100;
    const step = (INTERVAL_MS / TOTAL_DURATION_MS) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressTimer);
          setIsClosing(true);
          setTimeout(() => setIsVisible(false), 400);
          return 0;
        }
        return prev - step;
      });
    }, INTERVAL_MS);

    const autoCloseTimer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => setIsVisible(false), 400);
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
    }, 5000);

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
      <div className={`popup-card ${isClosing ? "exit-fun" : "enter-fun"}`} id="congratulations-popup-card">
        {/* Header Ribbon & Navigation / Close controls */}
        <div className="popup-header">
          <div className="popup-badge fun-wiggle">
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
              onClick={handleClose}
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
            <span className="sparkle-icon fun-sparkle">✨</span>
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
