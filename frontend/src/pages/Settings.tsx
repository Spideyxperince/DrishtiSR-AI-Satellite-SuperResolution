import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Server,
  Satellite,
  Map,
  ShieldCheck,
  Save,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { checkBackendHealth } from "../services/api";
interface SettingsData {
  crs: string;
  mapProvider: string;
  spectralValidation: boolean;
  geographicValidation: boolean;
  hallucinationDetection: boolean;
}
const DEFAULT_SETTINGS: SettingsData = {
  crs: "auto",
  mapProvider: "satellite",
  spectralValidation: true,
  geographicValidation: true,
  hallucinationDetection: true,
};
export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "connected" | "disconnected"
  >("checking");
  const [healthLoading, setHealthLoading] = useState(false);
  const checkHealth = async () => {
    try {
      setHealthLoading(true);
      setBackendStatus("checking");
      const result = await checkBackendHealth();
      if (result.status === "healthy") {
        setBackendStatus("connected");
      } else {
        setBackendStatus("disconnected");
      }
    } catch {
      setBackendStatus("disconnected");
    } finally {
      setHealthLoading(false);
    }
  };
  useEffect(() => {
    const storedSettings = localStorage.getItem("sih26142-settings");
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
    checkHealth();
  }, []);
  const updateSetting = <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K],
  ) => {
    setSettings((previous) => ({ ...previous, [key]: value }));
    setSaved(false);
  };
  const handleSave = () => {
    localStorage.setItem("sih26142-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };
  return (
    <div className="space-y-6">
      {" "}
      {/* Header */}{" "}
      <div>
        {" "}
        <div className="mb-2 flex items-center gap-2 text-text-secondary">
          {" "}
          <SettingsIcon size={18} />{" "}
          <span className="text-sm font-medium">
            {" "}
            System Configuration{" "}
          </span>{" "}
        </div>{" "}
        <h1 className="text-2xl font-bold text-text-primary">
          {" "}
          Settings{" "}
        </h1>{" "}
        <p className="mt-1 text-sm text-text-secondary">
          {" "}
          Configure project, processing, GIS, and validation settings.{" "}
        </p>{" "}
      </div>{" "}
      {/* Project Settings */}{" "}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
        {" "}
        <div className="mb-5 flex items-center gap-3">
          {" "}
          <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
            {" "}
            <Satellite size={20} />{" "}
          </div>{" "}
          <div>
            {" "}
            <h2 className="font-semibold text-text-primary">
              {" "}
              Project Settings{" "}
            </h2>{" "}
            <p className="text-sm text-text-secondary">
              {" "}
              Basic satellite processing configuration{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {" "}
          <div>
            {" "}
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              {" "}
              Project ID{" "}
            </label>{" "}
            <input
              value="SIH 26142"
              readOnly
              className="w-full rounded-lg border border-border-subtle bg-bg-surface-secondary px-4 py-2.5 text-sm text-text-secondary outline-none"
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              {" "}
              Dataset{" "}
            </label>{" "}
            <input
              value="Sentinel-2"
              readOnly
              className="w-full rounded-lg border border-border-subtle bg-bg-surface-secondary px-4 py-2.5 text-sm text-text-secondary outline-none"
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              {" "}
              Input Resolution{" "}
            </label>{" "}
            <input
              value="10m"
              readOnly
              className="w-full rounded-lg border border-border-subtle bg-bg-surface-secondary px-4 py-2.5 text-sm text-text-secondary outline-none"
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              {" "}
              Target Resolution{" "}
            </label>{" "}
            <input
              value="≤4m"
              readOnly
              className="w-full rounded-lg border border-border-subtle bg-bg-surface-secondary px-4 py-2.5 text-sm text-text-secondary outline-none"
            />{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Backend Settings */}{" "}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
        {" "}
        <div className="mb-5 flex items-center gap-3">
          {" "}
          <div className="rounded-lg bg-green-50 p-2.5 text-green-600">
            {" "}
            <Server size={20} />{" "}
          </div>{" "}
          <div>
            {" "}
            <h2 className="font-semibold text-text-primary">
              {" "}
              Backend Connection{" "}
            </h2>{" "}
            <p className="text-sm text-text-secondary">
              {" "}
              API server configuration{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {" "}
          <div>
            {" "}
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              {" "}
              API URL{" "}
            </label>{" "}
            <input
              value={import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}
              readOnly
              className="w-full rounded-lg border border-border-subtle bg-bg-surface-secondary px-4 py-2.5 text-sm text-text-secondary outline-none"
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              {" "}
              API Status{" "}
            </label>{" "}
            <div
              className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm font-medium ${backendStatus === "connected" ? "border-green-200 bg-green-50 text-green-700" : backendStatus === "disconnected" ? "border-red-200 bg-red-50 text-red-700" : "border-border-subtle bg-bg-surface-secondary text-text-secondary"}`}
            >
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                {backendStatus === "connected" && (
                  <>
                    {" "}
                    <span className="h-2 w-2 rounded-full bg-green-500" />{" "}
                    Connected{" "}
                  </>
                )}{" "}
                {backendStatus === "disconnected" && (
                  <>
                    {" "}
                    <XCircle size={16} /> Disconnected{" "}
                  </>
                )}{" "}
                {backendStatus === "checking" && (
                  <>
                    {" "}
                    <RefreshCw size={16} className="animate-spin" />{" "}
                    Checking...{" "}
                  </>
                )}{" "}
              </div>{" "}
              <button
                onClick={checkHealth}
                disabled={healthLoading}
                className="text-xs underline underline-offset-2 hover:no-underline disabled:opacity-50"
              >
                {" "}
                Check{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* GIS Settings */}{" "}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
        {" "}
        <div className="mb-5 flex items-center gap-3">
          {" "}
          <div className="rounded-lg bg-purple-50 p-2.5 text-purple-600">
            {" "}
            <Map size={20} />{" "}
          </div>{" "}
          <div>
            {" "}
            <h2 className="font-semibold text-text-primary">
              {" "}
              GIS Settings{" "}
            </h2>{" "}
            <p className="text-sm text-text-secondary">
              {" "}
              Geospatial visualization configuration{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {" "}
          <div>
            {" "}
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              {" "}
              Coordinate Reference System{" "}
            </label>{" "}
            <select
              value={settings.crs}
              onChange={(event) => updateSetting("crs", event.target.value)}
              className="w-full rounded-lg border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm text-text-secondary outline-none focus:border-blue-400"
            >
              {" "}
              <option value="auto"> Auto Detect </option>{" "}
              <option value="epsg4326"> EPSG:4326 </option>{" "}
              <option value="utm"> UTM </option>{" "}
            </select>{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              {" "}
              Map Provider{" "}
            </label>{" "}
            <select
              value={settings.mapProvider}
              onChange={(event) =>
                updateSetting("mapProvider", event.target.value)
              }
              className="w-full rounded-lg border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm text-text-secondary outline-none focus:border-blue-400"
            >
              {" "}
              <option value="satellite"> Satellite </option>{" "}
              <option value="osm"> OpenStreetMap </option>{" "}
            </select>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Validation Settings */}{" "}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
        {" "}
        <div className="mb-5 flex items-center gap-3">
          {" "}
          <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600">
            {" "}
            <ShieldCheck size={20} />{" "}
          </div>{" "}
          <div>
            {" "}
            <h2 className="font-semibold text-text-primary">
              {" "}
              Validation Settings{" "}
            </h2>{" "}
            <p className="text-sm text-text-secondary">
              {" "}
              Quality and trust validation configuration{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        <div className="space-y-4">
          {" "}
          {/* Spectral */}{" "}
          <div className="flex items-center justify-between rounded-lg bg-bg-surface-secondary px-4 py-4">
            {" "}
            <div>
              {" "}
              <p className="text-sm font-medium text-text-secondary">
                {" "}
                Spectral Validation{" "}
              </p>{" "}
              <p className="mt-1 text-xs text-text-muted">
                {" "}
                Validate spectral consistency of enhanced imagery{" "}
              </p>{" "}
            </div>{" "}
            <input
              type="checkbox"
              checked={settings.spectralValidation}
              onChange={(event) =>
                updateSetting("spectralValidation", event.target.checked)
              }
              className="h-4 w-4"
            />{" "}
          </div>{" "}
          {/* Geographic */}{" "}
          <div className="flex items-center justify-between rounded-lg bg-bg-surface-secondary px-4 py-4">
            {" "}
            <div>
              {" "}
              <p className="text-sm font-medium text-text-secondary">
                {" "}
                Geographic Validation{" "}
              </p>{" "}
              <p className="mt-1 text-xs text-text-muted">
                {" "}
                Check geographic alignment and metadata{" "}
              </p>{" "}
            </div>{" "}
            <input
              type="checkbox"
              checked={settings.geographicValidation}
              onChange={(event) =>
                updateSetting("geographicValidation", event.target.checked)
              }
              className="h-4 w-4"
            />{" "}
          </div>{" "}
          {/* Hallucination */}{" "}
          <div className="flex items-center justify-between rounded-lg bg-bg-surface-secondary px-4 py-4">
            {" "}
            <div>
              {" "}
              <p className="text-sm font-medium text-text-secondary">
                {" "}
                Hallucination Detection{" "}
              </p>{" "}
              <p className="mt-1 text-xs text-text-muted">
                {" "}
                Flag suspicious AI-generated details{" "}
              </p>{" "}
            </div>{" "}
            <input
              type="checkbox"
              checked={settings.hallucinationDetection}
              onChange={(event) =>
                updateSetting("hallucinationDetection", event.target.checked)
              }
              className="h-4 w-4"
            />{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Save */}{" "}
      <div className="flex items-center justify-end gap-4">
        {" "}
        {saved && (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            {" "}
            <CheckCircle2 size={17} /> Settings saved successfully{" "}
          </div>
        )}{" "}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-bg-surface px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {" "}
          <Save size={16} /> Save Settings{" "}
        </button>{" "}
      </div>{" "}
      {/* Integration Note */}{" "}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        {" "}
        <h3 className="font-semibold text-blue-900">
          {" "}
          Integration Ready{" "}
        </h3>{" "}
        <p className="mt-1 text-sm leading-6 text-blue-700">
          {" "}
          Settings are stored locally and restored automatically. Backend health
          is checked through the FastAPI health endpoint. Advanced GIS and model
          configuration can be connected later without changing the application
          architecture.{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
