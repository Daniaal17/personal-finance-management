import React, { useState } from "react";
import { ArrowRight, DollarSign } from "lucide-react";
import OtpInput from "react-otp-input";
import { useLocation, useNavigate } from "react-router-dom";
import { failureToaster, successToaster } from "../../utils/swal";
import axios from "axios";

const OTPVerification = () => {
  const location = useLocation();
  const verificationType = location.state?.type;
  const email = location.state?.email;

  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      await axios.post(
        `http://localhost:8000/api/auth/otp/verify/${email}/${verificationType}`,
        {
          otp,
        }
      );

      if (verificationType == "reset") {
        successToaster("Otp verified successfully");
        navigate("/auth/reset-password", { state: { email, otp: otp } });
      } else {
        successToaster("User registered successfully");
        navigate("/auth/login");
      }
    } catch (error) {
      console.log("ERROR", error);
      failureToaster(error.response.data.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await axios.post(
        `http://localhost:8000/api/auth/otp/resend/${`mhsnmubeen@gmail.com`}`
      );
      successToaster("Otp sent successfully");
    } catch (error) {
      console.log("ERROR", error);
      failureToaster(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-teal-100 flex items-center justify-center p-6">
      <div className="bg-white/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-6xl h-auto flex overflow-hidden">
        {/* Left Section */}
        <div className="w-1/3 bg-gradient-to-b from-blue-600 to-purple-600 p-8 flex flex-col justify-center items-center text-white">
          <div className="mb-8">
            <DollarSign className="h-16 w-16 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Verify Your Account</h1>
          <p className="text-center text-white/80 mb-8">
            We've sent a verification code to your email address. Please enter
            it below to continue.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-2/3 p-8">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Enter Verification Code
          </h2>

          <form onSubmit={handleVerifyOTP} className="space-y-8">
            <div className="">
              <div className="flex flex-col items-center space-y-6">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="w-12 h-12 mx-2 text-center border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  )}
                  inputStyle={{
                    width: "3rem",
                    height: "3rem",
                    margin: "0 0.5rem",
                    fontSize: "1.5rem",
                    borderRadius: "0.75rem",
                    backgroundColor: "transparent",
                  }}
                  shouldAutoFocus
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full max-w-md bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:opacity-90 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                >
                  {isVerifying ? "Verifying..." : "Verify OTP"}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors duration-200"
                >
                  Didn't receive the code? Resend OTP
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
