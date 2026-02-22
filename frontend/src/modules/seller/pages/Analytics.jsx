import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@shared/components/ui/Card";
import Badge from "@shared/components/ui/Badge";
import Button from "@shared/components/ui/Button";
import {
  HiOutlineChartBar,
  HiOutlineArrowTrendingUp,
  HiOutlineUsers,
  HiOutlineShoppingBag,
  HiOutlineArrowUpRight,
  HiOutlineArrowDownRight,
  HiOutlineCalendarDays,
  HiOutlineFunnel,
  HiOutlineShare,
  HiOutlineArrowDownTray,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineDevicePhoneMobile,
} from "react-icons/hi2";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import ShimmerButton from "@/components/ui/shimmer-button";
import Modal from "@shared/components/ui/Modal";

const MOCK_SALES_DATA = [
  { name: "Mon", sales: 4200, orders: 120, traffic: 3500 },
  { name: "Tue", sales: 3800, orders: 110, traffic: 3200 },
  { name: "Wed", sales: 5100, orders: 145, traffic: 4100 },
  { name: "Thu", sales: 4600, orders: 130, traffic: 3800 },
  { name: "Fri", sales: 6200, orders: 180, traffic: 4900 },
  { name: "Sat", sales: 7500, orders: 210, traffic: 5800 },
  { name: "Sun", sales: 8100, orders: 230, traffic: 6200 },
];

const MOCK_CATEGORY_DATA = [
  { subject: "Fruits", A: 120, fullMark: 150 },
  { subject: "Vegetables", A: 98, fullMark: 150 },
  { subject: "Dairy", A: 86, fullMark: 150 },
  { subject: "Bakery", A: 99, fullMark: 150 },
  { subject: "Grocery", A: 130, fullMark: 150 },
  { subject: "Beverages", A: 65, fullMark: 150 },
];

const MOCK_TRAFFIC_SOURCES = [
  { name: "Direct", value: 400, color: "#3b82f6" },
  { name: "Search", value: 300, color: "#10b981" },
  { name: "Social", value: 200, color: "#f59e0b" },
  { name: "Referral", value: 100, color: "#8b5cf6" },
];

const MOCK_TOP_PRODUCTS = [
  { name: "Fresh Alfonso Mangoes", sales: 120, revenue: "₹45,000", trend: 15 },
  { name: "Premium Basmati Rice", sales: 85, revenue: "₹32,500", trend: 8 },
  { name: "Organic Bananas", sales: 150, revenue: "₹12,400", trend: -3 },
  { name: "Amul Taaza Milk", sales: 450, revenue: "₹28,800", trend: 22 },
];

const Analytics = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const stats = [
    {
      label: "Total Sales",
      value: "₹1,24,500",
      trend: "+12.5%",
      icon: HiOutlineArrowTrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Orders",
      value: "1,245",
      trend: "+8.2%",
      icon: HiOutlineShoppingBag,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Avg Order Value",
      value: "₹850",
      trend: "-2.4%",
      icon: HiOutlineUsers,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Conversion Rate",
      value: "3.8%",
      trend: "+0.5%",
      icon: HiOutlineChartBar,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      <BlurFade delay={0.1}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              Advanced Analytics
              <Badge
                variant="success"
                className="text-[9px] px-1.5 py-0 font-bold tracking-wider uppercase bg-emerald-100 text-emerald-700">
                Real-time Insights
              </Badge>
            </h1>
            <p className="text-slate-500 text-sm mt-0.5 font-medium">
              Detailed breakdown of your business performance and customer
              behavior.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              {["Overview", "Sales", "Customers"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                    activeTab === tab
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-700",
                  )}>
                  {tab}
                </button>
              ))}
            </div>
            <div
              onClick={() => setIsShareModalOpen(true)}
              className="h-10 w-10 border border-slate-200 rounded-lg flex items-center justify-center bg-white cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
              <HiOutlineShare className="h-5 w-5 text-slate-500" />
            </div>
            <ShimmerButton
              onClick={() => {
                setIsExporting(true);
                setTimeout(() => {
                  setIsExporting(false);
                  alert("Analytics report exported successfully!");
                }, 1500);
              }}
              className="px-5 py-2.5 rounded-lg text-xs font-bold text-white shadow-lg disabled:opacity-50"
              disabled={isExporting}>
              <HiOutlineArrowDownTray className="h-4 w-4 mr-2" />
              {isExporting ? "EXPORTING..." : "EXPORT REPORT"}
            </ShimmerButton>
          </div>
        </div>
      </BlurFade>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <BlurFade key={i} delay={0.1 + i * 0.05}>
            <MagicCard
              className="border-none shadow-md overflow-hidden group bg-white p-0"
              gradientColor={
                stat.bg.includes("emerald")
                  ? "#ecfdf5"
                  : stat.bg.includes("indigo")
                    ? "#eef2ff"
                    : stat.bg.includes("amber")
                      ? "#fffbeb"
                      : "#fff1f2"
              }>
              <div className="p-6 relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <h4 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
                    {stat.value}
                  </h4>
                  <div
                    className={cn(
                      "flex items-center mt-3 text-[11px] font-black px-2 py-0.5 rounded-full w-fit",
                      stat.trend.startsWith("+")
                        ? "text-emerald-600 bg-emerald-50"
                        : "text-rose-600 bg-rose-50",
                    )}>
                    {stat.trend.startsWith("+") ? (
                      <HiOutlineArrowUpRight className="mr-0.5" />
                    ) : (
                      <HiOutlineArrowDownRight className="mr-0.5" />
                    )}
                    {stat.trend}
                    <span className="text-slate-400 ml-1 font-medium">
                      vs prev 7d
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    "h-12 w-12 rounded-lg flex items-center justify-center shadow-inner",
                    stat.bg,
                    stat.color,
                  )}>
                  <stat.icon className="h-6 w-6 transition-transform group-hover:scale-125 duration-300" />
                </div>
              </div>
            </MagicCard>
          </BlurFade>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Performance Chart */}
        <BlurFade delay={0.4} className="lg:col-span-2">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl p-6 bg-white overflow-hidden group h-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Revenue & Trends
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Performance Insights
                </p>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                {["Daily", "Weekly", "Monthly"].map((range) => (
                  <button
                    key={range}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      range === "Daily"
                        ? "bg-white text-primary shadow-sm"
                        : "text-slate-400 hover:text-slate-600",
                    )}>
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={MOCK_SALES_DATA}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorTraffic"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                    dx={-10}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "20px",
                      border: "none",
                      boxShadow:
                        "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ fontSize: "11px", fontWeight: 900 }}
                    cursor={{
                      stroke: "#3b82f6",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                  <Area
                    type="monotone"
                    dataKey="traffic"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1}
                    fill="url(#colorTraffic)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </BlurFade>

        {/* Category Mix (Radar Chart) */}
        <BlurFade delay={0.5} className="lg:col-span-1">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-lg p-6 bg-white flex flex-col items-center justify-center group h-full">
            <div className="w-full text-center mb-6">
              <h3 className="text-lg font-black text-slate-900">
                Category Mix
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Inventory Distribution
              </p>
            </div>
            <div className="h-[350px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  data={MOCK_CATEGORY_DATA}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 150]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Volume"
                    dataKey="A"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="#10b981"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full mt-4">
              {MOCK_CATEGORY_DATA.slice(0, 3).map((cat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-3 rounded-lg flex flex-col items-center border border-slate-100/50">
                  <p className="text-[10px] font-black text-slate-900">
                    {cat.A}
                  </p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase">
                    {cat.subject}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </BlurFade>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Selling Products */}
        <BlurFade delay={0.6}>
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-lg p-0 overflow-hidden bg-white">
            <div className="p-6 border-b border-slate-50">
              <h3 className="text-lg font-black text-slate-900">
                Top Performing Products
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Bestsellers by sales volume and revenue generation.
              </p>
            </div>
            <div className="divide-y divide-slate-50">
              {MOCK_TOP_PRODUCTS.map((product, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsProductModalOpen(true);
                  }}
                  className="px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-primary group-hover:text-white transition-all">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-bold">
                        {product.sales} units sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">
                      {product.revenue}
                    </p>
                    <div
                      className={cn(
                        "flex items-center justify-end text-[10px] font-black mt-0.5",
                        product.trend > 0
                          ? "text-emerald-600"
                          : "text-rose-600",
                      )}>
                      {product.trend > 0 ? (
                        <HiOutlineArrowUpRight className="h-3 w-3 mr-0.5" />
                      ) : (
                        <HiOutlineArrowDownRight className="h-3 w-3 mr-0.5" />
                      )}
                      {Math.abs(product.trend)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
              <button
                onClick={() => navigate("/seller/products")}
                className="text-xs font-black text-primary uppercase tracking-widest hover:underline">
                View All Products Analytics
              </button>
            </div>
          </Card>
        </BlurFade>

        {/* Traffic Sources & Customer Insights */}
        <BlurFade delay={0.7}>
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl p-6 bg-white overflow-hidden group h-full">
            <div className="mb-8">
              <h3 className="text-lg font-black text-slate-900">
                Customer Acquisition
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                Traffic Origin Analysis
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="h-[250px] w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MOCK_TRAFFIC_SOURCES}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value">
                      {MOCK_TRAFFIC_SOURCES.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          strokeWidth={0}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "15px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      }}
                      itemStyle={{ fontSize: "10px", fontWeight: 900 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                {MOCK_TRAFFIC_SOURCES.map((source, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: source.color }}
                      />
                      <span className="text-xs font-bold text-slate-600">
                        {source.name}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      {(source.value / 10).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-50 pt-8">
              <div className="text-center">
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <HiOutlineMapPin className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-black text-slate-900 tracking-tight">
                  Mumbai
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Top City
                </p>
              </div>
              <div className="text-center">
                <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <HiOutlineClock className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-black text-slate-900 tracking-tight">
                  8 PM - 10 PM
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Peak Time
                </p>
              </div>
              <div className="text-center">
                <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <HiOutlineDevicePhoneMobile className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-black text-slate-900 tracking-tight">
                  82% Mobile
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Top Device
                </p>
              </div>
            </div>
          </Card>
        </BlurFade>
      </div>
      {/* Product Detail Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title="Product Insights">
        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="h-16 w-16 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
                <HiOutlineShoppingBag className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-black text-slate-900">
                  {selectedProduct.name}
                </h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                  Product ID: SKU-928374
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-2xl">
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                  Revenue
                </p>
                <p className="text-xl font-black text-emerald-900">
                  {selectedProduct.revenue}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl">
                <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">
                  Units Sold
                </p>
                <p className="text-xl font-black text-blue-900">
                  {selectedProduct.sales}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest pl-1">
                Sales velocity
              </p>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[75%]" />
              </div>
              <p className="text-[10px] text-slate-400 font-bold text-right pt-1">
                +12% faster than last week
              </p>
            </div>

            <Button
              onClick={() => setIsProductModalOpen(false)}
              className="w-full py-4 rounded-2xl font-black shadow-xl shadow-primary/20">
              CLOSE DETAILS
            </Button>
          </div>
        )}
      </Modal>

      {/* Share Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Insights">
        <div className="space-y-6">
          <p className="text-sm text-slate-500 font-medium text-center">
            Generate a secure link to share this dashboard with your team or
            partners.
          </p>

          <div className="flex gap-2">
            <input
              readOnly
              value="https://appzeto.com/seller/analytics/share-link-9283"
              className="flex-1 px-4 py-3 bg-slate-50 rounded-xl text-xs font-semibold select-all outline-none"
            />
            <Button
              onClick={() => alert("Link copied to clipboard!")}
              className="rounded-xl px-4">
              COPY
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["PDF", "Excel", "Image"].map((format) => (
              <button
                key={format}
                className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all flex flex-col items-center gap-2 group">
                <HiOutlineArrowDownTray className="h-5 w-5 text-slate-400 group-hover:text-primary" />
                <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-primary">
                  {format}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Analytics;
