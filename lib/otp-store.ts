const otpStore = new Map<string, { otp: string; expires: number }>();

export function saveOtp(email: string, otp: string) {
  otpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000,
  });
}

export function verifyOtp(email: string, inputOtp: string): boolean {
  const record = otpStore.get(email);
  if (!record) return false;
  if (Date.now() > record.expires) {
    otpStore.delete(email);
    return false;
  }
  if (record.otp !== inputOtp) return false;
  otpStore.delete(email);
  return true;
}