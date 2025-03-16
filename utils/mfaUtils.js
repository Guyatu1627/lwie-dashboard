import speakeasy from "speakeasy"
import qrcode from "qrcode"

export const generateTOTP = async (userEmail) => {
  try {
    // Generate a secret
    const secret = speakeasy.generateSecret({
      name: `Lwie Admin Dashboard (${userEmail})`,
      length: 20,
    })

    // Generate QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url)

    return {
      secret: secret.base32,
      qrCodeUrl,
    }
  } catch (error) {
    console.error("Error generating TOTP:", error)
    throw error
  }
}

export const verifyTOTP = async (secret, token) => {
  try {
    // Verify token
    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 1, // Allow 1 time step before and after (30 seconds each)
    })

    return verified
  } catch (error) {
    console.error("Error verifying TOTP:", error)
    return false
  }
}

