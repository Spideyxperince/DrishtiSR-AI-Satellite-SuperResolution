import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe2, MapPin, RefreshCw } from "lucide-react";
import { getGeographicValidation } from "../services/api";
export default function GeographicCheck() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Checking...");
  const [message, setMessage] = useState("");
  const loadValidation = async () => {
    try {
      setLoading(true);
      const result = await getGeographicValidation();
      setStatus(result.status || "Ready");
      setMessage(result.message || "");
    } catch (error) {
      setStatus("Unavailable");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load geographic validation",
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
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-600">
          {" "}
          <Globe2 className="h-4 w-4" /> VALIDATION{" "}
        </div>{" "}
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          {" "}
          Geographic Fidelity{" "}
        </h1>{" "}
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {" "}
          Verify that enhanced features remain correctly aligned with their
          geographic locations.{" "}
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
          className={`rounded-lg border px-4 py-3 text-sm ${status === "Unavailable" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}
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
            Geographic Fidelity{" "}
          </p>{" "}
          <p className="mt-2 text-3xl font-semibold text-text-primary">
            {" "}
            --{" "}
          </p>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Awaiting GIS validation{" "}
          </p>{" "}
        </div>{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-sm">
          {" "}
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            {" "}
            CRS{" "}
          </p>{" "}
          <p className="mt-2 text-xl font-semibold text-text-primary">
            {" "}
            --{" "}
          </p>{" "}
          <p className="mt-1 text-sm text-text-secondary"> Source CRS </p>{" "}
        </div>{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-sm">
          {" "}
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            {" "}
            Alignment{" "}
          </p>{" "}
          <p className="mt-2 text-xl font-semibold text-text-primary">
            {" "}
            Pending{" "}
          </p>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Spatial verification{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {/* Geographic Alignment */}{" "}
      <div className="rounded-2xl border border-border-subtle bg-bg-surface shadow-sm">
        {" "}
        <div className="border-b border-border-subtle px-5 py-4">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <MapPin className="h-5 w-5 text-text-secondary" />{" "}
            <div>
              {" "}
              <h2 className="font-semibold text-text-primary">
                {" "}
                Geographic Alignment{" "}
              </h2>{" "}
              <p className="text-sm text-text-secondary">
                {" "}
                Spatial comparison will appear here.{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="flex aspect-video items-center justify-center bg-bg-surface-secondary">
          {" "}
          <div className="text-center">
            {" "}
            <Globe2 className="mx-auto h-12 w-12 text-slate-300" />{" "}
            <p className="mt-3 font-medium text-text-secondary">
              {" "}
              GIS validation pending{" "}
            </p>{" "}
            <p className="mt-1 text-sm text-text-muted">
              {" "}
              Waiting for geospatial processing{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Next Validation */}{" "}
      <div className="flex justify-end">
        {" "}
        <button
          onClick={() => navigate("/validation/hallucination")}
          className="rounded-lg bg-bg-surface px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {" "}
          Next: Hallucination Check →{" "}
        </button>{" "}
      </div>{" "}
      {/* Integration Note */}{" "}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
        {" "}
        <p className="text-sm font-medium text-blue-900">
          {" "}
          Geographic Validation Integration Point{" "}
        </p>{" "}
        <p className="mt-1 text-sm leading-6 text-blue-700">
          {" "}
          The frontend is connected to the geographic validation API. Once the
          GIS module provides CRS, spatial alignment, geographic fidelity, and
          coordinate information, these values can be displayed here
          automatically.{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
