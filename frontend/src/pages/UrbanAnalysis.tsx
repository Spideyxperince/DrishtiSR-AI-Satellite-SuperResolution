import { useState } from "react";
import { Building2, Activity, Map, RefreshCw } from "lucide-react";
import { getUrbanAnalysis } from "../services/api";
export default function UrbanAnalysis() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const handleRunAnalysis = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getUrbanAnalysis();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load urban analysis",
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
          <div className="mb-2 flex items-center gap-2 text-orange-600">
            {" "}
            <Building2 size={18} />{" "}
            <span className="text-sm font-medium">
              {" "}
              Downstream Analysis{" "}
            </span>{" "}
          </div>{" "}
          <h1 className="text-2xl font-bold text-text-primary">
            {" "}
            Urban Analysis{" "}
          </h1>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Analyze built-up areas, urban growth, and land-use patterns using
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
        {/* Built-up Area */}{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <p className="text-sm text-text-secondary">
                {" "}
                Built-up Area{" "}
              </p>{" "}
              <p className="mt-2 text-2xl font-bold text-text-primary">
                {" "}
                --{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
              {" "}
              <Building2 size={22} />{" "}
            </div>{" "}
          </div>{" "}
          <p className="mt-3 text-xs text-text-muted">
            {" "}
            Area calculation will be provided by GIS module{" "}
          </p>{" "}
        </div>{" "}
        {/* NDBI */}{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <p className="text-sm text-text-secondary"> NDBI Score </p>{" "}
              <p className="mt-2 text-2xl font-bold text-text-primary">
                {" "}
                --{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
              {" "}
              <Activity size={22} />{" "}
            </div>{" "}
          </div>{" "}
          <p className="mt-3 text-xs text-text-muted">
            {" "}
            Normalized Difference Built-up Index{" "}
          </p>{" "}
        </div>{" "}
        {/* Urban Coverage */}{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <p className="text-sm text-text-secondary">
                {" "}
                Urban Coverage{" "}
              </p>{" "}
              <p className="mt-2 text-2xl font-bold text-text-primary">
                {" "}
                --{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              {" "}
              <Map size={22} />{" "}
            </div>{" "}
          </div>{" "}
          <p className="mt-3 text-xs text-text-muted">
            {" "}
            Built-up percentage will be calculated later{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {/* NDBI Map */}{" "}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
        {" "}
        <div className="mb-5">
          {" "}
          <h2 className="text-lg font-semibold text-text-primary">
            {" "}
            NDBI Urban Map{" "}
          </h2>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Built-up area visualization from the enhanced satellite
            product.{" "}
          </p>{" "}
        </div>{" "}
        <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-border-subtle bg-bg-surface-secondary">
          {" "}
          <div className="text-center">
            {" "}
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              {" "}
              <Building2 size={24} />{" "}
            </div>{" "}
            <p className="font-medium text-text-secondary">
              {" "}
              NDBI Map Placeholder{" "}
            </p>{" "}
            <p className="mt-1 max-w-sm text-sm text-text-muted">
              {" "}
              The actual NDBI raster/map will be displayed here once the AI and
              geospatial modules are integrated.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Land Classification + Information */}{" "}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {" "}
        {/* Classification */}{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
          {" "}
          <h2 className="text-lg font-semibold text-text-primary">
            {" "}
            Land Classification{" "}
          </h2>{" "}
          <div className="mt-5 space-y-3">
            {" "}
            {[
              "Dense Built-up Area",
              "Low Density Built-up Area",
              "Vegetation",
              "Water",
              "Bare Land",
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
              <span className="text-text-secondary"> Index </span>{" "}
              <span className="font-medium text-text-secondary">
                {" "}
                NDBI{" "}
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
          later integrate NDBI calculation, urban classification, built-up area
          detection, and GIS layers without changing the frontend
          structure.{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
