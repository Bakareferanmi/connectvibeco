export function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export function formatCVC(value: string) {
  return value.replace(/\D/g, "").slice(0, 4);
}

export function isCardComplete(cardNumber: string, expiry: string, cvc: string, name: string) {
  const digits = cardNumber.replace(/\s/g, "");
  return digits.length >= 15 && /^\d{2}\/\d{2}$/.test(expiry) && cvc.length >= 3 && name.trim().length > 1;
}
