import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Gauge,
  Map,
  Satellite,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { getProcessingStatus } from "../services/api";
const workflow = [
  {
    number: "01",
    title: "Sentinel-2 Input",
    description: "10 m multispectral imagery",
    icon: Satellite,
  },
  {
    number: "02",
    title: "AI Super Resolution",
    description: "Deep learning enhancement",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Enhanced Image",
    description: "Output up to 4 m",
    icon: Zap,
  },
  {
    number: "04",
    title: "Confidence",
    description: "Pixel-level reliability",
    icon: ShieldCheck,
  },
  {
    number: "05",
    title: "Spectral Validation",
    description: "Spectral consistency",
    icon: Target,
  },
  {
    number: "06",
    title: "Geographic Check",
    description: "Spatial fidelity validation",
    icon: Map,
  },
];
interface ProcessingStatus {
  status?: string;
  stage?: string;
  input_filename?: string | null;
  output_filename?: string | null;
  input_resolution?: string;
  target_resolution?: string;
}
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
}) {
  return (
    <div className=" group rounded-2xl border border-border-subtle bg-bg-surface p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:bg-bg-surface dark:hover:border-blue-800 ">
      {" "}
      <div className="flex items-start justify-between">
        {" "}
        <div className="min-w-0">
          {" "}
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {" "}
            {title}{" "}
          </p>{" "}
          <h3 className="mt-2 truncate text-2xl font-bold tracking-tight text-text-primary ">
            {" "}
            {value}{" "}
          </h3>{" "}
          <p className="mt-1 truncate text-xs text-text-muted">
            {" "}
            {subtitle}{" "}
          </p>{" "}
        </div>{" "}
        <div className=" flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 transition group-hover:bg-blue-100 dark:bg-blue-950/50 dark:group-hover:bg-blue-900/60 ">
          {" "}
          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
export default function Dashboard() {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState<ProcessingStatus | null>(null);
  const [error, setError] = useState("");
  const loadProcessingStatus = async () => {
    try {
      setError("");
      const result = await getProcessingStatus();
      setProcessing(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load processing status",
      );
    }
  };
  useEffect(() => {
    loadProcessingStatus();
  }, []);
  const status = processing?.status || "idle";
  const currentStage = processing?.stage || "Waiting for input";
  const inputFile = processing?.input_filename || "No file processed";
  const outputFile = processing?.output_filename || "Waiting for AI output";
  const hasOutput = Boolean(processing?.output_filename);
  const normalizedStatus = status.toLowerCase();
  const isProcessing =
    normalizedStatus === "pending" || normalizedStatus === "processing";
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      {" "}
      {/* HERO */}{" "}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8 lg:px-10">
        {" "}
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />{" "}
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />{" "}
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          {" "}
          <div className="max-w-3xl">
            {" "}
            <div className="flex flex-wrap items-center gap-3">
              {" "}
              <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                {" "}
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> SYSTEM
                ONLINE{" "}
              </span>{" "}
              <span className="rounded-full border border-white/10 bg-bg-surface/5 px-3 py-1.5 text-xs font-medium text-slate-300">
                {" "}
                SIH 26142{" "}
              </span>{" "}
            </div>{" "}
            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              {" "}
              Satellite Super Resolution{" "}
            </h1>{" "}
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              {" "}
              Transform medium-resolution Sentinel-2 imagery into enhanced
              satellite products with resolution up to{" "}
              <span className="font-semibold text-white"> 4 m</span>, while
              monitoring spectral and geographic consistency.{" "}
            </p>{" "}
            <div className="mt-6 flex flex-wrap gap-3">
              {" "}
              <button
                onClick={() => navigate("/input")}
                className="flex items-center gap-2 rounded-xl bg-bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary transition hover:bg-bg-surface-secondary"
              >
                {" "}
                <Satellite className="h-4 w-4" /> New Processing{" "}
              </button>{" "}
              <button
                onClick={() => navigate("/map")}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-bg-surface/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-bg-surface/10"
              >
                {" "}
                <Map className="h-4 w-4" /> Open GIS{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
          <div className="hidden shrink-0 lg:block">
            {" "}
            <div className="flex h-32 w-32 items-center justify-center rounded-3xl border border-white/10 bg-bg-surface/5 backdrop-blur">
              {" "}
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/20">
                {" "}
                <Satellite className="h-10 w-10 text-blue-300" />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ERROR */}{" "}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {" "}
          <Activity className="mt-0.5 h-5 w-5 shrink-0" />{" "}
          <div>
            {" "}
            <p className="font-semibold"> Backend connection error </p>{" "}
            <p className="mt-1 text-red-600 dark:text-red-400">
              {" "}
              {error}{" "}
            </p>{" "}
          </div>{" "}
        </div>
      )}{" "}
      {/* STATS */}{" "}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {" "}
        <StatCard
          title="Resolution Transformation"
          value={`${processing?.input_resolution || "10 m"} → ${processing?.target_resolution || "≤4 m"}`}
          subtitle="Input to target output"
          icon={Gauge}
        />{" "}
        <StatCard
          title="Processing"
          value={status === "idle" ? "Idle" : status}
          subtitle={currentStage}
          icon={Activity}
        />{" "}
        <StatCard
          title="Input Dataset"
          value={
            inputFile === "No file processed" ? "No file selected" : inputFile
          }
          subtitle="Current satellite imagery"
          icon={Satellite}
        />{" "}
        <StatCard
          title="Enhanced Output"
          value={hasOutput ? outputFile : "Pending"}
          subtitle="AI super-resolution product"
          icon={Target}
        />{" "}
      </section>{" "}
      {/* MAIN PIPELINE */}{" "}
      <section className="overflow-hidden rounded-3xl border border-border-subtle bg-bg-surface shadow-sm dark:bg-bg-surface">
        {" "}
        <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
          {" "}
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            {" "}
            <div>
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50">
                  {" "}
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                </div>{" "}
                <h2 className="text-lg font-bold text-text-primary ">
                  {" "}
                  Processing Pipeline{" "}
                </h2>{" "}
              </div>{" "}
              <p className="mt-2 text-sm text-text-secondary dark:text-text-muted">
                {" "}
                End-to-end satellite enhancement and validation workflow{" "}
              </p>{" "}
            </div>{" "}
            <span className="rounded-full bg-bg-surface-secondary px-3 py-1.5 text-xs font-semibold text-text-secondary dark:text-text-muted">
              {" "}
              6 stages configured{" "}
            </span>{" "}
          </div>{" "}
        </div>{" "}
        <div className="p-6 sm:p-7">
          {" "}
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {" "}
            {workflow.map((item) => {
              const Icon = item.icon;
              const isCurrent =
                item.title === currentStage ||
                (item.number === "02" && isProcessing);
              const isComplete =
                item.number === "01" || (item.number === "02" && hasOutput);
              return (
                <div
                  key={item.number}
                  className={`group rounded-2xl border p-4 transition duration-200 ${isCurrent ? "border-blue-200 bg-blue-50/50 shadow-sm dark:border-blue-800 dark:bg-blue-950/30" : "border-border-subtle bg-bg-surface hover:border-blue-200 hover:bg-bg-surface-secondary dark:bg-bg-surface dark:hover:border-blue-800 dark:hover:bg-slate-800"}`}
                >
                  {" "}
                  <div className="flex items-start gap-4">
                    {" "}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${isCurrent ? "bg-blue-600 text-white" : "bg-bg-surface-secondary text-text-secondary group-hover:bg-blue-100 group-hover:text-blue-600 dark:text-text-muted dark:group-hover:bg-blue-950 dark:group-hover:text-blue-400"}`}
                    >
                      {" "}
                      <Icon className="h-5 w-5" />{" "}
                    </div>{" "}
                    <div className="min-w-0 flex-1">
                      {" "}
                      <div className="flex items-center justify-between gap-2">
                        {" "}
                        <span className="text-[10px] font-bold tracking-wider text-text-muted">
                          {" "}
                          STEP {item.number}{" "}
                        </span>{" "}
                        {isComplete ? (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {" "}
                            <CheckCircle2 className="h-3.5 w-3.5" /> Ready{" "}
                          </span>
                        ) : isCurrent ? (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                            {" "}
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />{" "}
                            Processing{" "}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-text-muted">
                            {" "}
                            Pending{" "}
                          </span>
                        )}{" "}
                      </div>{" "}
                      <h3 className="mt-1 text-sm font-semibold text-text-primary ">
                        {" "}
                        {item.title}{" "}
                      </h3>{" "}
                      <p className="mt-1 text-xs text-text-muted">
                        {" "}
                        {item.description}{" "}
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>
              );
            })}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Removed redundant RESOLUTION + STATUS section to fix overlap */}{" "}
      {/* TRUST + ANALYSIS + DATASET */}{" "}
      <section className="grid gap-6 lg:grid-cols-3">
        {" "}
        {/* Trust */}{" "}
        <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 shadow-sm dark:bg-bg-surface">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50">
              {" "}
              <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />{" "}
            </div>{" "}
            <div>
              {" "}
              <h3 className="font-semibold text-text-primary ">
                {" "}
                Trust & Validation{" "}
              </h3>{" "}
              <p className="text-xs text-text-muted">
                {" "}
                Don't trust sharpness alone{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <p className="mt-5 text-sm leading-6 text-text-secondary dark:text-text-muted">
            {" "}
            Validate whether generated details remain geographically and
            spectrally consistent with the original satellite observation.{" "}
          </p>{" "}
          <button
            onClick={() => navigate("/validation/confidence")}
            className="mt-5 flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:gap-2 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {" "}
            Open validation <ArrowRight className="h-4 w-4" />{" "}
          </button>{" "}
        </div>{" "}
        {/* Analysis */}{" "}
        <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 shadow-sm dark:bg-bg-surface">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
              {" "}
              <span className="text-xl">🌱</span>{" "}
            </div>{" "}
            <div>
              {" "}
              <h3 className="font-semibold text-text-primary ">
                {" "}
                Downstream Analysis{" "}
              </h3>{" "}
              <p className="text-xs text-text-muted">
                {" "}
                Turn imagery into insights{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {" "}
            <button
              onClick={() => navigate("/analysis/crop")}
              className="rounded-xl bg-bg-surface-secondary p-3 text-center transition hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              {" "}
              <p className="text-xs font-semibold text-text-secondary ">
                {" "}
                Crop{" "}
              </p>{" "}
              <p className="mt-1 text-[10px] text-text-muted"> NDVI </p>{" "}
            </button>{" "}
            <button
              onClick={() => navigate("/analysis/urban")}
              className="rounded-xl bg-bg-surface-secondary p-3 text-center transition hover:bg-blue-50 dark:hover:bg-blue-950/40"
            >
              {" "}
              <p className="text-xs font-semibold text-text-secondary ">
                {" "}
                Urban{" "}
              </p>{" "}
              <p className="mt-1 text-[10px] text-text-muted"> NDBI </p>{" "}
            </button>{" "}
            <button
              onClick={() => navigate("/analysis/disaster")}
              className="rounded-xl bg-bg-surface-secondary p-3 text-center transition hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              {" "}
              <p className="text-xs font-semibold text-text-secondary ">
                {" "}
                Disaster{" "}
              </p>{" "}
              <p className="mt-1 text-[10px] text-text-muted"> Change </p>{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        {/* Dataset */}{" "}
        <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 shadow-sm dark:bg-bg-surface">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/40">
              {" "}
              <Satellite className="h-5 w-5 text-purple-600 dark:text-purple-400" />{" "}
            </div>{" "}
            <div>
              {" "}
              <h3 className="font-semibold text-text-primary ">
                {" "}
                Current Dataset{" "}
              </h3>{" "}
              <p className="text-xs text-text-muted">
                {" "}
                Active processing project{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-5 space-y-4">
            {" "}
            <div className="flex justify-between gap-4 text-sm">
              {" "}
              <span className="text-text-secondary dark:text-text-muted">
                {" "}
                Satellite{" "}
              </span>{" "}
              <span className="font-semibold text-text-primary ">
                {" "}
                Sentinel-2{" "}
              </span>{" "}
            </div>{" "}
            <div className="flex justify-between gap-4 text-sm">
              {" "}
              <span className="text-text-secondary dark:text-text-muted">
                {" "}
                Input{" "}
              </span>{" "}
              <span className="font-semibold text-text-primary ">
                {" "}
                {processing?.input_resolution || "10m"}{" "}
              </span>{" "}
            </div>{" "}
            <div className="flex justify-between gap-4 text-sm">
              {" "}
              <span className="text-text-secondary dark:text-text-muted">
                {" "}
                Target{" "}
              </span>{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {" "}
                {processing?.target_resolution || "≤4m"}{" "}
              </span>{" "}
            </div>{" "}
            <div className="flex justify-between gap-4 text-sm">
              {" "}
              <span className="text-text-secondary dark:text-text-muted">
                {" "}
                Status{" "}
              </span>{" "}
              <span
                className={`font-semibold capitalize ${isProcessing ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}
              >
                {" "}
                {status}{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* CTA */}{" "}
      <section className=" flex flex-col justify-between gap-5 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 to-slate-50 p-6 transition-colors dark:border-blue-900/50 dark:from-blue-950/40 dark:to-slate-900 sm:flex-row sm:items-center sm:p-7 ">
        {" "}
        <div>
          {" "}
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {" "}
            Next Processing Job{" "}
          </p>{" "}
          <h3 className="mt-1 text-lg font-bold text-text-primary ">
            {" "}
            Ready to process another satellite image?{" "}
          </h3>{" "}
          <p className="mt-1 text-sm text-text-secondary dark:text-text-muted">
            {" "}
            Upload a new Sentinel-2 GeoTIFF and start the super-resolution
            workflow.{" "}
          </p>{" "}
        </div>{" "}
        <button
          onClick={() => navigate("/input")}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
        >
          {" "}
          <Sparkles className="h-4 w-4" /> Start Processing{" "}
          <ArrowRight className="h-4 w-4" />{" "}
        </button>{" "}
      </section>{" "}
    </div>
  );
}
