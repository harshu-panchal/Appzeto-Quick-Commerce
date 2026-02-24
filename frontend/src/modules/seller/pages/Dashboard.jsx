import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@shared/components/ui/Card";
import PageHeader from "@shared/components/ui/PageHeader";
import Badge from "@shared/components/ui/Badge";
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes] = await Promise.all([
          sellerApi.getStats(),
          sellerApi.getOrders()
        ]);

        if (statsRes.data.success) {
          setStatsData(statsRes.data.result);
        }
        if (ordersRes.data.success) {
          setOrders(ordersRes.data.results || ordersRes.data.result || []);
        }
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      value: orders.filter(o => o.status === 'pending').length.toString(),
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
      color: "bg-primary text-white hover:bg-primary/90",
      path: "/seller/products/add",
    },
    {
      title: "Process Orders",
      description: "View and manage pending orders",
      icon: Truck,
      color: "bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary/5",
      path: "/seller/orders",
    },
    {
      title: "View Earnings",
      description: "Check your revenue and payouts",
      icon: DollarSign,
      color: "bg-white border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50",
      path: "/seller/earnings",
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

  if (loading) {
    return <div className="flex items-center justify-center h-screen font-bold text-gray-500">Updating Dashboard...</div>;
  }

  return (
    <div className="ds-section-spacing">
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
        {quickActions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.path)}
            className={cn(
              "p-6 rounded-xl text-left transition-all duration-200 shadow-sm hover:shadow-md",
              action.color
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-2 rounded-lg",
                action.color.includes("bg-primary") ? "bg-white/20" : "bg-gray-50"
              )}>
                <action.icon className={cn(
                  "h-5 w-5",
                  action.color.includes("bg-primary") ? "text-white" : "text-gray-600"
                )} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{action.title}</h3>
                <p className={cn(
                  "text-xs mt-1",
                  action.color.includes("bg-primary") ? "text-white/80" : "text-gray-500"
                )}>
                  {action.description}
                </p>
              </div>
              <ArrowUpRight className={cn(
                "h-4 w-4",
                action.color.includes("bg-primary") ? "text-white/60" : "text-gray-400"
              )} />
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card title="Revenue Overview" subtitle="Last 7 days performance" className="lg:col-span-2">
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statsData?.salesTrend || []}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
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
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-sm font-semibold text-gray-900">{order.orderId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                        {order.customer?.name?.split(" ").map(n => n[0]).join("") || "C"}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{order.customer?.name || "Customer"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-semibold text-gray-900">₹{order.pricing?.total || 0}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={getStatusColor(order.status)} className="capitalize">
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => navigate(`/seller/orders/${order.orderId}`)}
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
    </div>
  );
};

export default Dashboard;
