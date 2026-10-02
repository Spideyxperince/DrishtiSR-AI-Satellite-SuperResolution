import { useState } from "react";
import { Leaf, Activity, Sprout, Map, RefreshCw } from "lucide-react";
import { getCropAnalysis } from "../services/api";
export default function CropAnalysis() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const handleRunAnalysis = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getCropAnalysis();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load crop analysis",
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
          <div className="flex items-center gap-2 text-green-600 mb-2">
            {" "}
            <Leaf size={18} />{" "}
            <span className="text-sm font-medium">
              {" "}
              Downstream Analysis{" "}
            </span>{" "}
          </div>{" "}
          <h1 className="text-2xl font-bold text-text-primary">
            {" "}
            Crop Analysis{" "}
          </h1>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Analyze vegetation health and crop conditions using the enhanced
            satellite imagery.{" "}
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
      {/* Status */}{" "}
      {data && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {" "}
          Backend response received successfully.{" "}
        </div>
      )}{" "}
      {/* Stats */}{" "}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <p className="text-sm text-text-secondary">
                {" "}
                Vegetation Health{" "}
              </p>{" "}
              <p className="mt-2 text-2xl font-bold text-text-primary">
                {" "}
                --{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              {" "}
              <Activity size={22} />{" "}
            </div>{" "}
          </div>{" "}
          <p className="mt-3 text-xs text-text-muted">
            {" "}
            Will be provided by AI/GIS module{" "}
          </p>{" "}
        </div>{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <p className="text-sm text-text-secondary"> NDVI Score </p>{" "}
              <p className="mt-2 text-2xl font-bold text-text-primary">
                {" "}
                --{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              {" "}
              <Sprout size={22} />{" "}
            </div>{" "}
          </div>{" "}
          <p className="mt-3 text-xs text-text-muted">
            {" "}
            Normalized Difference Vegetation Index{" "}
          </p>{" "}
        </div>{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <p className="text-sm text-text-secondary">
                {" "}
                Vegetation Area{" "}
              </p>{" "}
              <p className="mt-2 text-2xl font-bold text-text-primary">
                {" "}
                --{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-lg bg-lime-50 p-3 text-lime-600">
              {" "}
              <Map size={22} />{" "}
            </div>{" "}
          </div>{" "}
          <p className="mt-3 text-xs text-text-muted">
            {" "}
            Area calculation will be provided later{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {/* NDVI Visualization */}{" "}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
        {" "}
        <div className="mb-5">
          {" "}
          <h2 className="text-lg font-semibold text-text-primary">
            {" "}
            NDVI Vegetation Map{" "}
          </h2>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Vegetation health visualization from the enhanced satellite
            product.{" "}
          </p>{" "}
        </div>{" "}
        <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-border-subtle bg-bg-surface-secondary">
          {" "}
          <div className="text-center">
            {" "}
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              {" "}
              <Leaf size={24} />{" "}
            </div>{" "}
            <p className="font-medium text-text-secondary">
              {" "}
              NDVI Map Placeholder{" "}
            </p>{" "}
            <p className="mt-1 max-w-sm text-sm text-text-muted">
              {" "}
              The actual NDVI raster/map will be displayed here once the AI and
              geospatial modules are integrated.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Analysis Details */}{" "}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
          {" "}
          <h2 className="text-lg font-semibold text-text-primary">
            {" "}
            Crop Health Classification{" "}
          </h2>{" "}
          <div className="mt-5 space-y-3">
            {" "}
            {[
              "Healthy Vegetation",
              "Moderate Vegetation",
              "Stressed Vegetation",
              "Bare / Non-Vegetated",
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
              <span className="text-text-secondary"> Index </span>{" "}
              <span className="font-medium text-text-secondary">
                {" "}
                NDVI{" "}
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
          later connect the NDVI calculation, crop classification model, raster
          processing, and GIS layers without changing the frontend
          structure.{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
