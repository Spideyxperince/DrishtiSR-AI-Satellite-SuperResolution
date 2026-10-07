import { useRef, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import "./BeforeAfterSlider.css";

type Size = { width: number; height: number } | null | undefined;

type BeforeAfterSliderProps = {
  beforeUrl: string;
  afterUrl: string;
  beforeSize?: Size;
  afterSize?: Size;
};

const ZOOM_LEVELS = [1, 2, 3, 4, 6, 8];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const formatSize = (size: Size) => (size ? `${size.width}×${size.height}` : "");

type DragState = {
  mode: "divider" | "pan";
  startX: number;
  startY: number;
  startOffset: { x: number; y: number };
};

export default function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeSize,
  afterSize,
}: BeforeAfterSliderProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);

  // Divider position in percent from the left edge
  const [position, setPosition] = useState(50);
  const [zoomIndex, setZoomIndex] = useState(0);
  // Picture position when zoomed in (pixels, never positive)
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [pixelView, setPixelView] = useState(false);
  const [beforeLoaded, setBeforeLoaded] = useState(false);
  const [afterLoaded, setAfterLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loadedRatio, setLoadedRatio] = useState(1.5);

  const zoom = ZOOM_LEVELS[zoomIndex];
  const ready = beforeLoaded && afterLoaded;
  const ratio = afterSize ? afterSize.width / afterSize.height : loadedRatio;

  // Keep the zoomed picture covering the whole frame
  const limitOffset = (x: number, y: number, level: number) => {
    const frame = frameRef.current;
    if (!frame) return { x: 0, y: 0 };
    const { width, height } = frame.getBoundingClientRect();
    return {
      x: clamp(x, width - width * level, 0),
      y: clamp(y, height - height * level, 0),
    };
  };

  const moveDividerTo = (clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100, 0, 100));
  };

  const changeZoom = (nextIndex: number) => {
    const next = clamp(nextIndex, 0, ZOOM_LEVELS.length - 1);
    const nextZoom = ZOOM_LEVELS[next];
    const frame = frameRef.current;

    if (!frame || nextZoom === 1) {
      setOffset({ x: 0, y: 0 });
    } else {
      // Zoom towards the middle of the frame
      const { width, height } = frame.getBoundingClientRect();
      const centerX = width / 2;
      const centerY = height / 2;
      const contentX = (centerX - offset.x) / zoom;
      const contentY = (centerY - offset.y) / zoom;
      setOffset(
        limitOffset(
          centerX - contentX * nextZoom,
          centerY - contentY * nextZoom,
          nextZoom,
        ),
      );
    }
    setZoomIndex(next);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!ready) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const onDivider =
      (event.target as HTMLElement).closest("[data-divider]") !== null;

    if (zoom === 1 || onDivider) {
      drag.current = {
        mode: "divider",
        startX: event.clientX,
        startY: event.clientY,
        startOffset: offset,
      };
      if (!onDivider) moveDividerTo(event.clientX);
    } else {
      drag.current = {
        mode: "pan",
        startX: event.clientX,
        startY: event.clientY,
        startOffset: offset,
      };
    }

    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state) return;

    if (state.mode === "divider") {
      moveDividerTo(event.clientX);
    } else {
      setOffset(
        limitOffset(
          state.startOffset.x + event.clientX - state.startX,
          state.startOffset.y + event.clientY - state.startY,
          zoom,
        ),
      );
    }
  };

  const stopDragging = () => {
    drag.current = null;
    setDragging(false);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      setPosition((value) => clamp(value - 2, 0, 100));
    } else if (event.key === "ArrowRight") {
      setPosition((value) => clamp(value + 2, 0, 100));
    } else if (event.key === "Home") {
      setPosition(0);
    } else if (event.key === "End") {
      setPosition(100);
    } else {
      return;
    }
    event.preventDefault();
  };

  const layerStyle = {
    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
  };

  const frameClass = [
    "ba__frame",
    zoom > 1 ? "ba__frame--zoomed" : "",
    dragging ? "ba__frame--dragging" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (failed) {
    return (
      <div className="ba__error">
        The comparison images could not be loaded. The server may have
        restarted and removed the files. Run Super Resolution again, then press
        Refresh Results.
      </div>
    );
  }

  return (
    <div className="ba">
      <div
        className="ba__stage"
        style={{ maxWidth: `min(100%, calc(70vh * ${ratio}))` }}
      >
        <div
          ref={frameRef}
          className={frameClass}
          style={{ aspectRatio: `${ratio}` }}
          role="slider"
          tabIndex={0}
          aria-label="Before and after comparison"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onKeyDown={handleKeyDown}
        >
          {/* After: the enhanced image fills the whole frame */}
          <div className="ba__layer" style={layerStyle}>
            <img
              className="ba__img"
              src={afterUrl}
              alt="AI super-resolved"
              draggable={false}
              style={{ opacity: ready ? 1 : 0 }}
              onLoad={(event) => {
                const image = event.currentTarget;
                if (image.naturalWidth && image.naturalHeight) {
                  setLoadedRatio(image.naturalWidth / image.naturalHeight);
                }
                setAfterLoaded(true);
              }}
              onError={() => setFailed(true)}
            />
          </div>

          {/* Before: only the part left of the divider is visible */}
          <div
            className="ba__before"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <div className="ba__layer" style={layerStyle}>
              <img
                className={`ba__img ${pixelView ? "ba__pixelated" : ""}`}
                src={beforeUrl}
                alt="Original Sentinel-2"
                draggable={false}
                style={{ opacity: ready ? 1 : 0 }}
                onLoad={() => setBeforeLoaded(true)}
                onError={() => setFailed(true)}
              />
            </div>
          </div>

          {/* Divider and handle */}
          {ready && (
            <div
              className="ba__divider"
              data-divider
              style={{ left: `${position}%` }}
            >
              <div className="ba__line" />
              <div className="ba__handle">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 6 3 12 9 18" />
                  <polyline points="15 6 21 12 15 18" />
                </svg>
              </div>
            </div>
          )}

          {/* Labels */}
          {ready && (
            <>
              <div className="ba__label ba__label--before">
                Before <span>{formatSize(beforeSize)}</span>
              </div>
              <div className="ba__label ba__label--after">
                After <span>{formatSize(afterSize)}</span>
              </div>
            </>
          )}

          {!ready && (
            <div className="ba__loading">
              <div className="ba__spinner" />
              <p>Preparing comparison...</p>
            </div>
          )}
        </div>

        {/* Tools */}
        <div className="ba__toolbar">
          <p className="ba__hint">
            {zoom > 1
              ? "Drag the handle to compare · drag the image to move around"
              : "Drag the handle to compare · zoom in to inspect the detail"}
          </p>
          <div className="ba__tools">
            <button
              type="button"
              className="ba__button"
              aria-label="Zoom out"
              disabled={zoomIndex === 0}
              onClick={() => changeZoom(zoomIndex - 1)}
            >
              −
            </button>
            <span className="ba__zoom-value">{zoom}×</span>
            <button
              type="button"
              className="ba__button"
              aria-label="Zoom in"
              disabled={zoomIndex === ZOOM_LEVELS.length - 1}
              onClick={() => changeZoom(zoomIndex + 1)}
            >
              +
            </button>
            <button
              type="button"
              className="ba__button"
              disabled={zoom === 1}
              onClick={() => changeZoom(0)}
            >
              Reset
            </button>
            <button
              type="button"
              className={`ba__button ${pixelView ? "ba__button--active" : ""}`}
              aria-pressed={pixelView}
              onClick={() => setPixelView((value) => !value)}
            >
              Pixel view
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
