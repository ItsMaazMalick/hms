export const generateOTP = (length: number) => {
  const data = "0123456789";
  let OTP = "";
  for (let i = 0; i < length; i++) {
    OTP += data[Math.floor(Math.random() * 10)];
  }
  return OTP;
};
