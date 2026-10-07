import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Map as MapIcon,
  ShieldCheck,
  RefreshCw,
  FileImage,
} from "lucide-react";
import { getConfidence } from "../services/api";
import { getProcessedFile } from "../services/projectState";
export default function Confidence() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Checking...");
  const [message, setMessage] = useState("");
  const [processedFile, setProcessedFile] = useState(getProcessedFile() || "");
  const loadConfidence = async () => {
    try {
      setLoading(true);
      setMessage("");
      const currentFile = getProcessedFile();
      setProcessedFile(currentFile || "");
      const result = await getConfidence();
      setStatus(result.status || "Ready");
      setMessage(result.message || "");
    } catch (error) {
      setStatus("Unavailable");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load confidence data",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadConfidence();
  }, []);
  return (
    <div className="space-y-6">
      {" "}
      {/* Header */}{" "}
      <div>
        {" "}
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
          {" "}
          <ShieldCheck className="h-4 w-4" /> VALIDATION{" "}
        </div>{" "}
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          {" "}
          Confidence Map{" "}
        </h1>{" "}
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {" "}
          Visualize the model's confidence across the enhanced satellite
          image.{" "}
        </p>{" "}
        <button
          onClick={loadConfidence}
          disabled={loading}
          className="mt-4 flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {" "}
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />{" "}
          {loading ? "Checking..." : "Refresh Confidence"}{" "}
        </button>{" "}
      </div>{" "}
      {/* Processed File */}{" "}
      {processedFile && (
        <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-surface p-4 shadow-sm">
          {" "}
          <div className="rounded-lg bg-blue-50 p-2">
            {" "}
            <FileImage className="h-5 w-5 text-blue-600" />{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {" "}
              Validation Input{" "}
            </p>{" "}
            <p className="mt-1 text-sm font-medium text-text-primary">
              {" "}
              {processedFile}{" "}
            </p>{" "}
          </div>{" "}
        </div>
      )}{" "}
      {/* API Status */}{" "}
      {!loading && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${status === "Unavailable" ? "border-red-200 bg-red-50 text-red-700" : "border-blue-200 bg-blue-50 text-blue-700"}`}
        >
          {" "}
          <p className="font-medium"> Status: {status} </p>{" "}
          {message && <p className="mt-1"> {message} </p>}{" "}
        </div>
      )}{" "}
      {/* Statistics */}{" "}
      <div className="grid gap-4 md:grid-cols-3">
        {" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-sm">
          {" "}
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            {" "}
            Overall Confidence{" "}
          </p>{" "}
          <p className="mt-2 text-3xl font-semibold text-text-primary">
            {" "}
            --{" "}
          </p>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Awaiting AI output{" "}
          </p>{" "}
        </div>{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-sm">
          {" "}
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            {" "}
            High Confidence Area{" "}
          </p>{" "}
          <p className="mt-2 text-3xl font-semibold text-text-primary">
            {" "}
            --{" "}
          </p>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Percentage of image{" "}
          </p>{" "}
        </div>{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-sm">
          {" "}
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            {" "}
            Uncertain Area{" "}
          </p>{" "}
          <p className="mt-2 text-3xl font-semibold text-text-primary">
            {" "}
            --{" "}
          </p>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Requires inspection{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {/* Confidence Visualization */}{" "}
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface shadow-sm">
        {" "}
        <div className="flex items-center gap-3 border-b border-border-subtle px-5 py-4">
          {" "}
          <MapIcon className="h-5 w-5 text-text-secondary" />{" "}
          <div>
            {" "}
            <h2 className="font-semibold text-text-primary">
              {" "}
              Confidence Visualization{" "}
            </h2>{" "}
            <p className="text-sm text-text-secondary">
              {" "}
              Confidence and uncertainty will be displayed here.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        <div className="flex aspect-video items-center justify-center bg-bg-surface-secondary">
          {" "}
          <div className="text-center">
            {" "}
            <ShieldCheck className="mx-auto h-12 w-12 text-slate-300" />{" "}
            <p className="mt-3 font-medium text-text-secondary">
              {" "}
              Confidence map unavailable{" "}
            </p>{" "}
            <p className="mt-1 text-sm text-text-muted">
              {" "}
              Waiting for AI model output{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Uncertainty Warning */}{" "}
      <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-5">
        {" "}
        <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />{" "}
        <div>
          {" "}
          <p className="font-medium text-amber-900">
            {" "}
            Uncertainty awareness{" "}
          </p>{" "}
          <p className="mt-1 text-sm leading-6 text-amber-700">
            {" "}
            Low-confidence regions should be reviewed before using the enhanced
            imagery for critical analysis.{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {/* Next Validation */}{" "}
      <div className="flex justify-end">
        {" "}
        <button
          onClick={() => navigate("/validation/spectral")}
          className="rounded-lg bg-bg-surface px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {" "}
          Next: Spectral Validation →{" "}
        </button>{" "}
      </div>{" "}
      {/* Integration Note */}{" "}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
        {" "}
        <p className="text-sm font-medium text-blue-900">
          {" "}
          Validation Integration Point{" "}
        </p>{" "}
        <p className="mt-1 text-sm leading-6 text-blue-700">
          {" "}
          The frontend is connected to the confidence validation API and tracks
          the current processed GeoTIFF. The AI module can later provide
          pixel-level confidence, uncertainty, and confidence-map output without
          changing the page structure.{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
