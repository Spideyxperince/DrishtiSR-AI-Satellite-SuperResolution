import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Input from "./pages/Input";
import SuperResolution from "./pages/SuperResolution";
import Results from "./pages/Results";
import Confidence from "./pages/Confidence";
import SpectralValidation from "./pages/SpectralValidation";
import GeographicCheck from "./pages/GeographicCheck";
import HallucinationCheck from "./pages/HallucinationCheck";
import CropAnalysis from "./pages/CropAnalysis";
import UrbanAnalysis from "./pages/UrbanAnalysis";
import DisasterAnalysis from "./pages/DisasterAnalysis";
import Map from "./pages/Map";
import Reports from "./pages/Reports";
import Models from "./pages/Models";
import Settings from "./pages/Settings";
function App() {
  return (
    <DashboardLayout>
      {" "}
      <Routes>
        {" "}
        <Route path="/" element={<Dashboard />} />{" "}
        <Route path="/input" element={<Input />} />{" "}
        <Route path="/super-resolution" element={<SuperResolution />} />{" "}
        <Route path="/results" element={<Results />} />{" "}
        <Route path="/validation/confidence" element={<Confidence />} />{" "}
        <Route path="/validation/spectral" element={<SpectralValidation />} />{" "}
        <Route path="/validation/geographic" element={<GeographicCheck />} />{" "}
        <Route
          path="/validation/hallucination"
          element={<HallucinationCheck />}
        />{" "}
        <Route path="/analysis/crop" element={<CropAnalysis />} />{" "}
        <Route path="/analysis/urban" element={<UrbanAnalysis />} />{" "}
        <Route path="/analysis/disaster" element={<DisasterAnalysis />} />{" "}
        <Route path="/map" element={<Map />} />{" "}
        <Route path="/reports" element={<Reports />} />{" "}
        <Route path="/models" element={<Models />} />{" "}
        <Route path="/settings" element={<Settings />} />{" "}
      </Routes>{" "}
    </DashboardLayout>
  );
}
export default App;
