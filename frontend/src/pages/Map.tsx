import { useState } from "react";
import {
  Map as MapIcon,
  Layers,
  Satellite,
  ShieldCheck,
  Leaf,
  Building2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { getGISData } from "../services/api";
export default function Map() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [layers, setLayers] = useState({
    satellite: true,
    enhanced: false,
    confidence: false,
    crop: false,
    urban: false,
    disaster: false,
  });
  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers((previous) => ({ ...previous, [layer]: !previous[layer] }));
  };
  const handleLoadMap = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getGISData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load GIS data");
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
          <div className="mb-2 flex items-center gap-2 text-blue-600">
            {" "}
            <MapIcon size={18} />{" "}
            <span className="text-sm font-medium">
              {" "}
              Geospatial Visualization{" "}
            </span>{" "}
          </div>{" "}
          <h1 className="text-2xl font-bold text-text-primary">
            {" "}
            Map & GIS{" "}
          </h1>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Explore satellite imagery, enhanced products, validation layers, and
            downstream analysis results.{" "}
          </p>{" "}
        </div>{" "}
        <button
          onClick={handleLoadMap}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-bg-surface px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {" "}
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
          {loading ? "Loading..." : "Load GIS Data"}{" "}
        </button>{" "}
      </div>{" "}
      {/* Error */}{" "}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {" "}
          {error}{" "}
        </div>
      )}{" "}
      {/* Backend Success */}{" "}
      {data && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {" "}
          GIS backend response received successfully.{" "}
        </div>
      )}{" "}
      {/* Main Map Area */}{" "}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {" "}
        {/* Layer Panel */}{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <div className="mb-5 flex items-center gap-2">
            {" "}
            <Layers size={18} className="text-text-secondary" />{" "}
            <h2 className="font-semibold text-text-primary">
              {" "}
              Map Layers{" "}
            </h2>{" "}
          </div>{" "}
          <div className="space-y-2">
            {" "}
            {/* Satellite */}{" "}
            <button
              onClick={() => toggleLayer("satellite")}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${layers.satellite ? "border-blue-200 bg-blue-50" : "border-border-subtle bg-bg-surface"}`}
            >
              {" "}
              <Satellite
                size={18}
                className={
                  layers.satellite ? "text-blue-600" : "text-text-muted"
                }
              />{" "}
              <div className="flex-1">
                {" "}
                <p className="text-sm font-medium text-text-secondary">
                  {" "}
                  Sentinel-2{" "}
                </p>{" "}
                <p className="text-xs text-text-muted">
                  {" "}
                  10m input imagery{" "}
                </p>{" "}
              </div>{" "}
              <div
                className={`h-2.5 w-2.5 rounded-full ${layers.satellite ? "bg-blue-500" : "bg-slate-300"}`}
              />{" "}
            </button>{" "}
            {/* Enhanced */}{" "}
            <button
              onClick={() => toggleLayer("enhanced")}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${layers.enhanced ? "border-purple-200 bg-purple-50" : "border-border-subtle bg-bg-surface"}`}
            >
              {" "}
              <Satellite
                size={18}
                className={
                  layers.enhanced ? "text-purple-600" : "text-text-muted"
                }
              />{" "}
              <div className="flex-1">
                {" "}
                <p className="text-sm font-medium text-text-secondary">
                  {" "}
                  Enhanced Image{" "}
                </p>{" "}
                <p className="text-xs text-text-muted"> ≤4m AI product </p>{" "}
              </div>{" "}
              <div
                className={`h-2.5 w-2.5 rounded-full ${layers.enhanced ? "bg-purple-500" : "bg-slate-300"}`}
              />{" "}
            </button>{" "}
            {/* Confidence */}{" "}
            <button
              onClick={() => toggleLayer("confidence")}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${layers.confidence ? "border-amber-200 bg-amber-50" : "border-border-subtle bg-bg-surface"}`}
            >
              {" "}
              <ShieldCheck
                size={18}
                className={
                  layers.confidence ? "text-amber-600" : "text-text-muted"
                }
              />{" "}
              <div className="flex-1">
                {" "}
                <p className="text-sm font-medium text-text-secondary">
                  {" "}
                  Confidence{" "}
                </p>{" "}
                <p className="text-xs text-text-muted">
                  {" "}
                  Trust / uncertainty{" "}
                </p>{" "}
              </div>{" "}
              <div
                className={`h-2.5 w-2.5 rounded-full ${layers.confidence ? "bg-amber-500" : "bg-slate-300"}`}
              />{" "}
            </button>{" "}
            {/* Crop */}{" "}
            <button
              onClick={() => toggleLayer("crop")}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${layers.crop ? "border-green-200 bg-green-50" : "border-border-subtle bg-bg-surface"}`}
            >
              {" "}
              <Leaf
                size={18}
                className={layers.crop ? "text-green-600" : "text-text-muted"}
              />{" "}
              <div className="flex-1">
                {" "}
                <p className="text-sm font-medium text-text-secondary">
                  {" "}
                  Crop Analysis{" "}
                </p>{" "}
                <p className="text-xs text-text-muted">
                  {" "}
                  NDVI / vegetation{" "}
                </p>{" "}
              </div>{" "}
              <div
                className={`h-2.5 w-2.5 rounded-full ${layers.crop ? "bg-green-500" : "bg-slate-300"}`}
              />{" "}
            </button>{" "}
            {/* Urban */}{" "}
            <button
              onClick={() => toggleLayer("urban")}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${layers.urban ? "border-orange-200 bg-orange-50" : "border-border-subtle bg-bg-surface"}`}
            >
              {" "}
              <Building2
                size={18}
                className={layers.urban ? "text-orange-600" : "text-text-muted"}
              />{" "}
              <div className="flex-1">
                {" "}
                <p className="text-sm font-medium text-text-secondary">
                  {" "}
                  Urban Analysis{" "}
                </p>{" "}
                <p className="text-xs text-text-muted">
                  {" "}
                  NDBI / built-up{" "}
                </p>{" "}
              </div>{" "}
              <div
                className={`h-2.5 w-2.5 rounded-full ${layers.urban ? "bg-orange-500" : "bg-slate-300"}`}
              />{" "}
            </button>{" "}
            {/* Disaster */}{" "}
            <button
              onClick={() => toggleLayer("disaster")}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${layers.disaster ? "border-red-200 bg-red-50" : "border-border-subtle bg-bg-surface"}`}
            >
              {" "}
              <AlertTriangle
                size={18}
                className={layers.disaster ? "text-red-600" : "text-text-muted"}
              />{" "}
              <div className="flex-1">
                {" "}
                <p className="text-sm font-medium text-text-secondary">
                  {" "}
                  Disaster Analysis{" "}
                </p>{" "}
                <p className="text-xs text-text-muted">
                  {" "}
                  Affected regions{" "}
                </p>{" "}
              </div>{" "}
              <div
                className={`h-2.5 w-2.5 rounded-full ${layers.disaster ? "bg-red-500" : "bg-slate-300"}`}
              />{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        {/* Map */}{" "}
        <div className="lg:col-span-3 rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <div className="mb-4 flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <h2 className="text-lg font-semibold text-text-primary">
                {" "}
                Interactive GIS Map{" "}
              </h2>{" "}
              <p className="text-sm text-text-secondary">
                {" "}
                Mumbai Region • Sentinel-2{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-lg border border-border-subtle bg-bg-surface-secondary px-3 py-2 text-xs text-text-secondary">
              {" "}
              CRS: Pending{" "}
            </div>{" "}
          </div>{" "}
          <div className="relative flex h-[500px] items-center justify-center overflow-hidden rounded-xl border border-border-subtle bg-bg-surface-secondary">
            {" "}
            {/* Map Grid */}{" "}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />{" "}
            {/* Map Center */}{" "}
            <div className="relative z-10 text-center">
              {" "}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-surface shadow-sm">
                {" "}
                <MapIcon size={30} className="text-blue-600" />{" "}
              </div>{" "}
              <h3 className="font-semibold text-text-secondary">
                {" "}
                GIS Map Placeholder{" "}
              </h3>{" "}
              <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
                {" "}
                Interactive satellite imagery and geospatial layers will be
                rendered here after the GIS module is integrated.{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Map Information */}{" "}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <p className="text-sm text-text-secondary"> Input Resolution </p>{" "}
          <p className="mt-2 text-xl font-bold text-text-primary"> 10m </p>{" "}
          <p className="mt-1 text-xs text-text-muted"> Sentinel-2 </p>{" "}
        </div>{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <p className="text-sm text-text-secondary">
            {" "}
            Enhanced Resolution{" "}
          </p>{" "}
          <p className="mt-2 text-xl font-bold text-text-primary"> ≤4m </p>{" "}
          <p className="mt-1 text-xs text-text-muted">
            {" "}
            AI super resolution{" "}
          </p>{" "}
        </div>{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <p className="text-sm text-text-secondary">
            {" "}
            Geographic Fidelity{" "}
          </p>{" "}
          <p className="mt-2 text-xl font-bold text-text-primary"> -- </p>{" "}
          <p className="mt-1 text-xs text-text-muted">
            {" "}
            Validation pending{" "}
          </p>{" "}
        </div>{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <p className="text-sm text-text-secondary"> GIS Status </p>{" "}
          <p className="mt-2 text-xl font-bold text-amber-600"> Pending </p>{" "}
          <p className="mt-1 text-xs text-text-muted">
            {" "}
            Integration required{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {/* Integration Note */}{" "}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        {" "}
        <h3 className="font-semibold text-blue-900">
          {" "}
          GIS Integration Ready{" "}
        </h3>{" "}
        <p className="mt-1 text-sm leading-6 text-blue-700">
          {" "}
          The frontend layer system is ready for MapLibre, GeoTIFF rendering,
          GeoJSON features, CRS information, enhanced imagery, confidence maps,
          NDVI, NDBI, and disaster-analysis layers. Your teammates can connect
          the real geospatial outputs through the existing GIS API.{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
