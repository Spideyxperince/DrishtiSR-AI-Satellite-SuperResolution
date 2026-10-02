import { useState } from "react";
import {
  FileText,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Satellite,
  Leaf,
  Building2,
  AlertTriangle,
} from "lucide-react";
import { generateReport, getReports } from "../services/api";
export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [data, setData] = useState<any>(null);
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [error, setError] = useState("");
  const handleLoadReports = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getReports();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };
  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      setError("");
      const result = await generateReport();
      setGeneratedReport(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate report",
      );
    } finally {
      setGenerating(false);
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
            <FileText size={18} />{" "}
            <span className="text-sm font-medium">
              {" "}
              Project Documentation{" "}
            </span>{" "}
          </div>{" "}
          <h1 className="text-2xl font-bold text-text-primary">
            {" "}
            Reports{" "}
          </h1>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Generate and review processing, validation, and downstream analysis
            reports.{" "}
          </p>{" "}
        </div>{" "}
        <div className="flex gap-3">
          {" "}
          <button
            onClick={handleLoadReports}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-surface-secondary disabled:opacity-60"
          >
            {" "}
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />{" "}
            {loading ? "Loading..." : "Refresh"}{" "}
          </button>{" "}
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="flex items-center gap-2 rounded-lg bg-bg-surface px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {" "}
            <FileText size={16} />{" "}
            {generating ? "Generating..." : "Generate Report"}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* Error */}{" "}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {" "}
          {error}{" "}
        </div>
      )}{" "}
      {/* Backend Response */}{" "}
      {data && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {" "}
          Reports API response received successfully.{" "}
        </div>
      )}{" "}
      {generatedReport && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {" "}
          Report generation API response received successfully.{" "}
        </div>
      )}{" "}
      {/* Project Summary */}{" "}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
        {" "}
        <div className="mb-6">
          {" "}
          <h2 className="text-lg font-semibold text-text-primary">
            {" "}
            Processing Summary{" "}
          </h2>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Summary of the current satellite super-resolution workflow.{" "}
          </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {" "}
          <div className="rounded-lg bg-bg-surface-secondary p-4">
            {" "}
            <div className="flex items-center gap-3">
              {" "}
              <Satellite size={20} className="text-blue-600" />{" "}
              <span className="text-sm text-text-secondary"> Input </span>{" "}
            </div>{" "}
            <p className="mt-3 text-xl font-bold text-text-primary"> 10m </p>{" "}
            <p className="mt-1 text-xs text-text-muted"> Sentinel-2 </p>{" "}
          </div>{" "}
          <div className="rounded-lg bg-bg-surface-secondary p-4">
            {" "}
            <div className="flex items-center gap-3">
              {" "}
              <Satellite size={20} className="text-purple-600" />{" "}
              <span className="text-sm text-text-secondary">
                {" "}
                Enhanced{" "}
              </span>{" "}
            </div>{" "}
            <p className="mt-3 text-xl font-bold text-text-primary">
              {" "}
              ≤4m{" "}
            </p>{" "}
            <p className="mt-1 text-xs text-text-muted">
              {" "}
              Target resolution{" "}
            </p>{" "}
          </div>{" "}
          <div className="rounded-lg bg-bg-surface-secondary p-4">
            {" "}
            <div className="flex items-center gap-3">
              {" "}
              <ShieldCheck size={20} className="text-green-600" />{" "}
              <span className="text-sm text-text-secondary">
                {" "}
                Validation{" "}
              </span>{" "}
            </div>{" "}
            <p className="mt-3 text-xl font-bold text-text-primary">
              {" "}
              --{" "}
            </p>{" "}
            <p className="mt-1 text-xs text-text-muted"> Pending </p>{" "}
          </div>{" "}
          <div className="rounded-lg bg-bg-surface-secondary p-4">
            {" "}
            <div className="flex items-center gap-3">
              {" "}
              <CheckCircle2 size={20} className="text-emerald-600" />{" "}
              <span className="text-sm text-text-secondary"> Status </span>{" "}
            </div>{" "}
            <p className="mt-3 text-xl font-bold text-text-primary"> Ready </p>{" "}
            <p className="mt-1 text-xs text-text-muted"> Report-ready </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Validation Summary */}{" "}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
        {" "}
        <div className="mb-5">
          {" "}
          <h2 className="text-lg font-semibold text-text-primary">
            {" "}
            Validation Summary{" "}
          </h2>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Quality and trust metrics for the enhanced satellite product.{" "}
          </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {" "}
          <div className="rounded-lg border border-border-subtle p-4">
            {" "}
            <p className="text-sm text-text-secondary"> Confidence </p>{" "}
            <p className="mt-2 text-2xl font-bold text-text-primary"> -- </p>{" "}
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
              {" "}
              <Clock3 size={14} /> Pending{" "}
            </div>{" "}
          </div>{" "}
          <div className="rounded-lg border border-border-subtle p-4">
            {" "}
            <p className="text-sm text-text-secondary">
              {" "}
              Spectral Fidelity{" "}
            </p>{" "}
            <p className="mt-2 text-2xl font-bold text-text-primary">
              {" "}
              --{" "}
            </p>{" "}
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
              {" "}
              <Clock3 size={14} /> Pending{" "}
            </div>{" "}
          </div>{" "}
          <div className="rounded-lg border border-border-subtle p-4">
            {" "}
            <p className="text-sm text-text-secondary">
              {" "}
              Geographic Fidelity{" "}
            </p>{" "}
            <p className="mt-2 text-2xl font-bold text-text-primary">
              {" "}
              --{" "}
            </p>{" "}
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
              {" "}
              <Clock3 size={14} /> Pending{" "}
            </div>{" "}
          </div>{" "}
          <div className="rounded-lg border border-border-subtle p-4">
            {" "}
            <p className="text-sm text-text-secondary">
              {" "}
              Hallucination Risk{" "}
            </p>{" "}
            <p className="mt-2 text-2xl font-bold text-text-primary">
              {" "}
              --{" "}
            </p>{" "}
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
              {" "}
              <Clock3 size={14} /> Pending{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Downstream Analysis */}{" "}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
        {" "}
        <div className="mb-5">
          {" "}
          <h2 className="text-lg font-semibold text-text-primary">
            {" "}
            Downstream Analysis{" "}
          </h2>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Analysis modules that can consume the enhanced satellite
            product.{" "}
          </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {" "}
          <div className="rounded-lg border border-border-subtle p-5">
            {" "}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              {" "}
              <Leaf size={20} />{" "}
            </div>{" "}
            <h3 className="mt-4 font-semibold text-text-primary">
              {" "}
              Crop Analysis{" "}
            </h3>{" "}
            <p className="mt-1 text-sm text-text-secondary">
              {" "}
              NDVI, vegetation health, and crop condition analysis.{" "}
            </p>{" "}
            <span className="mt-4 inline-block text-xs font-medium text-amber-600">
              {" "}
              Pending Integration{" "}
            </span>{" "}
          </div>{" "}
          <div className="rounded-lg border border-border-subtle p-5">
            {" "}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              {" "}
              <Building2 size={20} />{" "}
            </div>{" "}
            <h3 className="mt-4 font-semibold text-text-primary">
              {" "}
              Urban Analysis{" "}
            </h3>{" "}
            <p className="mt-1 text-sm text-text-secondary">
              {" "}
              NDBI, built-up area, and urban land-use analysis.{" "}
            </p>{" "}
            <span className="mt-4 inline-block text-xs font-medium text-amber-600">
              {" "}
              Pending Integration{" "}
            </span>{" "}
          </div>{" "}
          <div className="rounded-lg border border-border-subtle p-5">
            {" "}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
              {" "}
              <AlertTriangle size={20} />{" "}
            </div>{" "}
            <h3 className="mt-4 font-semibold text-text-primary">
              {" "}
              Disaster Analysis{" "}
            </h3>{" "}
            <p className="mt-1 text-sm text-text-secondary">
              {" "}
              Change detection and affected-area analysis.{" "}
            </p>{" "}
            <span className="mt-4 inline-block text-xs font-medium text-amber-600">
              {" "}
              Pending Integration{" "}
            </span>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Report Preview */}{" "}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
        {" "}
        <div className="flex items-center justify-between">
          {" "}
          <div>
            {" "}
            <h2 className="text-lg font-semibold text-text-primary">
              {" "}
              Report Preview{" "}
            </h2>{" "}
            <p className="mt-1 text-sm text-text-secondary">
              {" "}
              Final report generated from the complete processing workflow.{" "}
            </p>{" "}
          </div>{" "}
          <button
            disabled
            className="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-surface-secondary px-4 py-2.5 text-sm font-medium text-text-muted"
          >
            {" "}
            <Download size={16} /> Download PDF{" "}
          </button>{" "}
        </div>{" "}
        <div className="mt-5 flex h-48 items-center justify-center rounded-xl border border-dashed border-border-subtle bg-bg-surface-secondary">
          {" "}
          <div className="text-center">
            {" "}
            <FileText size={30} className="mx-auto mb-3 text-text-muted" />{" "}
            <p className="font-medium text-text-secondary">
              {" "}
              Report Preview Placeholder{" "}
            </p>{" "}
            <p className="mt-1 max-w-md text-sm text-text-muted">
              {" "}
              The final PDF/report content will appear here once report
              generation is connected to the backend.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Integration Note */}{" "}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        {" "}
        <h3 className="font-semibold text-blue-900">
          {" "}
          Report Integration Ready{" "}
        </h3>{" "}
        <p className="mt-1 text-sm leading-6 text-blue-700">
          {" "}
          The frontend is connected to both report endpoints. Later, the backend
          can generate a PDF containing super-resolution results, validation
          metrics, GIS information, and downstream analysis without requiring
          changes to this page.{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
