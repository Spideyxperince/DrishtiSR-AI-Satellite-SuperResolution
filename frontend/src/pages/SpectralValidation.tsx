import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Radio, RefreshCw } from "lucide-react";
import { getSpectralValidation } from "../services/api";
export default function SpectralValidation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Checking...");
  const [message, setMessage] = useState("");
  const loadValidation = async () => {
    try {
      setLoading(true);
      const result = await getSpectralValidation();
      setStatus(result.status || "Ready");
      setMessage(result.message || "");
    } catch (error) {
      setStatus("Unavailable");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load spectral validation",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadValidation();
  }, []);
  return (
    <div className="space-y-6">
      {" "}
      {/* Header */}{" "}
      <div>
        {" "}
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-purple-600">
          {" "}
          <Radio className="h-4 w-4" /> VALIDATION{" "}
        </div>{" "}
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          {" "}
          Spectral Validation{" "}
        </h1>{" "}
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {" "}
          Check whether the AI-enhanced imagery preserves the spectral
          characteristics of the source imagery.{" "}
        </p>{" "}
        <button
          onClick={loadValidation}
          disabled={loading}
          className="mt-4 flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {" "}
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />{" "}
          {loading ? "Checking..." : "Refresh Validation"}{" "}
        </button>{" "}
      </div>{" "}
      {/* API Status */}{" "}
      {!loading && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${status === "Unavailable" ? "border-red-200 bg-red-50 text-red-700" : "border-purple-200 bg-purple-50 text-purple-700"}`}
        >
          {" "}
          <p className="font-medium"> Status: {status} </p>{" "}
          {message && <p className="mt-1"> {message} </p>}{" "}
        </div>
      )}{" "}
      {/* Metrics */}{" "}
      <div className="grid gap-4 md:grid-cols-3">
        {" "}
        {[
          ["Spectral Fidelity", "--"],
          ["SAM Score", "--"],
          ["RMSE", "--"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-sm"
          >
            {" "}
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {" "}
              {label}{" "}
            </p>{" "}
            <p className="mt-2 text-3xl font-semibold text-text-primary">
              {" "}
              {value}{" "}
            </p>{" "}
            <p className="mt-1 text-sm text-text-secondary">
              {" "}
              Awaiting validation{" "}
            </p>{" "}
          </div>
        ))}{" "}
      </div>{" "}
      {/* Spectral Comparison */}{" "}
      <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-sm">
        {" "}
        <div className="flex items-center gap-3">
          {" "}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-surface-secondary">
            {" "}
            <Activity className="h-5 w-5 text-text-secondary" />{" "}
          </div>{" "}
          <div>
            {" "}
            <h2 className="font-semibold text-text-primary">
              {" "}
              Spectral Comparison{" "}
            </h2>{" "}
            <p className="text-sm text-text-secondary">
              {" "}
              Band-wise comparison will appear here.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        <div className="mt-6 space-y-3">
          {" "}
          {["B02 · Blue", "B03 · Green", "B04 · Red", "B08 · NIR"].map(
            (band) => (
              <div
                key={band}
                className="flex items-center justify-between rounded-lg bg-bg-surface-secondary px-4 py-3"
              >
                {" "}
                <span className="text-sm font-medium text-text-secondary">
                  {" "}
                  {band}{" "}
                </span>{" "}
                <span className="text-sm text-text-muted"> Pending </span>{" "}
              </div>
            ),
          )}{" "}
        </div>{" "}
      </div>{" "}
      {/* Next Validation */}{" "}
      <div className="flex justify-end">
        {" "}
        <button
          onClick={() => navigate("/validation/geographic")}
          className="rounded-lg bg-bg-surface px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {" "}
          Next: Geographic Check →{" "}
        </button>{" "}
      </div>{" "}
      {/* Integration Note */}{" "}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
        {" "}
        <p className="text-sm font-medium text-blue-900">
          {" "}
          Spectral Validation Integration Point{" "}
        </p>{" "}
        <p className="mt-1 text-sm leading-6 text-blue-700">
          {" "}
          The frontend is connected to the spectral validation API. Once the
          validation module provides spectral fidelity, SAM, RMSE, and
          band-level results, they can be displayed here automatically.{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
