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
  const [day, month, year] = dateString.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
