import { useState } from "react";
import {
  Brain,
  CheckCircle2,
  Clock3,
  BarChart3,
  RefreshCw,
  Zap,
} from "lucide-react";
import { getModels } from "../services/api";
interface Model {
  name: string;
  type: string;
  status: string;
}
export default function Models() {
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [error, setError] = useState("");
  const handleLoadModels = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getModels();
      setModels(result.models || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load models");
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
          <div className="mb-2 flex items-center gap-2 text-purple-600">
            {" "}
            <Brain size={18} />{" "}
            <span className="text-sm font-medium">
              {" "}
              AI & Model Management{" "}
            </span>{" "}
          </div>{" "}
          <h1 className="text-2xl font-bold text-text-primary">
            {" "}
            Models & Experiments{" "}
          </h1>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Manage super-resolution models and compare their performance on
            satellite imagery.{" "}
          </p>{" "}
        </div>{" "}
        <button
          onClick={handleLoadModels}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-bg-surface px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {" "}
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
          {loading ? "Loading..." : "Load Models"}{" "}
        </button>{" "}
      </div>{" "}
      {/* Error */}{" "}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {" "}
          {error}{" "}
        </div>
      )}{" "}
      {/* Model API Status */}{" "}
      {models.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {" "}
          Model information loaded successfully.{" "}
        </div>
      )}{" "}
      {/* Model Cards */}{" "}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {" "}
        {/* Baseline */}{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
          {" "}
          <div className="flex items-start justify-between">
            {" "}
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-bg-surface-secondary text-text-secondary">
              {" "}
              <BarChart3 size={22} />{" "}
            </div>{" "}
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              {" "}
              Baseline{" "}
            </span>{" "}
          </div>{" "}
          <h2 className="mt-5 text-lg font-semibold text-text-primary">
            {" "}
            Bicubic{" "}
          </h2>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Traditional interpolation baseline used for comparing AI-based
            super-resolution performance.{" "}
          </p>{" "}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {" "}
            <div className="rounded-lg bg-bg-surface-secondary p-3">
              {" "}
              <p className="text-xs text-text-muted"> Input </p>{" "}
              <p className="mt-1 font-semibold text-text-secondary">
                {" "}
                10m{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-lg bg-bg-surface-secondary p-3">
              {" "}
              <p className="text-xs text-text-muted"> Target </p>{" "}
              <p className="mt-1 font-semibold text-text-secondary">
                {" "}
                ≤4m{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-5 flex items-center gap-2 text-sm text-green-600">
            {" "}
            <CheckCircle2 size={16} /> Available{" "}
          </div>{" "}
        </div>{" "}
        {/* AI Model */}{" "}
        <div className="rounded-xl border border-purple-200 bg-bg-surface p-6">
          {" "}
          <div className="flex items-start justify-between">
            {" "}
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              {" "}
              <Brain size={22} />{" "}
            </div>{" "}
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              {" "}
              Deep Learning{" "}
            </span>{" "}
          </div>{" "}
          <h2 className="mt-5 text-lg font-semibold text-text-primary">
            {" "}
            AI Super Resolution{" "}
          </h2>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Main deep-learning model for generating enhanced satellite
            imagery.{" "}
          </p>{" "}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {" "}
            <div className="rounded-lg bg-bg-surface-secondary p-3">
              {" "}
              <p className="text-xs text-text-muted"> Input </p>{" "}
              <p className="mt-1 font-semibold text-text-secondary">
                {" "}
                10m{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-lg bg-bg-surface-secondary p-3">
              {" "}
              <p className="text-xs text-text-muted"> Target </p>{" "}
              <p className="mt-1 font-semibold text-text-secondary">
                {" "}
                ≤4m{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-5 flex items-center gap-2 text-sm text-amber-600">
            {" "}
            <Clock3 size={16} /> Pending Integration{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Loaded Models */}{" "}
      {models.length > 0 && (
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
          {" "}
          <div className="mb-5">
            {" "}
            <h2 className="text-lg font-semibold text-text-primary">
              {" "}
              Backend Models{" "}
            </h2>{" "}
            <p className="mt-1 text-sm text-text-secondary">
              {" "}
              Models currently registered with the backend.{" "}
            </p>{" "}
          </div>{" "}
          <div className="overflow-x-auto">
            {" "}
            <table className="w-full text-left">
              {" "}
              <thead>
                {" "}
                <tr className="border-b border-border-subtle text-sm text-text-secondary">
                  {" "}
                  <th className="px-4 py-3 font-medium"> Model </th>{" "}
                  <th className="px-4 py-3 font-medium"> Type </th>{" "}
                  <th className="px-4 py-3 font-medium"> Status </th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody>
                {" "}
                {models.map((model) => (
                  <tr
                    key={model.name}
                    className="border-b border-slate-100 last:border-0"
                  >
                    {" "}
                    <td className="px-4 py-4 font-medium text-text-secondary">
                      {" "}
                      {model.name}{" "}
                    </td>{" "}
                    <td className="px-4 py-4 text-sm text-text-secondary">
                      {" "}
                      {model.type}{" "}
                    </td>{" "}
                    <td className="px-4 py-4">
                      {" "}
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${model.status === "available" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}
                      >
                        {" "}
                        {model.status}{" "}
                      </span>{" "}
                    </td>{" "}
                  </tr>
                ))}{" "}
              </tbody>{" "}
            </table>{" "}
          </div>{" "}
        </div>
      )}{" "}
      {/* Experiment Comparison */}{" "}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6">
        {" "}
        <div className="mb-5">
          {" "}
          <h2 className="text-lg font-semibold text-text-primary">
            {" "}
            Experiment Comparison{" "}
          </h2>{" "}
          <p className="mt-1 text-sm text-text-secondary">
            {" "}
            Compare model quality using image reconstruction and spectral
            metrics.{" "}
          </p>{" "}
        </div>{" "}
        <div className="overflow-x-auto">
          {" "}
          <table className="w-full min-w-[650px] text-left">
            {" "}
            <thead>
              {" "}
              <tr className="border-b border-border-subtle text-sm text-text-secondary">
                {" "}
                <th className="px-4 py-3 font-medium"> Model </th>{" "}
                <th className="px-4 py-3 font-medium"> PSNR </th>{" "}
                <th className="px-4 py-3 font-medium"> SSIM </th>{" "}
                <th className="px-4 py-3 font-medium"> SAM </th>{" "}
                <th className="px-4 py-3 font-medium"> Status </th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody>
              {" "}
              <tr className="border-b border-slate-100">
                {" "}
                <td className="px-4 py-4 font-medium text-text-secondary">
                  {" "}
                  Bicubic{" "}
                </td>{" "}
                <td className="px-4 py-4 text-text-muted"> -- </td>{" "}
                <td className="px-4 py-4 text-text-muted"> -- </td>{" "}
                <td className="px-4 py-4 text-text-muted"> -- </td>{" "}
                <td className="px-4 py-4">
                  {" "}
                  <span className="text-xs font-medium text-green-600">
                    {" "}
                    Baseline{" "}
                  </span>{" "}
                </td>{" "}
              </tr>{" "}
              <tr>
                {" "}
                <td className="px-4 py-4 font-medium text-text-secondary">
                  {" "}
                  AI Super Resolution{" "}
                </td>{" "}
                <td className="px-4 py-4 text-text-muted"> -- </td>{" "}
                <td className="px-4 py-4 text-text-muted"> -- </td>{" "}
                <td className="px-4 py-4 text-text-muted"> -- </td>{" "}
                <td className="px-4 py-4">
                  {" "}
                  <span className="text-xs font-medium text-amber-600">
                    {" "}
                    Pending{" "}
                  </span>{" "}
                </td>{" "}
              </tr>{" "}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
      </div>{" "}
      {/* Experiment Metrics */}{" "}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <Zap size={20} className="text-blue-600" />{" "}
            <span className="text-sm text-text-secondary">
              {" "}
              Processing Time{" "}
            </span>{" "}
          </div>{" "}
          <p className="mt-3 text-2xl font-bold text-text-primary"> -- </p>{" "}
          <p className="mt-1 text-xs text-text-muted">
            {" "}
            Will be measured during inference{" "}
          </p>{" "}
        </div>{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <BarChart3 size={20} className="text-purple-600" />{" "}
            <span className="text-sm text-text-secondary"> PSNR </span>{" "}
          </div>{" "}
          <p className="mt-3 text-2xl font-bold text-text-primary"> -- </p>{" "}
          <p className="mt-1 text-xs text-text-muted">
            {" "}
            Peak Signal-to-Noise Ratio{" "}
          </p>{" "}
        </div>{" "}
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <BarChart3 size={20} className="text-green-600" />{" "}
            <span className="text-sm text-text-secondary"> SSIM </span>{" "}
          </div>{" "}
          <p className="mt-3 text-2xl font-bold text-text-primary"> -- </p>{" "}
          <p className="mt-1 text-xs text-text-muted">
            {" "}
            Structural Similarity Index{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {/* Integration Note */}{" "}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        {" "}
        <h3 className="font-semibold text-blue-900">
          {" "}
          Model Integration Ready{" "}
        </h3>{" "}
        <p className="mt-1 text-sm leading-6 text-blue-700">
          {" "}
          The frontend is connected to the backend model API. Your teammates can
          register their trained CNN, GAN, transformer, diffusion, or other
          super-resolution model through the backend without changing this
          page.{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
