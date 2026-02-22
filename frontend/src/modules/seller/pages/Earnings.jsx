import React from "react";
import Card from "@shared/components/ui/Card";
import Badge from "@shared/components/ui/Badge";
import Button from "@shared/components/ui/Button";
import {
  HiOutlineTrendingUp,
  HiOutlineChartBar,
  HiOutlineCurrencyDollar,
  HiOutlineDownload,
} from "react-icons/hi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const monthlyData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 2000 },
  { name: "Apr", revenue: 2780 },
  { name: "May", revenue: 1890 },
  { name: "Jun", revenue: 2390 },
  { name: "Jul", revenue: 3490 },
  { name: "Aug", revenue: 4000 },
  { name: "Sep", revenue: 3000 },
  { name: "Oct", revenue: 2000 },
  { name: "Nov", revenue: 2780 },
  { name: "Dec", revenue: 1890 },
];

import { MagicCard } from "@/components/ui/magic-card";
import { BlurFade } from "@/components/ui/blur-fade";
import ShimmerButton from "@/components/ui/shimmer-button";

// ... (keep monthlyData constant)

const Earnings = () => {
  const totalBalance = 24850.0;
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = React.useState(false);
  const [isWithdrawing, setIsWithdrawing] = React.useState(false);
  const [withdrawAmount, setWithdrawAmount] = React.useState(
    totalBalance.toString(),
  );

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > totalBalance) {
      alert(
        "Please enter a valid amount between $0.01 and $" +
          totalBalance.toLocaleString(),
      );
      return;
    }

    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setIsWithdrawModalOpen(false);
      alert(
        `Withdrawal request of $${amount.toLocaleString()} submitted successfully!`,
      );
    }, 1500);
  };

  const exportReport = () => {
    console.log("Exporting earnings report...");
    alert("Exporting monthly earnings report as PDF (Simulation)");
  };
  return (
    <div className="space-y-8 pb-16">
      <BlurFade delay={0.1}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 hidden md:block">
            Earnings Overview
          </h2>
          <div className="flex space-x-3">
            <Button
              onClick={exportReport}
              variant="outline"
              className="border-gray-200">
              <HiOutlineDownload className="mr-2 h-5 w-5" />
              Export Report
            </Button>
            <ShimmerButton
              onClick={() => setIsWithdrawModalOpen(true)}
              className="px-6 py-2 rounded-xl text-sm font-bold text-white shadow-lg">
              <span className="text-white">Withdraw Funds</span>
            </ShimmerButton>
          </div>
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BlurFade delay={0.2}>
          <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none shadow-lg h-full">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-100 font-medium">Total Revenue</p>
                <h3 className="text-4xl font-bold mt-2">$24,850.00</h3>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <HiOutlineCurrencyDollar className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-8 flex items-center text-emerald-100 bg-white/10 w-fit px-3 py-1 rounded-full text-sm">
              <HiOutlineTrendingUp className="mr-2" />
              <span>+12.5% increase from last month</span>
            </div>
          </Card>
        </BlurFade>

        <BlurFade delay={0.3}>
          <Card className="h-full border-none shadow-md bg-white p-6 flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Total Withdrawn
                </p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  ₹{earningsData.totalWithdrawn.toLocaleString()}
                </h2>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <HiOutlineBanknotes className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                  <HiOutlineArrowDownTray className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Last Payout
                  </p>
                  <p className="text-xs font-black text-slate-900">
                    ₹12,450 on {earningsData.lastPayoutDate}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </BlurFade>
      </div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {isWithdrawModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md relative z-10 bg-white rounded-lg shadow-2xl overflow-hidden p-8 text-center">
              <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <HiOutlineBanknotes className="h-8 w-8 text-emerald-600" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Withdraw Funds
              </h2>
              <p className="text-sm text-slate-500 font-medium mb-8">
                Available Balance:{" "}
                <span className="text-emerald-600 font-bold">
                  ₹{earningsData.availableBalance.toLocaleString()}
                </span>
              </p>

              <div className="space-y-4 text-left">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      className="w-full pl-8 pr-4 py-3 rounded-lg border-slate-200 bg-slate-50 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                      placeholder="0.00"
                      defaultValue={earningsData.availableBalance}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Select Bank Account
                  </label>
                  <div className="p-4 border border-slate-200 rounded-lg flex items-center gap-4 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/10 transition-all group">
                    <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                      <HiOutlineBuildingLibrary className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-900">
                        HDFC Bank **** 4589
                      </p>
                      <p className="text-xs text-slate-400 font-bold">
                        Primary Account
                      </p>
                    </div>
                    <div className="h-5 w-5 rounded-full border-2 border-slate-200 group-hover:border-emerald-500 group-hover:bg-emerald-500 transition-all"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8">
                <button
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="py-3 rounded-lg font-black text-slate-600 hover:bg-slate-50 transition-colors">
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    setIsWithdrawModalOpen(false);
                    alert("Withdrawal request submitted!");
                  }}
                  className="py-3 rounded-lg bg-emerald-600 text-white font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 transition-all">
                  CONFIRM
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Earnings;
