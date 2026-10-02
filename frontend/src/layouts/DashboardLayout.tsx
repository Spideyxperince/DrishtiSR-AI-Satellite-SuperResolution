import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
interface DashboardLayoutProps {
  children: React.ReactNode;
}
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");
  return (
    <div className="min-h-screen bg-bg-surface-secondary text-text-primary transition-colors duration-300">
      {" "}
      {/* Sidebar */}{" "}
      {sidebarOpen && (
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
      )}{" "}
      {/* Topbar */}{" "}
      <Topbar
        sidebarOpen={sidebarOpen}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />{" "}
      {/* Main */}{" "}
      <main
        className={`min-h-screen pt-16 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}
      >
        {" "}
        <div className="p-6"> {children} </div>{" "}
      </main>{" "}
    </div>
  );
}
