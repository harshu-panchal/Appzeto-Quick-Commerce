import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@shared/components/ui/Card";
import PageHeader from "@shared/components/ui/PageHeader";
import StatCard from "@shared/components/ui/StatCard";
import {
  DollarSign,
  Truck,
  Package,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { MagicCard } from "@/components/ui/magic-card";
import { BlurFade } from "@/components/ui/blur-fade";

const data = [
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 3000 },
  { name: "Wed", value: 2000 },
  { name: "Thu", value: 2780 },
  { name: "Fri", value: 1890 },
  { name: "Sat", value: 2390 },
  { name: "Sun", value: 3490 },
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 3000 },
  { name: "Wed", value: 2000 },
  { name: "Thu", value: 2780 },
  { name: "Fri", value: 1890 },
  { name: "Sat", value: 2390 },
  { name: "Sun", value: 3490 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const stats = [
    {
      label: "Total Revenue",
      value: "$12,450.00",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "+12.5%",
      path: "/seller/earnings",
    },
    {
      label: "Total Orders",
      value: "156",
      icon: Truck,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+8.2%",
      path: "/seller/orders",
    },
    {
      label: "Active Products",
      value: "24",
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "+2 new",
      path: "/seller/products",
    },
  ];

  return (
    <div className="ds-section-spacing p-2">
      <BlurFade delay={0.1}>
        {/* Stats Grid */}
        <div className="ds-grid-cards-3">
          {stats.map((stat, idx) => (
            <BlurFade key={stat.label} delay={0.1 + idx * 0.1}>
              <div
                onClick={() => navigate(stat.path)}
                className="cursor-pointer group">
                <MagicCard
                  className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden bg-white rounded-lg"
                  gradientColor={
                    stat.bg.includes("emerald")
                      ? "#d1fae5"
                      : stat.bg.includes("blue")
                        ? "#dbeafe"
                        : "#ede9fe"
                  }>
                  <StatCard
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    trend={stat.trend}
                    description="than last week"
                    color={stat.color}
                    bg={stat.bg}
                    className="border-none shadow-none"
                  />
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-1 opacity-30",
                      stat.bg,
                    )}></div>
                </MagicCard>
              </div>
            </BlurFade>
          ))}
        </div>
      </BlurFade>

      <div className="ds-grid-cards">
        {/* Revenue Chart */}
        <BlurFade delay={0.4} className="lg:col-span-2 h-full uppercase">
          <Card
            title="Revenue Intelligence"
            subtitle="Daily revenue performance analysis"
            className="h-full">
            <div className="ds-chart-container -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop
                        offset="50%"
                        stopColor="#6366f1"
                        stopOpacity={0.1}
                      />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
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
                    tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "24px",
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
                      backdropFilter: "blur(10px)",
                      padding: "12px 20px",
                    }}
                    itemStyle={{
                      color: "#6366f1",
                      fontWeight: 900,
                      fontSize: "14px",
                    }}
                    labelStyle={{
                      color: "#64748b",
                      fontWeight: 700,
                      marginBottom: "4px",
                    }}
                    cursor={{
                      stroke: "#6366f1",
                      strokeWidth: 2,
                      strokeDasharray: "6 6",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </BlurFade>

        {/* Quick Actions */}
        <BlurFade delay={0.5} className="lg:col-span-1 h-full">
          <Card
            title="Business Actions"
            subtitle="One tap management"
            className="h-full border-none shadow-xl bg-white rounded-lg">
            <div className="space-y-5 mt-4">
              <Link to="/seller/products/add">
                <ShimmerButton className="w-full justify-center text-center font-black py-4 rounded-md text-white shadow-[0_15px_30px_rgba(99,102,241,0.3)]">
                  <HiOutlineCube className="mr-3 h-6 w-6" />
                  ADD NEW PRODUCT
                </ShimmerButton>
              </Link>

              <Button
                onClick={() => navigate("/seller/orders")}
                className="w-full justify-start text-left h-16 rounded-md border-2 border-dashed border-gray-100 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-500 group pl-6"
                variant="outline">
                <div className="p-2 rounded-md bg-gray-50 group-hover:bg-primary/10 transition-colors mr-4">
                  <HiOutlineTruck className="h-5 w-5 text-gray-400 group-hover:text-primary" />
                </div>
                <span className="font-bold tracking-tight">
                  Process Recent Orders
                </span>
              </Button>

              <Button
                onClick={() => navigate("/seller/earnings")}
                className="w-full justify-start text-left h-16 rounded-md border-2 border-dashed border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-500 group pl-6"
                variant="outline">
                <div className="p-2 rounded-md bg-gray-50 group-hover:bg-emerald-100 transition-colors mr-4">
                  <HiOutlineCurrencyDollar className="h-5 w-5 text-gray-400 group-hover:text-emerald-500" />
                </div>
                <span className="font-bold tracking-tight">
                  Withdrawal Requests
                </span>
              </Button>
            </div>
          </Card>
        </BlurFade>
      </div>

      {/* Recent Orders */}
      <BlurFade delay={0.6}>
        <Card
          title="Order Stream"
          subtitle="Live tracking of your latest transactions"
          className="border-none shadow-xl bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-gray-400">
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em]">
                    Identity
                  </th>
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em]">
                    Buyer Details
                  </th>
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em]">
                    Timestamp
                  </th>
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em]">
                    Revenue
                  </th>
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em]">
                    Status
                  </th>
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr
                    key={i}
                    onClick={() => navigate("/seller/orders")}
                    className="hover:bg-gray-50/80 transition-all duration-500 group cursor-pointer">
                    <td className="px-6 py-5 first:rounded-l-lg last:rounded-r-lg border-y border-transparent hover:border-primary/10">
                      <span className="font-black text-gray-900 group-hover:text-primary transition-colors tracking-tight">
                        #ORD-240{i}
                      </span>
                    </td>
                    <td className="px-6 py-5 border-y border-transparent">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-md bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xs font-black text-slate-500 shadow-inner group-hover:scale-110 transition-transform duration-500">
                          C{i}
                        </div>
                        <span className="font-bold text-gray-900">
                          Premium Buyer {i}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 border-y border-transparent text-gray-500 text-sm font-bold italic">
                      24 Oct, 2023
                    </td>
                    <td className="px-6 py-5 border-y border-transparent font-black text-gray-900 text-lg">
                      $145.00
                    </td>
                    <td className="px-6 py-5 border-y border-transparent">
                      <Badge
                        variant={
                          i === 1 ? "warning" : i === 2 ? "success" : "default"
                        }
                        className="rounded-md px-4 py-1.5 font-black uppercase text-[9px] tracking-widest shadow-lg">
                        {i === 1
                          ? "Pending"
                          : i === 2
                            ? "Delivered"
                            : "Processing"}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 border-y border-transparent first:rounded-l-lg last:rounded-r-lg text-right">
                      <button className="text-gray-300 hover:text-primary p-2.5 rounded-md hover:bg-white shadow-sm transition-all duration-500">
                        <HiOutlineDotsVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </BlurFade>
    </div>
  );
};

export default Dashboard;
