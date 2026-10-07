import { withSession } from "./session";

const API_URL = import.meta.env.VITE_API_URL;

async function apiRequest(endpoint: string, options?: RequestInit) {
  let response: Response;
  try {
    response = await fetch(withSession(`${API_URL}${endpoint}`), options);
  } catch {
    throw new Error(
      "Cannot reach the server. It may be waking up - please wait a minute and try again.",
    );
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: "Something went wrong",
    }));
    throw new Error(error.detail || "API request failed");
  }
  return response.json();
}

// Wakes the free Render server (can take up to ~1 minute)
export async function wakeBackend() {
  for (let i = 0; i < 15; i++) {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) return true;
    } catch {
      // server still asleep, try again
    }
    await new Promise((resolve) => setTimeout(resolve, 4000));
  }
  return false;
}

export async function checkBackendHealth() {
  return apiRequest("/health");
}

// ===============================
// Upload
// ===============================
export async function uploadSatelliteImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest("/api/upload/", {
    method: "POST",
    body: formData,
  });
}

// ===============================
// Preprocessing
// ===============================
export async function preprocessSatelliteImage(filename: string) {
  return apiRequest(`/api/upload/preprocess/${encodeURIComponent(filename)}`, {
    method: "POST",
  });
}

// ===============================
// Processing
// ===============================
export async function getProcessingStatus() {
  return apiRequest("/api/processing/status");
}

export async function startSuperResolution(filename: string) {
  return apiRequest("/api/processing/super-resolution", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename }),
  });
}

export async function getProcessingResults() {
  return apiRequest("/api/processing/results");
}

// ===============================
// Validation
// ===============================
export async function getConfidence() {
  return apiRequest("/api/validation/confidence");
}

export async function getSpectralValidation() {
  return apiRequest("/api/validation/spectral");
}

export async function getGeographicValidation() {
  return apiRequest("/api/validation/geographic");
}

export async function getHallucinationCheck() {
  return apiRequest("/api/validation/hallucination");
}

// ===============================
// Analysis
// ===============================
export async function getCropAnalysis() {
  return apiRequest("/api/analysis/crop");
}

export async function getUrbanAnalysis() {
  return apiRequest("/api/analysis/urban");
}

export async function getDisasterAnalysis() {
  return apiRequest("/api/analysis/disaster");
}

// ===============================
// GIS
// ===============================
export async function getGISData() {
  return apiRequest("/api/gis/map");
}

// ===============================
// Reports
// ===============================
export async function getReports() {
  return apiRequest("/api/reports/");
}

export async function generateReport() {
  return apiRequest("/api/reports/generate", {
    method: "POST",
  });
}

// ===============================
// Models
// ===============================
export async function getModels() {
  return apiRequest("/api/models/");
}

export async function getModel(modelName: string) {
  return apiRequest(`/api/models/${encodeURIComponent(modelName)}`);
}
