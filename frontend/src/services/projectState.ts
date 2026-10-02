type Listener = () => void;
const listeners: Listener[] = [];
export function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
}
function notify() {
  listeners.forEach((l) => l());
}
let currentFile: string | null = null;
let processedFile: string | null = null;
export function setCurrentFile(filename: string) {
  currentFile = filename;
  notify();
}
export function getCurrentFile() {
  return currentFile;
}
export function setProcessedFile(filename: string) {
  processedFile = filename;
  notify();
}
export function getProcessedFile() {
  return processedFile;
}
export function clearProjectState() {
  currentFile = null;
  processedFile = null;
  notify();
}
