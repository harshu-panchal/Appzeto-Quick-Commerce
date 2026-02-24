import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  ChevronLeft,
  User,
  Bike,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import deliveryRiding from "@/assets/Delivery Riding.json";
import { deliveryApi } from "../services/deliveryApi";
import { useAuth } from "@core/context/AuthContext";
import { toast } from "sonner";

const VEHICLE_TYPES = [
  { value: "bike", label: "Bike" },
  { value: "scooter", label: "Scooter" },
  { value: "cycle", label: "Cycle" },
];

const DeliveryAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // mode: "login" | "signup"
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("form"); // "form" | "otp"

  // Login state
  const [loginPhone, setLoginPhone] = useState("");

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupVehicle, setSignupVehicle] = useState("bike");
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

  // OTP state
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      if (mode === "login") {
        if (!loginPhone || loginPhone.length < 10) {
          toast.error("Please enter a valid 10-digit phone number");
          return;
        }
        const res = await deliveryApi.sendLoginOtp({ phone: loginPhone });
        toast.success(res.data?.message || "OTP sent!");
      } else {
        if (!signupName.trim()) { toast.error("Please enter your name"); return; }
        if (!signupPhone || signupPhone.length < 10) { toast.error("Please enter a valid 10-digit phone number"); return; }
        const res = await deliveryApi.sendSignupOtp({
          name: signupName.trim(),
          phone: signupPhone,
          vehicleType: signupVehicle,
        });
        toast.success(res.data?.message || "OTP sent!");
      }
      setOtp(["", "", "", ""]);
      setTimer(30);
      setStep("otp");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.some((d) => d === "") || !agreed) return;
    setLoading(true);
    try {
      const phone = mode === "login" ? loginPhone : signupPhone;
      const otpString = otp.join("");
      const response = await deliveryApi.verifyOtp({ phone, otp: otpString });
      const { token, delivery } = response.data.result;

      login({ ...delivery, token, role: "delivery" });

      toast.success("Welcome! Redirecting to dashboard...");
      navigate("/delivery/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setStep("form");
    setOtp(["", "", "", ""]);
    setLoginPhone("");
    setSignupName("");
    setSignupPhone("");
    setSignupVehicle("bike");
    setAgreed(false);
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-[#F0F4FF] flex flex-col items-center justify-center p-5 font-['Outfit',_sans-serif]">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_24px_60px_rgba(99,102,241,0.1)] border border-indigo-50 overflow-hidden">

          {/* Header with Lottie */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 flex flex-col items-center">
            <div className="w-40 h-40">
              <Lottie animationData={deliveryRiding} loop />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${step}-title`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-center mt-3"
              >
                <h1 className="text-2xl font-black text-gray-900">
                  {step === "otp"
                    ? "Verify OTP"
                    : mode === "login"
                      ? "Partner Login"
                      : "Join the Fleet"}
                </h1>
                <p className="text-gray-500 text-sm mt-1 max-w-[240px] mx-auto">
                  {step === "otp"
                    ? `Enter the 4-digit code sent to +91 ${mode === "login" ? loginPhone : signupPhone}`
                    : mode === "login"
                      ? "Login with your registered phone number"
                      : "Create your delivery partner account"}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Tab Switch */}
          {step === "form" && (
            <div className="flex mx-6 mt-6 bg-gray-100 rounded-2xl p-1">
              {["login", "signup"].map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2.5 text-sm font-black rounded-xl transition-all duration-300 ${mode === m
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {m === "login" ? "Login" : "Join Now"}
                </button>
              ))}
            </div>
          )}

          {/* Form Body */}
          <div className="p-6 pt-4">
            <AnimatePresence mode="wait">

              {/* ─── FORM STEP ─── */}
              {step === "form" && (
                <motion.div
                  key={`form-${mode}`}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  {/* Signup-only: Name */}
                  {mode === "signup" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                        <input
                          type="text"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-gray-300"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                      <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm border-r border-gray-200 pr-2.5">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={mode === "login" ? loginPhone : signupPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          mode === "login" ? setLoginPhone(val) : setSignupPhone(val);
                        }}
                        maxLength={10}
                        className="w-full pl-24 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-gray-300"
                        placeholder="00000 00000"
                      />
                    </div>
                  </div>

                  {/* Signup-only: Vehicle Type */}
                  {mode === "signup" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                        Vehicle Type
                      </label>
                      <div className="relative">
                        <Bike className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                        <button
                          type="button"
                          onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
                          className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-left"
                        >
                          {VEHICLE_TYPES.find((v) => v.value === signupVehicle)?.label}
                        </button>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <AnimatePresence>
                          {showVehicleDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              className="absolute top-full left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-lg mt-2 overflow-hidden z-20"
                            >
                              {VEHICLE_TYPES.map((v) => (
                                <button
                                  key={v.value}
                                  onClick={() => { setSignupVehicle(v.value); setShowVehicleDropdown(false); }}
                                  className={`w-full px-4 py-3 text-sm font-bold text-left hover:bg-indigo-50 transition-colors ${signupVehicle === v.value ? "text-indigo-600 bg-indigo-50/60" : "text-gray-700"
                                    }`}
                                >
                                  {v.label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black tracking-widest uppercase shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Send OTP <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>

                  {mode === "signup" && (
                    <p className="text-center text-xs text-gray-400 font-semibold pt-1">
                      By joining, you agree to our{" "}
                      <span className="text-indigo-500 font-bold cursor-pointer hover:underline">Terms</span>{" "}
                      &amp;{" "}
                      <span className="text-indigo-500 font-bold cursor-pointer hover:underline">Privacy Policy</span>
                    </p>
                  )}
                </motion.div>
              )}

              {/* ─── OTP STEP ─── */}
              {step === "otp" && (
                <motion.div
                  key="otp"
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-5"
                >
                  {/* OTP Boxes */}
                  <div className="space-y-2 text-center">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      Enter Security Code
                    </label>
                    <div className="flex justify-center gap-3 pt-1">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="tel"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-14 h-14 text-center text-2xl font-black border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-gray-50 text-gray-900"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Timer / Resend */}
                  <div className="text-center">
                    {timer > 0 ? (
                      <p className="text-gray-400 text-sm font-medium">
                        Resend code in <span className="text-indigo-600 font-bold">{timer}s</span>
                      </p>
                    ) : (
                      <button
                        onClick={handleSendOtp}
                        className="text-indigo-600 font-black text-sm uppercase tracking-wide hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-indigo-600 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                      I confirm my phone number is correct and I agree to the{" "}
                      <span className="text-indigo-600 font-bold">Terms of Service</span> &amp;{" "}
                      <span className="text-indigo-600 font-bold">Privacy Policy</span>.
                    </label>
                  </div>

                  {/* Verify Button */}
                  <button
                    onClick={handleVerifyOtp}
                    disabled={!agreed || otp.some((d) => !d) || loading}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black tracking-widest uppercase shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Verify &amp; Login <CheckCircle className="w-4 h-4" /></>
                    )}
                  </button>

                  {/* Back */}
                  <button
                    onClick={() => { setStep("form"); setOtp(["", "", "", ""]); }}
                    className="w-full flex items-center justify-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm font-bold transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Edit Phone Number
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-3 opacity-40">
          <span className="h-px w-8 bg-gray-400" />
          <ShieldCheck className="text-gray-500 w-4 h-4" />
          <span className="h-px w-8 bg-gray-400" />
        </div>
        <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[4px] mt-2">
          Appzeto Partner Ecosystem • v1.0
        </p>
      </motion.div>
    </div>
  );
};

export default DeliveryAuth;
