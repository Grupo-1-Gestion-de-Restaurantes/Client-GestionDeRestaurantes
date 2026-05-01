import { toast } from "react-hot-toast";

const baseStyle = {
  borderRadius: "8px",
  fontWeight: 600,
  fontFamily: "inherit",
  fontSize: "1rem",
  padding: "16px 24px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
  background: "#161925",
  color: "#ffffff",
};

export const showSuccess = (message) =>
  toast.success(message, {
    style: {
      ...baseStyle,
      border: "1px solid #F1D302",
    },
    iconTheme: {
      primary: "#F1D302",
      secondary: "#161925",
    },
  });

export const showError = (message) =>
  toast.error(message, {
    style: {
      ...baseStyle,
      border: "1px solid #C1292E",
    },
    iconTheme: {
      primary: "#C1292E",
      secondary: "#fff",
    },
  });

export const showInfo = (message) =>
  toast(message, {
    style: {
      ...baseStyle,
      border: "1px solid #F1D302",
    },
    iconTheme: {
      primary: "#F1D302",
      secondary: "#161925",
    },
  });