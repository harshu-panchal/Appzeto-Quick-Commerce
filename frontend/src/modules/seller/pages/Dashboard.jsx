import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@shared/components/ui/Card";
import PageHeader from "@shared/components/ui/PageHeader";
import Badge from "@shared/components/ui/Badge";
import Modal from "@shared/components/ui/Modal";
import {
  DollarSign,
  Truck,
  Package,
  TrendingUp,
  ShoppingBag,
  Clock,
  ArrowUpRight,
  Plus,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { sellerApi } from "../services/sellerApi";
import { toast } from "sonner";
import { useSellerOrders } from "../context/SellerOrdersContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { orders: ordersFromContext, ordersLoading } = useSellerOrders();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const statsRes = await sellerApi.getStats();
        if (cancelled) return;
        if (statsRes.data.success) setStatsData(statsRes.data.result);
      } catch (error) {
        if (!cancelled) {
          console.error("Dashboard Fetch Error:", error);
          toast.error("Failed to load dashboard data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchStats();
    return () => { cancelled = true; };
  }, []);

  const safeOrders = Array.isArray(ordersFromContext) ? ordersFromContext : [];
  const loadingOrStats = loading || ordersLoading;

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const revenueChartData = React.useMemo(() => {
    const raw = statsData?.salesTrend ?? statsData?.chartData ?? [];
    const arr = Array.isArray(raw) ? raw : [];
    if (arr.length > 0) {
      return arr.map((d) => ({
        name: d.name ?? d.date ?? "—",
        sales: Number(d.sales ?? d.revenue ?? d.total ?? 0) || 0,
      }));
    }
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { name: dayNames[d.getDay()], sales: 0 };
    });
  }, [statsData?.salesTrend, statsData?.chartData]);
  const revenueMax = Math.max(1, ...revenueChartData.map((d) => d.sales));

  const stats = [
    {
      label: "Total Revenue",
      value: statsData?.overview?.totalSales || "₹0",
      change: "+12.5%",
      changeType: "increase",
      icon: DollarSign,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      description: "vs last month",
    },
    {
      label: "Total Orders",
      value: statsData?.overview?.totalOrders || "0",
      change: "+8.2%",
      changeType: "increase",
      icon: ShoppingBag,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "vs last month",
    },
    {
      label: "Avg Order Value",
      value: statsData?.overview?.avgOrderValue || "₹0",
      change: "+2",
      changeType: "increase",
      icon: Package,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      description: "per order",
    },
    {
      label: "Pending Orders",
      value: safeOrders.filter(o => o.status === 'pending').length.toString(),
      change: "-3",
      changeType: "decrease",
      icon: Clock,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      description: "need attention",
    },
  ];

  const quickActions = [
    {
      title: "Add New Product",
      description: "List a new item in your store",
      icon: Plus,
      path: "/seller/products/add",
      variant: "primary", // dark bg, white text
    },
    {
      title: "Process Orders",
      description: "View and manage pending orders",
      icon: Truck,
      path: "/seller/orders",
      variant: "outline", // white bg, border, primary accent
    },
    {
      title: "View Earnings",
      description: "Check your revenue and payouts",
      icon: DollarSign,
      path: "/seller/earnings",
      variant: "outline-emerald", // white bg, border, emerald accent
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "processing":
      case "confirmed":
        return "info";
      case "shipped":
      case "out_for_delivery":
        return "default";
      case "delivered":
        return "success";
      default:
        return "default";
    }
  };

  if (loadingOrStats) {
    return <div className="flex items-center justify-center h-screen font-bold text-gray-500">Updating Dashboard...</div>;
  }

  return (
    <div className="ds-section-spacing relative">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your store today."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={cn(
                      "text-xs font-semibold flex items-center gap-1",
                      stat.changeType === "increase" ? "text-emerald-600" : "text-red-600"
                    )}
                  >
                    <TrendingUp className={cn("h-3 w-3", stat.changeType === "decrease" && "rotate-180")} />
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500">{stat.description}</span>
                </div>
              </div>
              <div className={cn("p-3 rounded-lg", stat.iconBg)}>
                <stat.icon className={cn("h-6 w-6", stat.iconColor)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => {
          const isPrimary = action.variant === "primary";
          const isEmerald = action.variant === "outline-emerald";
          return (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className={cn(
                "p-6 rounded-xl text-left transition-all duration-200 shadow-sm hover:shadow-md border-2",
                isPrimary && "bg-primary border-primary text-white hover:bg-primary/90 hover:border-primary/90",
                action.variant === "outline" && "bg-white border-gray-200 text-gray-900 hover:border-primary hover:bg-primary/5",
                isEmerald && "bg-white border-gray-200 text-gray-900 hover:border-emerald-500 hover:bg-emerald-50"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  isPrimary ? "bg-white/20" : isEmerald ? "bg-emerald-50" : "bg-gray-100"
                )}>
                  <action.icon className={cn(
                    "h-5 w-5",
                    isPrimary ? "text-white" : isEmerald ? "text-emerald-600" : "text-gray-700"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "font-semibold text-sm",
                    isPrimary ? "text-white" : "text-gray-900"
                  )}>
                    {action.title}
                  </h3>
                  <p className={cn(
                    "text-xs mt-1",
                    isPrimary ? "text-white/90" : "text-gray-600"
                  )}>
                    {action.description}
                  </p>
                </div>
                <ArrowUpRight className={cn(
                  "h-4 w-4 shrink-0",
                  isPrimary ? "text-white/70" : "text-gray-500"
                )} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card title="Revenue Overview" subtitle="Last 7 days performance" className="lg:col-span-2">
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(value) => `₹${Number(value).toLocaleString()}`}
                  domain={[0, revenueMax]}
                  allowDataOverflow
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Product Performance */}
        <Card title="Top Categories" subtitle="Sales by category">
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData?.categoryMix || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="subject"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="A" fill="#4f46e5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card
        title="Recent Orders"
        subtitle="Latest transactions from your store"
        actions={
          <button
            onClick={() => navigate("/seller/orders")}
            className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
          >
            View All
            <ArrowUpRight className="h-4 w-4" />
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {safeOrders.slice(0, 5).map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 align-middle">
                    <span className="text-sm font-semibold text-gray-900">{order.orderId}</span>
                  </td>
                  <td className="py-4 px-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                        {order.customer?.name?.split(" ").map(n => n[0]).join("") || "C"}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{order.customer?.name || "Customer"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 align-middle">
                    <span className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="py-4 px-4 align-middle">
                    <span className="text-sm font-semibold text-gray-900">₹{order.pricing?.total || 0}</span>
                  </td>
                  <td className="py-4 px-4 align-middle">
                    <Badge variant={getStatusColor(order.status)} className="capitalize">
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-center align-middle">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsOrderModalOpen(true);
                      }}
                      className="text-gray-400 hover:text-primary transition-colors p-1"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Order Details"
      >
        {selectedOrder && (
          <div className="space-y-4 text-[13px] max-h-[70vh] overflow-y-auto px-1 sm:px-0 min-w-0">
            {/* Top summary card with accent stripe - stacks on small screens */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 shadow-lg shadow-slate-900/10 min-w-0">
              <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-primary via-indigo-400 to-emerald-400" />
              <div className="relative pl-3 min-w-0">
                <p className="text-[12px] font-semibold text-slate-200 uppercase tracking-[0.16em]">
                  Order #{selectedOrder.orderId}
                </p>
                <p className="mt-1 text-[12px] text-slate-300">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()} •{" "}
                  {new Date(selectedOrder.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="relative sm:text-right flex flex-col sm:items-end gap-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-[0.18em]">
                  Total Amount
                </p>
                <p className="text-xl sm:text-2xl font-black text-white leading-tight">
                  ₹{Number(selectedOrder.pricing?.total ?? 0).toLocaleString()}
                </p>
                <Badge
                  variant={getStatusColor(selectedOrder.status)}
                  className="capitalize px-3 py-0.5 text-[11px] font-semibold bg-white/10 text-white border-white/20 w-fit"
                >
                  {selectedOrder.status}
                </Badge>
              </div>
            </div>

            {/* Customer + address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100/80 bg-white px-4 py-3 space-y-1.5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em]">
                  Customer
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-700">
                    {selectedOrder.customer?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "C"}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900">
                      {selectedOrder.customer?.name || "Customer"}
                    </p>
                    {selectedOrder.customer?.phone && (
                      <p className="text-[12px] text-slate-500">
                        {selectedOrder.customer.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-100/80 bg-white px-4 py-3 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em] mb-1">
                  Delivery Address
                </p>
                <p className="text-[13px] text-slate-700 leading-relaxed">
                  {selectedOrder.address?.line1 && (
                    <>
                      {selectedOrder.address.line1}
                      {selectedOrder.address.line2
                        ? `, ${selectedOrder.address.line2}`
                        : ""}
                      {", "}
                    </>
                  )}
                  {selectedOrder.address?.city}
                  {selectedOrder.address?.state
                    ? `, ${selectedOrder.address.state}`
                    : ""}
                  {selectedOrder.address?.pincode
                    ? ` - ${selectedOrder.address.pincode}`
                    : ""}
                </p>
              </div>
            </div>

            {/* Items + summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em]">
                    Items
                  </p>
                  {Array.isArray(selectedOrder.items) && (
                    <p className="text-[11px] text-slate-400 font-medium">
                      {selectedOrder.items.length} item
                      {selectedOrder.items.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                  <ul className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {selectedOrder.items.map((item, idx) => (
                      <li
                        key={`${item.productId || item._id || idx}`}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                      >
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold text-slate-900">
                            {item.name || item.productName || "Item"}
                          </span>
                          <span className="text-[12px] text-slate-500">
                            Qty: {item.quantity ?? 1}
                          </span>
                        </div>
                        <span className="text-[13px] font-semibold text-slate-900">
                          ₹{Number(item.totalPrice ?? item.price ?? 0).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No line items available for this order.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em]">
                  Payment Summary
                </p>
                <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 space-y-1.5 text-[13px] text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span>
                      ₹{Number(selectedOrder.pricing?.subTotal ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>
                      ₹{Number(selectedOrder.pricing?.deliveryFee ?? 0).toLocaleString()}
                    </span>
                  </div>
                  {Number(selectedOrder.pricing?.discount ?? 0) > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>
                        -₹{Number(selectedOrder.pricing?.discount ?? 0).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="pt-1 mt-1 border-t border-dashed border-slate-200 flex justify-between text-xs font-semibold text-slate-900">
                    <span>Grand Total</span>
                    <span>
                      ₹{Number(selectedOrder.pricing?.total ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
