import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Menu,
  Moon,
  Satellite,
  Sun,
  X,
} from "lucide-react";
import {
  getCurrentFile,
  getProcessedFile,
  subscribe,
} from "../services/projectState";
interface TopbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}
interface Notification {
  id: number;
  title: string;
  message: string;
  type: "success" | "info";
  read: boolean;
}
export default function Topbar({ onMenuClick, sidebarOpen }: TopbarProps) {
  const [isDark, setIsDark] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<number[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentFile, setCurrentFileState] = useState(getCurrentFile());
  const [processedFile, setProcessedFileState] = useState(getProcessedFile());
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
    const updateState = () => {
      setCurrentFileState(getCurrentFile());
      setProcessedFileState(getProcessedFile());
    };
    updateState();
    const unsubscribe = subscribe(updateState);
    return () => unsubscribe();
  }, []);
  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };
  const derivedNotifications: Notification[] = [];
  if (currentFile) {
    derivedNotifications.push({
      id: 1,
      title: "File uploaded",
      message: currentFile,
      type: "info",
      read: readNotificationIds.includes(1),
    });
  }
  if (processedFile) {
    derivedNotifications.push({
      id: 2,
      title: "Processing completed",
      message: processedFile,
      type: "success",
      read: readNotificationIds.includes(2),
    });
  }
  if (derivedNotifications.length === 0) {
    derivedNotifications.push({
      id: 3,
      title: "System ready",
      message: "No active processing job",
      type: "info",
      read: readNotificationIds.includes(3),
    });
  }
  const notifications = derivedNotifications;
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;
  const markAllNotificationsRead = () => {
    setReadNotificationIds(notifications.map((n) => n.id));
  };
  const clearNotifications = () => {
    markAllNotificationsRead();
    setShowNotifications(false);
  };
  const projectName = currentFile
    ? currentFile.replace(/\.(tif|tiff|zip)$/i, "")
    : "No Project";
  return (
    <header
      className={` fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border-subtle bg-bg-surface px-6 transition-all duration-300 ${sidebarOpen ? "left-64" : "left-0"} `}
    >
      {" "}
      {/* LEFT */}{" "}
      <div className="flex items-center gap-4">
        {" "}
        {/* Sidebar */}{" "}
        <button
          onClick={onMenuClick}
          title={sidebarOpen ? "Collapse sidebar" : "Open sidebar"}
          className=" rounded-lg p-2 text-text-secondary transition hover:bg-bg-surface-hover hover:text-text-primary "
        >
          {" "}
          <Menu className="h-5 w-5" />{" "}
        </button>{" "}
        <div className="h-6 w-px bg-slate-200 " /> {/* Project */}{" "}
        <div className=" flex items-center gap-3 rounded-lg border border-border-subtle px-4 py-2 text-sm ">
          {" "}
          <span className="text-text-secondary dark:text-text-muted">
            {" "}
            Project:{" "}
          </span>{" "}
          <span className="max-w-[220px] truncate font-semibold text-text-primary ">
            {" "}
            {projectName}{" "}
          </span>{" "}
          <ChevronDown className="h-4 w-4 text-text-muted" />{" "}
        </div>{" "}
      </div>{" "}
      {/* RIGHT */}{" "}
      <div className="flex items-center gap-2">
        {" "}
        {/* NOTIFICATIONS */}{" "}
        <div className="relative">
          {" "}
          <button
            onClick={() => {
              setShowNotifications((previous) => !previous);
              setShowHelp(false);
              setShowUserMenu(false);
            }}
            title="Notifications"
            className=" relative rounded-lg p-2.5 text-text-secondary transition hover:bg-bg-surface-hover hover:text-text-primary "
          >
            {" "}
            <Bell className="h-5 w-5" />{" "}
            {unreadCount > 0 && (
              <span className=" absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ">
                {" "}
                {unreadCount}{" "}
              </span>
            )}{" "}
          </button>{" "}
          {showNotifications && (
            <div className=" absolute right-0 top-12 w-80 overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface shadow-xl dark:bg-bg-surface ">
              {" "}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 ">
                {" "}
                <div>
                  {" "}
                  <p className="font-semibold text-text-primary ">
                    {" "}
                    Notifications{" "}
                  </p>{" "}
                  <p className="text-xs text-text-muted">
                    {" "}
                    {unreadCount} unread{" "}
                  </p>{" "}
                </div>{" "}
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {" "}
                  Mark all read{" "}
                </button>{" "}
              </div>{" "}
              <div className="max-h-80 overflow-y-auto">
                {" "}
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    {" "}
                    <Bell className="mx-auto h-6 w-6 text-slate-300 dark:text-text-secondary" />{" "}
                    <p className="mt-2 text-sm text-text-secondary dark:text-text-muted">
                      {" "}
                      No notifications{" "}
                    </p>{" "}
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={` border-b border-slate-100 px-4 py-3 ${!notification.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""} `}
                    >
                      {" "}
                      <div className="flex gap-3">
                        {" "}
                        <div className="mt-0.5">
                          {" "}
                          {notification.type === "success" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Satellite className="h-4 w-4 text-blue-500" />
                          )}{" "}
                        </div>{" "}
                        <div className="min-w-0">
                          {" "}
                          <p className="text-sm font-semibold text-text-primary ">
                            {" "}
                            {notification.title}{" "}
                          </p>{" "}
                          <p className="mt-1 text-xs leading-5 text-text-secondary dark:text-text-muted">
                            {" "}
                            {notification.message}{" "}
                          </p>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>
                  ))
                )}{" "}
              </div>{" "}
              {notifications.length > 0 && (
                <div className="border-t border-slate-100 p-2 ">
                  {" "}
                  <button
                    onClick={clearNotifications}
                    className=" flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-text-secondary hover:bg-bg-surface-secondary dark:text-text-muted dark:hover:bg-slate-800 "
                  >
                    {" "}
                    Clear notifications{" "}
                  </button>{" "}
                </div>
              )}{" "}
            </div>
          )}{" "}
        </div>{" "}
        {/* HELP */}{" "}
        <div className="relative">
          {" "}
          <button
            onClick={() => {
              setShowHelp((previous) => !previous);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            title="Help"
            className=" rounded-lg p-2.5 text-text-secondary transition hover:bg-bg-surface-hover hover:text-text-primary "
          >
            {" "}
            <HelpCircle className="h-5 w-5" />{" "}
          </button>{" "}
          {showHelp && (
            <div className=" absolute right-0 top-12 w-80 rounded-2xl border border-border-subtle bg-bg-surface p-5 shadow-xl dark:bg-bg-surface ">
              {" "}
              <div className="flex items-start justify-between">
                {" "}
                <div>
                  {" "}
                  <p className="font-semibold text-text-primary ">
                    {" "}
                    Help & Project Guide{" "}
                  </p>{" "}
                  <p className="mt-1 text-xs text-text-muted">
                    {" "}
                    SIH 26142{" "}
                  </p>{" "}
                </div>{" "}
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-text-muted hover:text-text-secondary dark:hover:text-slate-200"
                >
                  {" "}
                  <X className="h-4 w-4" />{" "}
                </button>{" "}
              </div>{" "}
              <div className="mt-4 space-y-3">
                {" "}
                <div>
                  {" "}
                  <p className="text-xs font-semibold text-text-secondary ">
                    {" "}
                    Input{" "}
                  </p>{" "}
                  <ul className="mt-1 list-disc pl-4 text-xs leading-5 text-text-secondary dark:text-text-muted">
                    {" "}
                    <li>Sentinel-2 GeoTIFF or supported Sentinel-2 ZIP</li>{" "}
                    <li>Input resolution: 10m</li>{" "}
                  </ul>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <p className="text-xs font-semibold text-text-secondary ">
                    {" "}
                    Processing{" "}
                  </p>{" "}
                  <ul className="mt-1 list-disc pl-4 text-xs leading-5 text-text-secondary dark:text-text-muted">
                    {" "}
                    <li>Preprocessing</li> <li>AI Super Resolution</li>{" "}
                    <li>Target output: up to ≤4m</li>{" "}
                  </ul>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <p className="text-xs font-semibold text-text-secondary ">
                    {" "}
                    Validation{" "}
                  </p>{" "}
                  <ul className="mt-1 list-disc pl-4 text-xs leading-5 text-text-secondary dark:text-text-muted">
                    {" "}
                    <li>Confidence</li> <li>Spectral Validation</li>{" "}
                    <li>Geographic Fidelity</li>{" "}
                    <li>Hallucination Detection</li>{" "}
                  </ul>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <p className="text-xs font-semibold text-text-secondary ">
                    {" "}
                    Analysis{" "}
                  </p>{" "}
                  <ul className="mt-1 list-disc pl-4 text-xs leading-5 text-text-secondary dark:text-text-muted">
                    {" "}
                    <li>Crop / NDVI</li> <li>Urban / NDBI</li>{" "}
                    <li>Disaster / Change Detection</li>{" "}
                  </ul>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
        {/* THEME */}{" "}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className=" rounded-lg p-2.5 text-text-secondary transition-all duration-200 hover:bg-bg-surface-hover hover:text-text-primary "
        >
          {" "}
          {isDark ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}{" "}
        </button>{" "}
        <div className="ml-2 h-8 w-px bg-slate-200 " /> {/* USER */}{" "}
        <div className="relative">
          {" "}
          <button
            onClick={() => {
              setShowUserMenu((previous) => !previous);
              setShowNotifications(false);
              setShowHelp(false);
            }}
            className=" ml-2 flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-bg-surface-secondary dark:hover:bg-slate-800 "
          >
            {" "}
            <div className=" flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 ">
              {" "}
              P{" "}
            </div>{" "}
            <div className="hidden text-left sm:block">
              {" "}
              <p className="text-xs font-semibold text-text-primary ">
                {" "}
                Project User{" "}
              </p>{" "}
              <p className="text-[10px] text-text-muted"> SIH 26142 </p>{" "}
            </div>{" "}
            <ChevronDown className="h-4 w-4 text-text-muted" />{" "}
          </button>{" "}
          {showUserMenu && (
            <div className=" absolute right-0 top-12 w-52 rounded-xl border border-border-subtle bg-bg-surface p-2 shadow-xl dark:bg-bg-surface ">
              {" "}
              <div className="px-3 py-2">
                {" "}
                <p className="text-xs font-semibold text-text-primary ">
                  {" "}
                  Project User{" "}
                </p>{" "}
                <p className="mt-1 text-[11px] text-text-muted">
                  {" "}
                  SIH 26142{" "}
                </p>{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </header>
  );
}
