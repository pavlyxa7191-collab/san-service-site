import { useRef, useState, useCallback, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "До",
  afterLabel = "После",
  alt = "Сравнение до и после обработки",
  className = "",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50); // percent 0–100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPercent = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return 50;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.min(100, Math.max(0, (x / rect.width) * 100));
  }, []);

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setPosition(getPercent(e.clientX));
  };

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition(getPercent(e.clientX));
    },
    [isDragging, getPercent]
  );

  const onMouseUp = useCallback(() => setIsDragging(false), []);

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setPosition(getPercent(e.touches[0].clientX));
  };

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      setPosition(getPercent(e.touches[0].clientX));
    },
    [isDragging, getPercent]
  );

  const onTouchEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  // Keyboard accessibility
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 2));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 2));
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 12,
        cursor: isDragging ? "col-resize" : "ew-resize",
        userSelect: "none",
        touchAction: "pan-y",
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        aspectRatio: "3/2",
        width: "100%",
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      tabIndex={0}
      role="slider"
      aria-label="Слайдер сравнения до и после"
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
      onKeyDown={onKeyDown}
    >
      {/* AFTER image (full width, behind) */}
      <img
        src={afterSrc}
        alt={alt + " — после"}
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />

      {/* BEFORE image (clipped to left side) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          width: `${position}%`,
        }}
      >
        <img
          src={beforeSrc}
          alt={alt + " — до"}
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: containerRef.current
              ? containerRef.current.offsetWidth + "px"
              : "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Divider line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${position}%`,
          transform: "translateX(-50%)",
          width: 3,
          background: "#fff",
          boxShadow: "0 0 8px rgba(0,0,0,0.5)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Handle circle */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${position}%`,
          transform: "translate(-50%, -50%)",
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 11,
          pointerEvents: "none",
          transition: isDragging ? "none" : "box-shadow 0.2s",
        }}
      >
        {/* Arrow icons */}
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
          <path d="M5 7H17M5 7L2 4M5 7L2 10M17 7L20 4M17 7L20 10" stroke="#D0021B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Labels */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          background: "rgba(10,15,30,0.75)",
          color: "#fff",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "4px 10px",
          borderRadius: 6,
          zIndex: 12,
          pointerEvents: "none",
          opacity: position > 15 ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      >
        {beforeLabel}
      </div>
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: "rgba(208,2,27,0.85)",
          color: "#fff",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "4px 10px",
          borderRadius: 6,
          zIndex: 12,
          pointerEvents: "none",
          opacity: position < 85 ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      >
        {afterLabel}
      </div>
    </div>
  );
}
