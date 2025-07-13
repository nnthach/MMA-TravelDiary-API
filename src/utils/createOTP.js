const { userModel } = require("~/models/userModel");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const saveOTPToUser = async (userId) => {
  console.log("user id", userId);
  const otp = generateOTP();
  const otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5p

  const updateOtp = await userModel.updateUserById(userId.toString(), {
    otp,
    otpExpire,
  });

  console.log("update otp", updateOtp);

  return otp;
};
