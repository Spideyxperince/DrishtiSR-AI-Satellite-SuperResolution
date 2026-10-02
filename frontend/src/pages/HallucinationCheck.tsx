import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Eye, RefreshCw, ShieldAlert } from "lucide-react";
import { getHallucinationCheck } from "../services/api";
export default function HallucinationCheck() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Checking...");
  const [message, setMessage] = useState("");
  const loadHallucinationCheck = async () => {
    try {
      setLoading(true);
      const result = await getHallucinationCheck();
      setStatus(result.status || "Ready");
      setMessage(result.message || "");
    } catch (error) {
      setStatus("Unavailable");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load hallucination analysis",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadHallucinationCheck();
  }, []);
  return (
    <div className="space-y-6">
      {" "}
      {/* Header */}{" "}
      <div>
        {" "}
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-orange-600">
          {" "}
          <ShieldAlert className="h-4 w-4" /> AI SAFETY CHECK{" "}
        </div>{" "}
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          {" "}
          Hallucination Check{" "}
        </h1>{" "}
        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
          {" "}
          Identify suspicious details introduced by the super-resolution model
          that may not exist in the original imagery.{" "}
        </p>{" "}
        <button
          onClick={loadHallucinationCheck}
          disabled={loading}
          className="mt-4 flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {" "}
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />{" "}
          {loading ? "Checking..." : "Refresh Analysis"}{" "}
        </button>{" "}
      </div>{" "}
      {/* API Status */}{" "}
      {!loading && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${status === "Unavailable" ? "border-red-200 bg-red-50 text-red-700" : "border-orange-200 bg-orange-50 text-orange-700"}`}
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
            Suspicious Regions{" "}
          </p>{" "}
          <p className="mt-2 text-3xl font-semibold text-text-primary">
            {" "}
            --{" "}
          </p>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Awaiting AI analysis{" "}
          </p>{" "}
        </div>{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-sm">
          {" "}
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            {" "}
            Risk Level{" "}
          </p>{" "}
          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {" "}
            Pending{" "}
          </p>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Model assessment{" "}
          </p>{" "}
        </div>{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-sm">
          {" "}
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            {" "}
            Trust Status{" "}
          </p>{" "}
          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {" "}
            Pending{" "}
          </p>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Validation required{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {/* Suspicious Detail Map */}{" "}
      <div className="rounded-2xl border border-border-subtle bg-bg-surface shadow-sm">
        {" "}
        <div className="border-b border-border-subtle px-5 py-4">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <Eye className="h-5 w-5 text-text-secondary" />{" "}
            <div>
              {" "}
              <h2 className="font-semibold text-text-primary">
                {" "}
                Suspicious Detail Map{" "}
              </h2>{" "}
              <p className="text-sm text-text-secondary">
                {" "}
                Potential hallucinated regions will be highlighted here.{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="flex aspect-video items-center justify-center bg-bg-surface-secondary">
          {" "}
          <div className="text-center">
            {" "}
            <ShieldAlert className="mx-auto h-12 w-12 text-slate-300" />{" "}
            <p className="mt-3 font-medium text-text-secondary">
              {" "}
              Hallucination analysis pending{" "}
            </p>{" "}
            <p className="mt-1 text-sm text-text-muted">
              {" "}
              AI validation output will appear here{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Why this matters */}{" "}
      <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50 p-5">
        {" "}
        <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-600" />{" "}
        <div>
          {" "}
          <p className="font-medium text-orange-900"> Why this matters </p>{" "}
          <p className="mt-1 text-sm leading-6 text-orange-700">
            {" "}
            Super-resolution models can create visually plausible details that
            are not supported by the original satellite observation. Suspicious
            regions should therefore be reviewed before decision-making.{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {/* Next Analysis */}{" "}
      <div className="flex flex-wrap justify-end gap-3">
        {" "}
        <button
          onClick={() => navigate("/analysis/crop")}
          className="rounded-lg border border-border-subtle bg-bg-surface px-5 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-bg-surface-secondary"
        >
          {" "}
          Crop Analysis{" "}
        </button>{" "}
        <button
          onClick={() => navigate("/analysis/urban")}
          className="rounded-lg border border-border-subtle bg-bg-surface px-5 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-bg-surface-secondary"
        >
          {" "}
          Urban Analysis{" "}
        </button>{" "}
        <button
          onClick={() => navigate("/analysis/disaster")}
          className="rounded-lg bg-bg-surface px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {" "}
          Disaster Analysis →{" "}
        </button>{" "}
      </div>{" "}
      {/* Integration Note */}{" "}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
        {" "}
        <p className="text-sm font-medium text-blue-900">
          {" "}
          Hallucination Detection Integration Point{" "}
        </p>{" "}
        <p className="mt-1 text-sm leading-6 text-blue-700">
          {" "}
          The frontend is connected to the hallucination detection API. Once the
          AI module provides suspicious regions, risk level, trust status, and
          detection maps, these results can be displayed here
          automatically.{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
