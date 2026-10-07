import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileImage,
  ImageOff,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { getProcessingResults } from "../services/api";
import { withSession } from "../services/session";
import BeforeAfterSlider from "../components/BeforeAfterSlider";

interface ProcessingResult {
  status?: string;
  stage?: string;
  input_filename?: string | null;
  output_filename?: string | null;
  input_size?: { width: number; height: number } | null;
  output_size?: { width: number; height: number } | null;
  input_resolution?: string;
  target_resolution?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Changes on every refresh so the browser loads fresh preview pictures
  const [version, setVersion] = useState(0);
  // How the two images are compared
  const [view, setView] = useState<"slider" | "side">("slider");

  const loadResults = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProcessingResults();
      setResult(data);
      setVersion(Date.now());
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load processing results",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const inputFile = result?.input_filename || "No input file";
  const outputFile = result?.output_filename || null;
  const inputResolution = result?.input_resolution || "10m";
  const targetResolution = result?.target_resolution || "≤4m";

  const outputUrl = outputFile
    ? withSession(
        `${API_URL}/api/processing/output/${encodeURIComponent(outputFile)}`,
      )
    : "";

  const previewUrl = (name: string) =>
    `${withSession(
      `${API_URL}/api/processing/preview/${encodeURIComponent(name)}`,
    )}&v=${version}`;

  const inputPreviewUrl =
    result?.input_filename && version
      ? previewUrl(result.input_filename)
      : "";
  const outputPreviewUrl = outputFile && version ? previewUrl(outputFile) : "";

  const handleDownload = () => {
    if (!outputUrl) return;
    window.open(outputUrl, "_blank");
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
              RESULTS
            </span>
            <span className="text-xs text-text-muted">SIH 26142</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary">
            Enhanced Satellite Image
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-text-secondary">
            Review the processed satellite imagery and prepare it for validation
            and downstream analysis.
          </p>
        </div>
        <button
          onClick={loadResults}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Loading..." : "Refresh Results"}
        </button>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">Backend connection error</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Upload}
          title="Input Resolution"
          value={inputResolution}
          subtitle="Sentinel-2 source"
        />
        <SummaryCard
          icon={Sparkles}
          title="Target Resolution"
          value={targetResolution}
          subtitle="Super-resolution target"
        />
        <SummaryCard
          icon={ShieldCheck}
          title="Processing Status"
          value={result?.status || "idle"}
          subtitle={result?.stage || "Waiting for processing"}
        />
        <SummaryCard
          icon={CheckCircle2}
          title="Output"
          value={outputFile ? "Available" : "Pending"}
          subtitle={outputFile ? "Processed file ready" : "Waiting for AI model"}
        />
      </section>

      {/* Processing Information */}
      <section className="rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <FileImage className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-text-primary">
              Processing Information
            </h2>
            <p className="text-xs text-text-muted">Current project files</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border-subtle bg-bg-surface-secondary p-4">
            <p className="text-xs font-medium text-text-muted">Input File</p>
            <p className="mt-2 break-all text-sm font-semibold text-text-primary">
              {inputFile}
            </p>
          </div>
          <div className="rounded-xl border border-border-subtle bg-bg-surface-secondary p-4">
            <p className="text-xs font-medium text-text-muted">
              Enhanced Output
            </p>
            <p className="mt-2 break-all text-sm font-semibold text-text-primary">
              {outputFile || "Waiting for AI output"}
            </p>
          </div>
        </div>
      </section>

      {/* Image Comparison */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Image comparison
            </h2>
            <p className="text-xs text-text-muted">
              Compare the original with the AI enhanced image
            </p>
          </div>
          <div className="inline-flex rounded-xl border border-border-subtle bg-bg-surface-secondary p-1">
            <button
              onClick={() => setView("slider")}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
                view === "slider"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Slider
            </button>
            <button
              onClick={() => setView("side")}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
                view === "side"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Side by side
            </button>
          </div>
        </div>

        {view === "slider" ? (
          <section className="rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-sm">
            {inputPreviewUrl && outputPreviewUrl ? (
              <>
                <BeforeAfterSlider
                  key={`${inputPreviewUrl}|${outputPreviewUrl}`}
                  beforeUrl={inputPreviewUrl}
                  afterUrl={outputPreviewUrl}
                  beforeSize={result?.input_size}
                  afterSize={result?.output_size}
                />
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="break-all text-xs text-text-muted">
                    {inputFile} → {outputFile}
                  </p>
                  <div className="flex items-center gap-4">
                    <FullSizeLink url={outputPreviewUrl} />
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      <Download className="h-4 w-4" /> Download GeoTIFF
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <EmptyPreview
                icon={Sparkles}
                title="Waiting for AI output"
                text="The before / after slider appears here after Super Resolution finishes."
              />
            )}
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-2">
        {/* Original */}
        <ImagePanel
          title="Original Sentinel-2"
          subtitle="10 m input imagery"
          icon={Upload}
        >
          {inputPreviewUrl ? (
            <>
              <ImagePreview
                key={inputPreviewUrl}
                url={inputPreviewUrl}
                alt="Original Sentinel-2 input"
              />
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="break-all text-xs text-text-muted">{inputFile}</p>
                <FullSizeLink url={inputPreviewUrl} />
              </div>
            </>
          ) : (
            <EmptyPreview
              icon={FileImage}
              title="No input image yet"
              text="Upload and preprocess a Sentinel-2 image to see it here."
            />
          )}
        </ImagePanel>

        {/* Enhanced */}
        <ImagePanel
          title="AI Super-Resolved"
          subtitle="Target output up to 4 m"
          icon={Sparkles}
        >
          {outputPreviewUrl ? (
            <>
              <ImagePreview
                key={outputPreviewUrl}
                url={outputPreviewUrl}
                alt="AI super-resolved output"
              />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <p className="break-all text-xs text-text-muted">
                    {outputFile}
                  </p>
                  <FullSizeLink url={outputPreviewUrl} />
                </div>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  <Download className="h-4 w-4" /> Download GeoTIFF
                </button>
              </div>
            </>
          ) : (
            <EmptyPreview
              icon={Sparkles}
              title="Waiting for AI output"
              text="The enhanced image will appear here after Super Resolution finishes."
            />
          )}
        </ImagePanel>
      </section>
        )}
      </div>

      {/* Actions */}
      <section className="rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
            <ShieldCheck className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="font-semibold text-text-primary">Next Steps</h2>
            <p className="text-xs text-text-muted">Continue with validation</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/validation/confidence")}
            disabled={!outputFile}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShieldCheck className="h-4 w-4" /> Run Validation
          </button>
          <button
            onClick={handleDownload}
            disabled={!outputFile}
            className="flex items-center gap-2 rounded-xl border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-4 w-4" /> Download Output
          </button>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------- Image Preview
   Shows a picture made by the backend. While it loads a spinner is shown,
   and if it cannot be loaded a short explanation is shown instead.
-------------------------------------------------- */
function ImagePreview({ url, alt }: { url: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <EmptyPreview
        icon={ImageOff}
        title="Preview not available"
        text="The server may have restarted and removed the file. Run Super Resolution again, then press Refresh Results."
      />
    );
  }

  return (
    <div className="relative flex h-[360px] items-center justify-center overflow-hidden rounded-xl border border-border-subtle bg-bg-surface-secondary">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-text-muted">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-xs">Preparing preview...</p>
        </div>
      )}
      <img
        src={url}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`h-full w-full object-contain transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

function FullSizeLink({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
    >
      <ExternalLink className="h-3.5 w-3.5" /> Open full size
    </a>
  );
}

function EmptyPreview({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="flex h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle bg-bg-surface-secondary px-6">
      <Icon className="h-12 w-12 text-slate-300" />
      <p className="mt-4 text-sm font-semibold text-text-secondary">{title}</p>
      <p className="mt-1 max-w-sm text-center text-xs text-text-muted">
        {text}
      </p>
    </div>
  );
}

/* -------------------------------------------------- Summary Card
-------------------------------------------------- */
function SummaryCard({
  icon: Icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <h3 className="mt-2 break-all text-2xl font-bold tracking-tight text-text-primary">
            {value}
          </h3>
          <p className="mt-1 text-xs text-text-muted">{subtitle}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------- Image Panel
-------------------------------------------------- */
function ImagePanel({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="font-semibold text-text-primary">{title}</h2>
          <p className="text-xs text-text-muted">{subtitle}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
