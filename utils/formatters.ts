// Utility formatters used across the app
export const formatChoiceFieldValue = (
  choiceFieldValue?: string | null,
): string => {
  if (!choiceFieldValue) return "";
  return choiceFieldValue
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
export default formatChoiceFieldValue;

export function formatUserRole(userType?: string | null): string {
  if (!userType) {
    return "";
  }
  // Remove everything up to and including the first underscore (if present)
  const afterPrefix = userType.includes("_")
    ? userType.replace(/^[^_]*_/, "")
    : userType;

  // Replace remaining underscores with spaces and title-case each word
  return afterPrefix
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export const calculateAge = (dob?: string | null) => {
  if (!dob) return "";
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return "";
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    years--;
  }
  return years >= 0 ? `${years}` : "";
};

export const formatPrice = (value: string): string => {
  const numericValue = value.replace(/[^0-9]/g, "");
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export function formatDateAndTime(isoDate: Date | string | null): string {
  if (isoDate == null) return "";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;
}

export function formatDate(isoDate: Date | string | null): string {
  if (isoDate == null) return "";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
}

export function calculateMonthsDuration(
  startDate: Date | string | null | undefined,
): string {
  if (!startDate) return "0m";

  const startDateObj = new Date(startDate);
  const endDate = new Date();

  if (isNaN(startDateObj.getTime())) return "0m";

  let months = (endDate.getFullYear() - startDateObj.getFullYear()) * 12;
  months += endDate.getMonth() - startDateObj.getMonth();

  return `${Math.max(0, months)}m`;
}

export function getCurrencySign(): string {
  return "£";
}
