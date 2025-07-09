export const DATE_FORMATS = {
  DISPLAY: "DD/MM/YYYY",
  API: "YYYY-MM-DDTHH:mm:ss.sssZ",
  TIME_12: "hh:mm A",
  TIME_24: "HH:mm",
  DATETIME_DISPLAY: "DD/MM/YYYY hh:mm A",
  DATETIME_API: "YYYY-MM-DDTHH:mm:ss.sssZ",
};

export function formatToDDMMYYYY(dateInput) {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatDateForBackend(dateString) {
  if (!dateString) return "N/A";

  if (dateString.includes("/")) {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  if (dateString.includes("-")) {
    return dateString;
  }

  return "N/A";
}
