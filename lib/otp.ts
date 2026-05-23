const otpStore = new Map<string, { otp: string; expires: number }>()

export function generateOTP(email: string): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 }) // 5 min
  return otp
}

export function verifyOTP(email: string, otp: string): boolean {
  const stored = otpStore.get(email)
  if (!stored) return false
  if (Date.now() > stored.expires) { otpStore.delete(email); return false }
  if (stored.otp !== otp) return false
  otpStore.delete(email)
  return true
}