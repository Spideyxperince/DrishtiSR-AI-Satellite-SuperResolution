import { useEffect, useRef, useState } from "react";
import { Brain, CheckCircle, Loader2, Satellite, Sparkles } from "lucide-react";
import {
  getProcessingStatus,
  startSuperResolution,
  wakeBackend,
} from "../services/api";
import { getProcessedFile } from "../services/projectState";
import FluidProgressBar from "../components/FluidProgressBar";

export default function SuperResolution() {
  const [filename, setFilename] = useState(getProcessedFile() || "");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const pollRef = useRef<number | null>(null);

  const stopPolling = () => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  // Stop asking the server for progress if the user leaves this page
  useEffect(() => {
    return () => {
      if (pollRef.current !== null) {
        window.clearInterval(pollRef.current);
      }
    };
  }, []);

  // Ask the server how far along it is, once per second
  const startPolling = () => {
    stopPolling();
    pollRef.current = window.setInterval(async () => {
      try {
        const status = await getProcessingStatus();
        // Ignore old "completed" results from a previous run
        if (status.status === "running") {
          if (typeof status.progress === "number") {
            setProgress((previous) => Math.max(previous, status.progress));
          }
          if (status.stage) {
            setStage(status.stage);
          }
        }
      } catch {
        // The main request reports real errors, so ignore a missed update
      }
    }, 1000);
  };

  const handleProcessing = async () => {
    const currentFile = getProcessedFile();
    if (!currentFile) {
      setError("Please upload a satellite image first.");
      return;
    }
    try {
      setProcessing(true);
      setSuccess(false);
      setError("");
      setMessage("");
      setProgress(0);
      setStage("Waking up the server");
      setFilename(currentFile);

      const awake = await wakeBackend();
      if (!awake) {
        throw new Error(
          "The server did not wake up in time. Please try again in a minute.",
        );
      }

      setStage("Starting");
      startPolling();

      const result = await startSuperResolution(currentFile);

      setProgress(100);
      setStage("Completed");
      setMessage(result.message);
      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Super Resolution processing failed",
      );
    } finally {
      stopPolling();
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
          <Sparkles className="h-4 w-4" /> AI PROCESSING
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          AI Super Resolution
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
          Transform 10m Sentinel-2 imagery into enhanced products with a target
          resolution of up to 4m.
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bg-surface-secondary">
            <Brain className="h-5 w-5 text-text-secondary" />
          </div>
          <div>
            <h2 className="font-semibold text-text-primary">
              Start AI Processing
            </h2>
            <p className="text-sm text-text-secondary">
              Select a preprocessed Sentinel-2 image.
            </p>
          </div>
        </div>

        {/* Input */}
        <label className="mb-2 block text-sm font-medium text-text-secondary">
          Processed Image
        </label>
        <input
          type="text"
          value={filename}
          onChange={(e) => {
            setFilename(e.target.value);
            setSuccess(false);
            setError("");
          }}
          placeholder="example_processed.tif"
          className="w-full rounded-lg border border-border-subtle px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
        />

        {/* Resolution Flow */}
        <div className="my-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border-subtle p-5">
            <Satellite className="mb-3 h-5 w-5 text-text-secondary" />
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Input
            </p>
            <p className="mt-1 text-xl font-semibold text-text-primary">10m</p>
            <p className="mt-1 text-sm text-text-secondary">Sentinel-2</p>
          </div>
          <div className="rounded-xl border border-border-subtle p-5">
            <Brain className="mb-3 h-5 w-5 text-text-secondary" />
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Processing
            </p>
            <p className="mt-1 text-xl font-semibold text-text-primary">
              AI Model
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Model integration point
            </p>
          </div>
          <div className="rounded-xl border border-border-subtle p-5">
            <Sparkles className="mb-3 h-5 w-5 text-text-secondary" />
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Target
            </p>
            <p className="mt-1 text-xl font-semibold text-text-primary">≤4m</p>
            <p className="mt-1 text-sm text-text-secondary">
              Enhanced product
            </p>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleProcessing}
          disabled={processing}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-bg-surface px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Processing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Start Super Resolution
            </>
          )}
        </button>

        {/* Progress */}
        {(processing || success) && (
          <div className="mt-6 rounded-xl border border-border-subtle p-5">
            <p className="mb-3 text-sm font-medium text-text-secondary">
              {stage || "Starting"}
            </p>
            <FluidProgressBar progress={progress} />
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mt-4 flex items-start gap-3 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">Super Resolution completed</p>
              <p className="mt-1">{message}</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Integration Note */}
      
    </div>
  );
}
