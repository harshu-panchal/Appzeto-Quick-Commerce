import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import Card from "@/shared/components/ui/Card";

const DeliveryAuth = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setTimer(30);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otp.some((digit) => digit === "") || !agreed) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate("/delivery/dashboard");
    }, 1500);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-6">
      {/* Header Section */}
      <div className="flex-1 flex flex-col items-center justify-center pt-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xs mb-8 text-center">
          <div className="bg-primary/5 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent animate-pulse"></div>
            <ShieldCheck size={48} className="text-primary z-10" />
          </div>

          <h1 className="ds-h2 text-gray-900 mb-2">
            {otpSent ? "Verify OTP" : "Partner Login"}
          </h1>
          <p className="text-gray-500 text-sm">
            {otpSent
              ? `Enter the code sent to +91 ${phoneNumber}`
              : "Enter your phone number to continue delivering happiness."}
          </p>
        </motion.div>

        {/* Input Section */}
        <div className="w-full max-w-xs relative overflow-hidden min-h-[300px]">
          <AnimatePresence mode="wait">
            {!otpSent ? (
              <motion.div
                key="phone-input"
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6 w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none z-10">
                    <span className="text-gray-500 font-medium border-r border-gray-300 pr-2 h-5 flex items-center">
                      +91
                    </span>
                  </div>
                  <input
                    type="tel"
                    className="block w-full pl-24 pr-4 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg font-bold tracking-widest transition-all"
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    maxLength={10}
                  />
                </div>

                <Button
                  onClick={handleSendOtp}
                  disabled={phoneNumber.length < 10 || loading}
                  className="w-full py-6 text-lg shadow-lg shadow-primary/20"
                  isLoading={loading}>
                  Send OTP <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="otp-input"
                variants={variants}
                initial={{ opacity: 0, x: 50 }}
                animate="visible"
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6 w-full">
                <div className="flex justify-between gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="tel"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-14 h-16 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-gray-50 text-gray-900"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Didn't receive code?</span>
                  {timer > 0 ? (
                    <span className="text-primary font-bold">
                      Resend in {timer}s
                    </span>
                  ) : (
                    <button
                      onClick={handleSendOtp}
                      className="text-primary font-bold hover:underline">
                      Resend OTP
                    </button>
                  )}
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex h-6 items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded transition-all cursor-pointer accent-primary"
                    />
                  </div>
                  <div className="text-sm">
                    <label
                      htmlFor="terms"
                      className="font-medium text-gray-700 cursor-pointer select-none">
                      I agree to the{" "}
                      <span className="text-primary underline">Terms</span> &{" "}
                      <span className="text-primary underline">
                        Privacy Policy
                      </span>
                    </label>
                  </div>
                </div>

                <Button
                  onClick={handleVerifyOtp}
                  disabled={!agreed || otp.some((d) => !d) || loading}
                  className="w-full py-6 text-lg shadow-lg shadow-primary/20"
                  isLoading={loading}>
                  Verify & Login <CheckCircle className="ml-2 h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp(["", "", "", ""]);
                  }}
                  className="w-full text-gray-500 hover:text-gray-700">
                  <ChevronLeft className="mr-1 h-4 w-4" /> Change Phone Number
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-xs text-gray-400">
        Appzeto Delivery Partner v1.0.0
      </div>
    </div>
  );
};

export default DeliveryAuth;
