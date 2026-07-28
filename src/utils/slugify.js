// src/utils/slugify.js
export const slugify = (text) => {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

// src/utils/readTime.js — estimated read time in minutes
export const estimateReadTime = (content) => {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200); // ~200 WPM average
  return Math.max(1, minutes);
};

// src/utils/deviceDetect.js — detect device type from user agent
export const detectDevice = () => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|android|iphone|ipod|blackberry|opera mini|windows phone/i.test(ua)) return "mobile";
  return "desktop";
};

// src/utils/exportCSV.js — download a CSV string as a file
export const downloadCSV = (csvString, filename = "export.csv") => {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};