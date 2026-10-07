import { useState } from "react";
import { Upload, FileImage, X, CheckCircle, Loader2 } from "lucide-react";
import { setCurrentFile, setProcessedFile } from "../services/projectState";
import {
  uploadSatelliteImage,
  preprocessSatelliteImage,
  wakeBackend,
} from "../services/api";
interface RasterMetadata {
  width: number;
  height: number;
  band_count: number;
  crs: string;
  transform: number[];
  bounds: { left: number; bottom: number; right: number; top: number };
  resolution: { x: number; y: number };
  dtype: string;
}
export default function Input() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [metadata, setMetadata] = useState<RasterMetadata | null>(null);
  const [preprocessing, setPreprocessing] = useState(false);
  const [preprocessSuccess, setPreprocessSuccess] = useState(false);
  const [preprocessError, setPreprocessError] = useState("");
  const handleFile = (selectedFile: File) => {
    const isTiff =
      selectedFile.name.toLowerCase().endsWith(".tif") ||
      selectedFile.name.toLowerCase().endsWith(".tiff");
    const isZip = selectedFile.name.toLowerCase().endsWith(".zip");
    if (!isTiff && !isZip) {
      alert("Please upload a GeoTIFF (.tif/.tiff) or Sentinel-2 ZIP file.");
      return;
    }
    setFile(selectedFile);
    setUploadSuccess(false);
    setUploadError("");
    setMetadata(null);
    setPreprocessSuccess(false);
    setPreprocessError("");
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };
  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      setUploadSuccess(false);
      setUploadError("");
      await wakeBackend();
      const result = await uploadSatelliteImage(file);
      setCurrentFile(file.name);
      setMetadata(result.metadata);
      setUploadSuccess(true);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };
    const handlePreprocess = async () => {
    if (!file) return;
    try {
      setPreprocessing(true);
      setPreprocessSuccess(false);
      setPreprocessError("");
      await wakeBackend();
      try {
        await preprocessSatelliteImage(file.name);
      } catch (error) {
        // The free server forgets files when it restarts: upload again and retry
        if (error instanceof Error && error.message.includes("File not found")) {
          await uploadSatelliteImage(file);
          await preprocessSatelliteImage(file.name);
        } else {
          throw error;
        }
      }
      setProcessedFile(
        `${file.name.replace(/\.(tif|tiff)$/i, "")}_processed.tif`,
      );
      setPreprocessSuccess(true);
    } catch (error) {
      setPreprocessError(
        error instanceof Error ? error.message : "Preprocessing failed",
      );
    } finally {
      setPreprocessing(false);
    }
  };
  return (
    <div className="space-y-6">
      {" "}
      {/* Header */}{" "}
      <div>
        {" "}
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {" "}
          DATA INPUT{" "}
        </p>{" "}
        <h1 className="mt-1 text-2xl font-bold text-text-primary ">
          {" "}
          Sentinel-2 Input{" "}
        </h1>{" "}
        <p className="mt-2 text-sm text-text-secondary dark:text-text-muted">
          {" "}
          Upload Sentinel-2 satellite imagery for super-resolution
          processing.{" "}
        </p>{" "}
      </div>{" "}
      {/* Upload Card */}{" "}
      <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-sm dark:bg-bg-surface">
        {" "}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex min-h-[320px] flex-col items-center justify-center rounded-xl border-2 border-dashed transition ${isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "border-border-subtle bg-bg-surface-secondary "}`}
        >
          {" "}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50">
            {" "}
            <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />{" "}
          </div>{" "}
          <h2 className="mt-5 text-lg font-semibold text-text-primary ">
            {" "}
            Upload Sentinel-2 Imagery{" "}
          </h2>{" "}
          <p className="mt-2 text-sm text-text-secondary dark:text-text-muted">
            {" "}
            Drag and drop your satellite image here{" "}
          </p>{" "}
          <p className="mt-1 text-xs text-text-muted">
            {" "}
            Supported: GeoTIFF (.tif, .tiff) or Sentinel-2 ZIP{" "}
          </p>{" "}
          <label className="mt-6 cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
            {" "}
            Choose File{" "}
            <input
              type="file"
              accept=".tif,.tiff,.zip"
              className="hidden"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  handleFile(selectedFile);
                }
              }}
            />{" "}
          </label>{" "}
        </div>{" "}
      </div>{" "}
      {/* Selected File */}{" "}
      {file && (
        <div className="rounded-2xl border border-border-subtle bg-bg-surface p-5 shadow-sm dark:bg-bg-surface">
          {" "}
          {/* File Information */}{" "}
          <div className="flex items-center justify-between">
            {" "}
            <div className="flex items-center gap-4">
              {" "}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50">
                {" "}
                <FileImage className="h-6 w-6 text-blue-600 dark:text-blue-400" />{" "}
              </div>{" "}
              <div>
                {" "}
                <p className="text-sm font-semibold text-text-primary ">
                  {" "}
                  {file.name}{" "}
                </p>{" "}
                <p className="mt-1 text-xs text-text-secondary dark:text-text-muted">
                  {" "}
                  {(file.size / (1024 * 1024)).toFixed(2)} MB{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <button
              onClick={() => {
                setFile(null);
                setUploadSuccess(false);
                setUploadError("");
                setMetadata(null);
                setPreprocessSuccess(false);
                setPreprocessError("");
              }}
              className=" rounded-lg p-2 text-text-muted hover:bg-bg-surface-secondary hover:text-text-secondary dark:hover:bg-slate-800 dark:hover:text-slate-200 "
            >
              {" "}
              <X className="h-5 w-5" />{" "}
            </button>{" "}
          </div>{" "}
          {/* Info */}{" "}
          <div className="mt-5 rounded-lg bg-amber-50 px-4 py-3 dark:bg-amber-950/30">
            {" "}
            <p className="text-sm text-amber-700 dark:text-amber-300">
              {" "}
              File selected. Ready to upload to the processing server.{" "}
            </p>{" "}
          </div>{" "}
          {/* Upload Button */}{" "}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {" "}
            {uploading ? (
              <>
                {" "}
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading...{" "}
              </>
            ) : (
              <>
                {" "}
                <Upload className="h-4 w-4" /> Upload to Server{" "}
              </>
            )}{" "}
          </button>{" "}
          {/* Upload Success */}{" "}
          {uploadSuccess && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300">
              {" "}
              <CheckCircle className="h-4 w-4" /> File uploaded
              successfully!{" "}
            </div>
          )}{" "}
          {/* Preprocess */}{" "}
          {uploadSuccess && (
            <>
              {" "}
              <button
                onClick={handlePreprocess}
                disabled={preprocessing}
                className=" mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-bg-surface px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-slate-600 "
              >
                {" "}
                {preprocessing ? (
                  <>
                    {" "}
                    <Loader2 className="h-4 w-4 animate-spin" />{" "}
                    Preprocessing...{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <CheckCircle className="h-4 w-4" /> Preprocess Image{" "}
                  </>
                )}{" "}
              </button>{" "}
              {preprocessSuccess && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300">
                  {" "}
                  <CheckCircle className="h-4 w-4" /> Image preprocessing
                  completed successfully!{" "}
                </div>
              )}{" "}
              {preprocessError && (
                <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
                  {" "}
                  {preprocessError}{" "}
                </div>
              )}{" "}
            </>
          )}{" "}
          {/* Upload Error */}{" "}
          {uploadError && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
              {" "}
              {uploadError}{" "}
            </div>
          )}{" "}
        </div>
      )}{" "}
      {/* Metadata Card */}{" "}
      {metadata && (
        <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-sm dark:bg-bg-surface">
          {" "}
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {" "}
            RASTER METADATA{" "}
          </p>{" "}
          <h2 className="mt-1 text-lg font-semibold text-text-primary ">
            {" "}
            Satellite Image Information{" "}
          </h2>{" "}
          <p className="mt-1 text-sm text-text-secondary dark:text-text-muted">
            {" "}
            Metadata extracted from the uploaded GeoTIFF.{" "}
          </p>{" "}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {" "}
            {/* Resolution */}{" "}
            <div className="rounded-xl bg-bg-surface-secondary p-4 ">
              {" "}
              <p className="text-xs font-medium text-text-secondary dark:text-text-muted">
                {" "}
                Resolution{" "}
              </p>{" "}
              <p className="mt-1 text-lg font-semibold text-text-primary ">
                {" "}
                {metadata.resolution.x} × {metadata.resolution.y} m{" "}
              </p>{" "}
            </div>{" "}
            {/* Dimensions */}{" "}
            <div className="rounded-xl bg-bg-surface-secondary p-4 ">
              {" "}
              <p className="text-xs font-medium text-text-secondary dark:text-text-muted">
                {" "}
                Image Dimensions{" "}
              </p>{" "}
              <p className="mt-1 text-lg font-semibold text-text-primary ">
                {" "}
                {metadata.width} × {metadata.height}{" "}
              </p>{" "}
            </div>{" "}
            {/* Bands */}{" "}
            <div className="rounded-xl bg-bg-surface-secondary p-4 ">
              {" "}
              <p className="text-xs font-medium text-text-secondary dark:text-text-muted">
                {" "}
                Number of Bands{" "}
              </p>{" "}
              <p className="mt-1 text-lg font-semibold text-text-primary ">
                {" "}
                {metadata.band_count}{" "}
              </p>{" "}
            </div>{" "}
            {/* CRS */}{" "}
            <div className="rounded-xl bg-bg-surface-secondary p-4 ">
              {" "}
              <p className="text-xs font-medium text-text-secondary dark:text-text-muted">
                {" "}
                Coordinate Reference System{" "}
              </p>{" "}
              <p className="mt-1 text-lg font-semibold text-text-primary ">
                {" "}
                {metadata.crs}{" "}
              </p>{" "}
            </div>{" "}
            {/* Data Type */}{" "}
            <div className="rounded-xl bg-bg-surface-secondary p-4 ">
              {" "}
              <p className="text-xs font-medium text-text-secondary dark:text-text-muted">
                {" "}
                Data Type{" "}
              </p>{" "}
              <p className="mt-1 text-lg font-semibold text-text-primary ">
                {" "}
                {metadata.dtype}{" "}
              </p>{" "}
            </div>{" "}
            {/* Geographic Bounds */}{" "}
            <div className="rounded-xl bg-bg-surface-secondary p-4 ">
              {" "}
              <p className="text-xs font-medium text-text-secondary dark:text-text-muted">
                {" "}
                Geographic Bounds{" "}
              </p>{" "}
              <p className="mt-1 text-sm font-semibold text-text-primary ">
                {" "}
                {metadata.bounds.left.toFixed(4)},{" "}
                {metadata.bounds.bottom.toFixed(4)}{" "}
              </p>{" "}
              <p className="text-sm font-semibold text-text-primary ">
                {" "}
                {metadata.bounds.right.toFixed(4)},{" "}
                {metadata.bounds.top.toFixed(4)}{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
}
