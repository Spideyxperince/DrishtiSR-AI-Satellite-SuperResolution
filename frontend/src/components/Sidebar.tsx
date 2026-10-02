import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Brain,
  ChevronDown,
  FileText,
  Gauge,
  Image,
  Layers,
  Map,
  Settings,
  Satellite,
  ShieldCheck,
  Sprout,
  Building2,
  Waves,
} from "lucide-react";
interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}
const menuItems = [
  { label: "Dashboard", icon: Gauge },
  { label: "Sentinel-2 Input", icon: Satellite },
  { label: "AI Super Resolution", icon: Brain },
];
const validationItems = [
  { label: "Enhanced Image", icon: Image },
  { label: "Confidence Map", icon: ShieldCheck },
  { label: "Spectral Validation", icon: BarChart3 },
  { label: "Geographic Check", icon: Map },
  { label: "Hallucination Check", icon: ShieldCheck },
];
const analysisItems = [
  { label: "Crop Analysis", icon: Sprout },
  { label: "Urban Analysis", icon: Building2 },
  { label: "Disaster Analysis", icon: Waves },
];
export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const navigate = useNavigate();
  const navigateTo = (page: string, path: string) => {
    setActivePage(page);
    navigate(path);
  };
  return (
    <aside className=" fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border-subtle bg-bg-surface transition-colors duration-300 ">
      {" "}
      {/* Logo */}{" "}
      <div className=" flex h-20 shrink-0 items-center gap-3 border-b border-border-subtle px-6 ">
        {" "}
        <div className=" flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 ">
          {" "}
          <Satellite className="h-6 w-6 text-blue-600 dark:text-blue-400" />{" "}
        </div>{" "}
        <div>
          {" "}
          <h1 className="text-lg font-bold tracking-tight text-text-primary ">
            {" "}
            SIH{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {" "}
              26142{" "}
            </span>{" "}
          </h1>{" "}
          <p className="text-[10px] text-text-secondary dark:text-text-muted">
            {" "}
            AI Satellite Super Resolution{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {/* Navigation */}{" "}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {" "}
        {/* Main */}{" "}
        <div className="space-y-1">
          {" "}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.label === "Dashboard") {
                    navigateTo(item.label, "/");
                  }
                  if (item.label === "Sentinel-2 Input") {
                    navigateTo(item.label, "/input");
                  }
                  if (item.label === "AI Super Resolution") {
                    navigateTo(item.label, "/super-resolution");
                  }
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400" : "text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"}`}
              >
                {" "}
                <Icon className="h-[18px] w-[18px]" /> {item.label}{" "}
              </button>
            );
          })}{" "}
        </div>{" "}
        {/* Results & Validation */}{" "}
        <div className="mt-7">
          {" "}
          <div className="mb-2 flex items-center justify-between px-3">
            {" "}
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {" "}
              Results & Validation{" "}
            </span>{" "}
            <ChevronDown className="h-3.5 w-3.5 text-text-muted" />{" "}
          </div>{" "}
          <div className="space-y-1">
            {" "}
            {validationItems.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.label === "Enhanced Image") {
                      navigateTo(item.label, "/results");
                    }
                    if (item.label === "Confidence Map") {
                      navigateTo(item.label, "/validation/confidence");
                    }
                    if (item.label === "Spectral Validation") {
                      navigateTo(item.label, "/validation/spectral");
                    }
                    if (item.label === "Geographic Check") {
                      navigateTo(item.label, "/validation/geographic");
                    }
                    if (item.label === "Hallucination Check") {
                      navigateTo(item.label, "/validation/hallucination");
                    }
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400" : "text-text-secondary hover:bg-bg-surface-secondary hover:text-text-primary dark:text-text-muted dark:hover:bg-bg-surface dark:hover:text-slate-100"}`}
                >
                  {" "}
                  <Icon className="h-4 w-4" /> {item.label}{" "}
                </button>
              );
            })}{" "}
          </div>{" "}
        </div>{" "}
        {/* Downstream Analysis */}{" "}
        <div className="mt-7">
          {" "}
          <div className="mb-2 flex items-center justify-between px-3">
            {" "}
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {" "}
              Downstream Analysis{" "}
            </span>{" "}
            <ChevronDown className="h-3.5 w-3.5 text-text-muted" />{" "}
          </div>{" "}
          <div className="space-y-1">
            {" "}
            {analysisItems.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.label === "Crop Analysis") {
                      navigateTo(item.label, "/analysis/crop");
                    }
                    if (item.label === "Urban Analysis") {
                      navigateTo(item.label, "/analysis/urban");
                    }
                    if (item.label === "Disaster Analysis") {
                      navigateTo(item.label, "/analysis/disaster");
                    }
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400" : "text-text-secondary hover:bg-bg-surface-secondary hover:text-text-primary dark:text-text-muted dark:hover:bg-bg-surface dark:hover:text-slate-100"}`}
                >
                  {" "}
                  <Icon className="h-4 w-4" /> {item.label}{" "}
                </button>
              );
            })}{" "}
          </div>{" "}
        </div>{" "}
        {/* Other */}{" "}
        <div className="mt-7 space-y-1">
          {" "}
          {/* Map */}{" "}
          <button
            onClick={() => navigateTo("Map & GIS", "/map")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${activePage === "Map & GIS" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400" : "text-text-secondary hover:bg-bg-surface-secondary hover:text-text-primary dark:text-text-muted dark:hover:bg-bg-surface dark:hover:text-slate-100"}`}
          >
            {" "}
            <Layers className="h-[18px] w-[18px]" /> Map & GIS{" "}
          </button>{" "}
          {/* Reports */}{" "}
          <button
            onClick={() => navigateTo("Reports", "/reports")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${activePage === "Reports" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400" : "text-text-secondary hover:bg-bg-surface-secondary hover:text-text-primary dark:text-text-muted dark:hover:bg-bg-surface dark:hover:text-slate-100"}`}
          >
            {" "}
            <FileText className="h-[18px] w-[18px]" /> Reports{" "}
          </button>{" "}
          {/* Models */}{" "}
          <button
            onClick={() => navigateTo("Models & Experiments", "/models")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${activePage === "Models & Experiments" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400" : "text-text-secondary hover:bg-bg-surface-secondary hover:text-text-primary dark:text-text-muted dark:hover:bg-bg-surface dark:hover:text-slate-100"}`}
          >
            {" "}
            <BarChart3 className="h-[18px] w-[18px]" /> Models &
            Experiments{" "}
          </button>{" "}
          {/* Settings */}{" "}
          <button
            onClick={() => navigateTo("Settings", "/settings")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${activePage === "Settings" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400" : "text-text-secondary hover:bg-bg-surface-secondary hover:text-text-primary dark:text-text-muted dark:hover:bg-bg-surface dark:hover:text-slate-100"}`}
          >
            {" "}
            <Settings className="h-[18px] w-[18px]" /> Settings{" "}
          </button>{" "}
        </div>{" "}
      </nav>{" "}
    </aside>
  );
}
