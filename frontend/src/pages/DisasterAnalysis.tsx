import { useState } from "react";
import { AlertTriangle, Activity, Map, RefreshCw } from "lucide-react";
import { getDisasterAnalysis } from "../services/api";
export default function DisasterAnalysis() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const handleRunAnalysis = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getDisasterAnalysis();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load disaster analysis",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {" "}
      {/* Header */}{" "}
      <div className="flex items-start justify-between">
        {" "}
        <div>
          {" "}
          <div className="mb-2 flex items-center gap-2 text-red-600">
            {" "}
            <AlertTriangle size={18} />{" "}
            <span className="text-sm font-medium">
              {" "}
              Downstream Analysis{" "}
            </span>{" "}
          </div>{" "}
          <h1 className="text-2xl font-bold text-text-primary">
            {" "}
            Disaster Analysis{" "}
          </h1>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Detect affected areas and analyze disaster-related changes using
            enhanced satellite imagery.{" "}
          </p>{" "}
        </div>{" "}
        <button
          onClick={handleRunAnalysis}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-bg-surface px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {" "}
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
          {loading ? "Running..." : "Run Analysis"}{" "}
        </button>{" "}
      </div>{" "}
      {/* Error */}{" "}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {" "}
          {error}{" "}
        </div>
      )}{" "}
      {/* Success */}{" "}
      {data && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {" "}
          Backend response received successfully.{" "}
        </div>
      )}{" "}
      {/* Statistics */}{" "}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {" "}
        {/* Affected Area */}{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <p className="text-sm text-text-secondary">
                {" "}
                Affected Area{" "}
              </p>{" "}
              <p className="mt-2 text-2xl font-bold text-text-primary">
                {" "}
                --{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-lg bg-red-50 p-3 text-red-600">
              {" "}
              <AlertTriangle size={22} />{" "}
            </div>{" "}
          </div>{" "}
          <p className="mt-3 text-xs text-text-muted">
            {" "}
            Area calculation will be provided by GIS module{" "}
          </p>{" "}
        </div>{" "}
        {/* Change Score */}{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <p className="text-sm text-text-secondary"> Change Score </p>{" "}
              <p className="mt-2 text-2xl font-bold text-text-primary">
                {" "}
                --{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
              {" "}
              <Activity size={22} />{" "}
            </div>{" "}
          </div>{" "}
          <p className="mt-3 text-xs text-text-muted">
            {" "}
            Change detection will be calculated later{" "}
          </p>{" "}
        </div>{" "}
        {/* Detection Status */}{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <p className="text-sm text-text-secondary">
                {" "}
                Detection Status{" "}
              </p>{" "}
              <p className="mt-2 text-2xl font-bold text-text-primary">
                {" "}
                --{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
              {" "}
              <Map size={22} />{" "}
            </div>{" "}
          </div>{" "}
          <p className="mt-3 text-xs text-text-muted">
            {" "}
            Final status will come from the analysis module{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {/* Disaster Map */}{" "}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
        {" "}
        <div className="mb-5">
          {" "}
          <h2 className="text-lg font-semibold text-text-primary">
            {" "}
            Affected Area Map{" "}
          </h2>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Spatial visualization of detected disaster-affected regions.{" "}
          </p>{" "}
        </div>{" "}
        <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-border-subtle bg-bg-surface-secondary">
          {" "}
          <div className="text-center">
            {" "}
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              {" "}
              <AlertTriangle size={24} />{" "}
            </div>{" "}
            <p className="font-medium text-text-secondary">
              {" "}
              Disaster Map Placeholder{" "}
            </p>{" "}
            <p className="mt-1 max-w-sm text-sm text-text-muted">
              {" "}
              The actual affected-area raster and GIS layers will be displayed
              here after the AI and geospatial modules are integrated.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Disaster Categories + Information */}{" "}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {" "}
        {/* Categories */}{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
          {" "}
          <h2 className="text-lg font-semibold text-text-primary">
            {" "}
            Disaster Categories{" "}
          </h2>{" "}
          <div className="mt-5 space-y-3">
            {" "}
            {[
              "Flood-Affected Area",
              "Fire-Affected Area",
              "Storm / Cyclone Damage",
              "Landslide-Affected Area",
              "Other Changes",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-lg bg-bg-surface-secondary px-4 py-3"
              >
                {" "}
                <span className="text-sm text-text-secondary">
                  {" "}
                  {item}{" "}
                </span>{" "}
                <span className="text-sm font-medium text-text-muted">
                  {" "}
                  --{" "}
                </span>{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
        {/* Analysis Information */}{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
          {" "}
          <h2 className="text-lg font-semibold text-text-primary">
            {" "}
            Analysis Information{" "}
          </h2>{" "}
          <div className="mt-5 space-y-4 text-sm">
            {" "}
            <div className="flex justify-between border-b border-slate-100 pb-3">
              {" "}
              <span className="text-text-secondary">
                {" "}
                Input Resolution{" "}
              </span>{" "}
              <span className="font-medium text-text-secondary">
                {" "}
                10m{" "}
              </span>{" "}
            </div>{" "}
            <div className="flex justify-between border-b border-slate-100 pb-3">
              {" "}
              <span className="text-text-secondary">
                {" "}
                Enhanced Resolution{" "}
              </span>{" "}
              <span className="font-medium text-text-secondary">
                {" "}
                ≤4m{" "}
              </span>{" "}
            </div>{" "}
            <div className="flex justify-between border-b border-slate-100 pb-3">
              {" "}
              <span className="text-text-secondary">
                {" "}
                Analysis Method{" "}
              </span>{" "}
              <span className="font-medium text-text-secondary">
                {" "}
                Change Detection{" "}
              </span>{" "}
            </div>{" "}
            <div className="flex justify-between">
              {" "}
              <span className="text-text-secondary">
                {" "}
                Analysis Status{" "}
              </span>{" "}
              <span className="font-medium text-amber-600">
                {" "}
                Pending Integration{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Integration Note */}{" "}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        {" "}
        <h3 className="font-semibold text-blue-900">
          {" "}
          AI / GIS Integration Ready{" "}
        </h3>{" "}
        <p className="mt-1 text-sm leading-6 text-blue-700">
          {" "}
          This page is already connected to the backend API. Your teammates can
          later integrate disaster detection, change detection, affected-area
          calculation, raster comparison, and GIS visualization without changing
          the frontend structure.{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
