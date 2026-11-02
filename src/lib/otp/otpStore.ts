const otps = new Map<string, string>();

export function setOtp(phone: string, code: string) {
  otps.set(phone, code);
  setTimeout(() => otps.delete(phone), 2 * 60 * 1000); // expire 2 minutes
}

export function verifyOtp(phone: string, code: string) {
  return otps.get(phone) === code;
}
