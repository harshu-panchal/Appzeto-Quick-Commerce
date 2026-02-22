import React from "react";
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

const revenueData = [
  { date: "Jan 1", revenue: 4200, orders: 24 },
  { date: "Jan 8", revenue: 5100, orders: 32 },
  { date: "Jan 15", revenue: 4800, orders: 28 },
  { date: "Jan 22", revenue: 6200, orders: 38 },
  { date: "Jan 29", revenue: 7100, orders: 42 },
  { date: "Feb 5", revenue: 6800, orders: 40 },
  { date: "Feb 12", revenue: 8200, orders: 48 },
];

const productPerformance = [
  { name: "Electronics", sales: 4200 },
  { name: "Fashion", sales: 3800 },
  { name: "Home", sales: 2900 },
  { name: "Beauty", sales: 2400 },
  { name: "Sports", sales: 1800 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Total Revenue",
      value: "$12,450",
      change: "+12.5%",
      changeType: "increase",
      icon: DollarSign,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      description: "vs last month",
    },
    {
      label: "Total Orders",
      value: "156",
      change: "+8.2%",
      changeType: "increase",
      icon: ShoppingBag,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "vs last month",
    },
    {
      label: "Active Products",
      value: "24",
      change: "+2",
      changeType: "increase",
      icon: Package,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      description: "new this week",
    },
    {
      label: "Pending Orders",
      value: "8",
      change: "-3",
      changeType: "decrease",
      icon: Clock,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      description: "need attention",
    },
  ];

  const recentOrders = [
    { id: "#ORD-2401", customer: "John Smith", date: "2 mins ago", amount: "$145.00", status: "pending" },
    { id: "#ORD-2402", customer: "Sarah Johnson", date: "15 mins ago", amount: "$89.50", status: "processing" },
    { id: "#ORD-2403", customer: "Mike Wilson", date: "1 hour ago", amount: "$234.00", status: "shipped" },
    { id: "#ORD-2404", customer: "Emma Davis", date: "2 hours ago", amount: "$67.25", status: "delivered" },
    { id: "#ORD-2405", customer: "David Brown", date: "3 hours ago", amount: "$198.00", status: "delivered" },
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
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "shipped":
        return "default";
      case "delivered":
        return "success";
      default:
        return "default";
    }
  };

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
        <Card title="Revenue Overview" subtitle="Last 7 weeks performance" className="lg:col-span-2">
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
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
                  dataKey="revenue"
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
              <BarChart data={productPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
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
                <Bar dataKey="sales" fill="#4f46e5" radius={[0, 4, 4, 0]} />
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
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-sm font-semibold text-gray-900">{order.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                        {order.customer.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{order.customer}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{order.date}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-semibold text-gray-900">{order.amount}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={getStatusColor(order.status)} className="capitalize">
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => navigate(`/seller/orders/${order.id}`)}
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
