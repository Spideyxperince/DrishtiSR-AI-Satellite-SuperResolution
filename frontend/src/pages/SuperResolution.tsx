import { useState } from "react";
import { Brain, CheckCircle, Loader2, Satellite, Sparkles } from "lucide-react";
import { startSuperResolution } from "../services/api";
import { getProcessedFile } from "../services/projectState";
export default function SuperResolution() {
  const [filename, setFilename] = useState(getProcessedFile() || "");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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
      setFilename(currentFile);
      const result = await startSuperResolution(currentFile);
      setMessage(result.message);
      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Super Resolution processing failed",
      );
    } finally {
      setProcessing(false);
    }
  };
  return (
    <div className="space-y-6">
      {" "}
      {/* Header */}{" "}
      <div>
        {" "}
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
          {" "}
          <Sparkles className="h-4 w-4" /> AI PROCESSING{" "}
        </div>{" "}
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          {" "}
          AI Super Resolution{" "}
        </h1>{" "}
        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
          {" "}
          Transform 10m Sentinel-2 imagery into enhanced products with a target
          resolution of up to 4m.{" "}
        </p>{" "}
      </div>{" "}
      {/* Main Card */}{" "}
      <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-sm">
        {" "}
        <div className="mb-6 flex items-center gap-3">
          {" "}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bg-surface-secondary">
            {" "}
            <Brain className="h-5 w-5 text-text-secondary" />{" "}
          </div>{" "}
          <div>
            {" "}
            <h2 className="font-semibold text-text-primary">
              {" "}
              Start AI Processing{" "}
            </h2>{" "}
            <p className="text-sm text-text-secondary">
              {" "}
              Select a preprocessed Sentinel-2 image.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* Input */}{" "}
        <label className="mb-2 block text-sm font-medium text-text-secondary">
          {" "}
          Processed Image{" "}
        </label>{" "}
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
        />{" "}
        {/* Resolution Flow */}{" "}
        <div className="my-6 grid gap-4 md:grid-cols-3">
          {" "}
          <div className="rounded-xl border border-border-subtle p-5">
            {" "}
            <Satellite className="mb-3 h-5 w-5 text-text-secondary" />{" "}
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {" "}
              Input{" "}
            </p>{" "}
            <p className="mt-1 text-xl font-semibold text-text-primary">
              {" "}
              10m{" "}
            </p>{" "}
            <p className="mt-1 text-sm text-text-secondary">
              {" "}
              Sentinel-2{" "}
            </p>{" "}
          </div>{" "}
          <div className="rounded-xl border border-border-subtle p-5">
            {" "}
            <Brain className="mb-3 h-5 w-5 text-text-secondary" />{" "}
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {" "}
              Processing{" "}
            </p>{" "}
            <p className="mt-1 text-xl font-semibold text-text-primary">
              {" "}
              AI Model{" "}
            </p>{" "}
            <p className="mt-1 text-sm text-text-secondary">
              {" "}
              Model integration point{" "}
            </p>{" "}
          </div>{" "}
          <div className="rounded-xl border border-border-subtle p-5">
            {" "}
            <Sparkles className="mb-3 h-5 w-5 text-text-secondary" />{" "}
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {" "}
              Target{" "}
            </p>{" "}
            <p className="mt-1 text-xl font-semibold text-text-primary">
              {" "}
              ≤4m{" "}
            </p>{" "}
            <p className="mt-1 text-sm text-text-secondary">
              {" "}
              Enhanced product{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* Button */}{" "}
        <button
          onClick={handleProcessing}
          disabled={processing}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-bg-surface px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {" "}
          {processing ? (
            <>
              {" "}
              <Loader2 className="h-4 w-4 animate-spin" /> Processing...{" "}
            </>
          ) : (
            <>
              {" "}
              <Sparkles className="h-4 w-4" /> Start Super Resolution{" "}
            </>
          )}{" "}
        </button>{" "}
        {/* Success */}{" "}
        {success && (
          <div className="mt-4 flex items-start gap-3 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {" "}
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />{" "}
            <div>
              {" "}
              <p className="font-medium"> Processing request submitted </p>{" "}
              <p className="mt-1"> {message} </p>{" "}
            </div>{" "}
          </div>
        )}{" "}
        {/* Error */}{" "}
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {" "}
            {error}{" "}
          </div>
        )}{" "}
      </div>{" "}
      {/* Integration Note */}{" "}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
        {" "}
        <p className="text-sm font-medium text-blue-900">
          {" "}
          AI Integration Point{" "}
        </p>{" "}
        <p className="mt-1 text-sm leading-6 text-blue-700">
          {" "}
          The backend endpoint is currently a placeholder. Your AI teammate can
          later connect the trained Super Resolution model here without changing
          this frontend page.{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
