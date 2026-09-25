import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";

export function isValidPhone(phone) {
  if (!phone) return false;

  try {
    return isValidPhoneNumber(phone);
  } catch {
    return false;
  }
}

export function formatPhoneForDisplay(phone) {
  if (!phone) return "";

  try {
    return parsePhoneNumber(phone)?.formatInternational() ?? phone;
  } catch {
    return phone;
  }
}

export function formatPhoneForWhatsApp(phone) {
  if (!phone) return "";

  return phone.replace(/\D/g, "");
}
