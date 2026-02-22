import React, { useState, useMemo } from "react";
import Card from "@shared/components/ui/Card";
import Badge from "@shared/components/ui/Badge";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineTruck,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineUser,
  HiOutlineInformationCircle,
} from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";

// Mock Data for Delivery Tracking
const MOCK_DELIVERIES = [
  {
    id: "DLV-001",
    orderId: "ORD-2023-103",
    status: "On the Way",
    deliveryBoy: {
      name: "Rahul Sharma",
      phone: "+91 98765 43210",
      avatar: "RS",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      rating: 4.8,
    },
    location: "2 mins away from customer",
    startTime: "10:45 AM",
    estimatedDelivery: "11:05 AM",
    customerName: "Mike Ross",
    address: "789 Pine St, Boston, MA",
  },
  {
    id: "DLV-002",
    orderId: "ORD-2023-102",
    status: "Picked Up",
    deliveryBoy: {
      name: "Amit Patel",
      phone: "+91 87654 32109",
      avatar: "AP",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      rating: 4.5,
    },
    location: "At your store",
    startTime: "02:15 PM",
    estimatedDelivery: "02:40 PM",
    customerName: "Sarah Miller",
    address: "456 Oak Lane, Riverside, CA",
  },
  {
    id: "DLV-003",
    orderId: "ORD-2023-105",
    status: "Delivered",
    deliveryBoy: {
      name: "Suresh Kumar",
      phone: "+91 76543 21098",
      avatar: "SK",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      rating: 4.9,
    },
    location: "Delivered at 09:30 AM",
    startTime: "09:00 AM",
    estimatedDelivery: "09:30 AM",
    customerName: "David Chen",
    address: "555 Cedar Rd, Miami, FL",
  },
];

const DeliveryTracking = () => {
  const [deliveries] = useState(MOCK_DELIVERIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Active");

  const tabs = ["Active", "Completed", "All"];

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((dlv) => {
      const matchesSearch =
        dlv.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dlv.deliveryBoy.name.toLowerCase().includes(searchTerm.toLowerCase());

      const isCompleted = dlv.status === "Delivered";
      if (activeTab === "Active") return matchesSearch && !isCompleted;
      if (activeTab === "Completed") return matchesSearch && isCompleted;
      return matchesSearch;
    });
  }, [deliveries, searchTerm, activeTab]);

  const stats = useMemo(
    () => [
      {
        label: "On the Way",
        value: deliveries.filter((d) => d.status === "On the Way").length,
        icon: HiOutlineTruck,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "At Store",
        value: deliveries.filter((d) => d.status === "Picked Up").length,
        icon: HiOutlineMapPin,
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
      {
        label: "Completed Today",
        value: deliveries.filter((d) => d.status === "Delivered").length,
        icon: HiOutlineCheckCircle,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
    ],
    [deliveries],
  );

  const getStatusVariant = (status) => {
    switch (status) {
      case "On the Way":
        return "info";
      case "Picked Up":
        return "warning";
      case "Delivered":
        return "success";
      default:
        return "primary";
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <BlurFade delay={0.1}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              Delivery Tracking
              <Badge
                variant="primary"
                className="text-[9px] px-1.5 py-0 font-bold tracking-wider uppercase bg-blue-100 text-blue-700">
                Live Fleet
              </Badge>
            </h1>
            <p className="text-slate-500 text-sm mt-0.5 font-medium">
              Monitor active deliveries and assigned delivery partners.
            </p>
          </div>
        </div>
      </BlurFade>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <BlurFade key={i} delay={0.1 + i * 0.05}>
            <MagicCard
              className="border-none shadow-sm ring-1 ring-slate-100 p-0 overflow-hidden group bg-white"
              gradientColor={
                stat.color === "text-blue-600"
                  ? "#e0f2fe"
                  : stat.color === "text-amber-600"
                    ? "#fef3c7"
                    : "#dcfce7"
              }>
              <div className="flex items-center gap-4 p-5 relative z-10">
                <div
                  className={cn(
                    "h-14 w-14 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-sm",
                    stat.bg,
                    stat.color,
                  )}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <h4 className="text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
                    {stat.value}
                  </h4>
                </div>
              </div>
            </MagicCard>
          </BlurFade>
        ))}
      </div>

      <BlurFade delay={0.3}>
        <Card className="border-none shadow-xl ring-1 ring-slate-100 overflow-hidden rounded-lg bg-white">
          {/* Tabs & Search */}
          <div className="border-b border-slate-100 bg-slate-50/30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6">
              <div className="flex items-center">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "relative py-5 px-6 text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                      activeTab === tab
                        ? "text-primary bg-white/50"
                        : "text-slate-400 hover:text-slate-600",
                    )}>
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="tab-underline-tracking"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full mx-4"
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="py-3 lg:py-0 w-full lg:w-72">
                <div className="relative group">
                  <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-all" />
                  <input
                    type="text"
                    placeholder="Search Order ID or Partner..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border-none rounded-lg text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery List */}
          <div className="p-6 space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredDeliveries.map((dlv, idx) => (
                <motion.div
                  key={dlv.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative bg-white rounded-lg border border-slate-100 p-1 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500">
                  <div className="flex flex-col lg:flex-row items-stretch gap-1">
                    {/* Partner Info Section */}
                    <div className="lg:w-1/3 p-5 bg-slate-50/50 rounded-lg border border-transparent group-hover:bg-primary/[0.02] group-hover:border-primary/5 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="h-16 w-16 rounded-lg overflow-hidden ring-4 ring-white shadow-md">
                            <img
                              src={dlv.deliveryBoy.image}
                              alt={dlv.deliveryBoy.name}
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-md border-2 border-white flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                            {dlv.deliveryBoy.rating}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-0.5">
                            Delivery Partner
                          </p>
                          <h3 className="text-base font-black text-slate-900 leading-none">
                            {dlv.deliveryBoy.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <a
                              href={`tel:${dlv.deliveryBoy.phone}`}
                              className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg text-[11px] font-black text-slate-800 shadow-sm border border-slate-100 hover:bg-primary hover:text-white hover:border-primary transition-all">
                              <HiOutlinePhone className="h-3.5 w-3.5" />
                              {dlv.deliveryBoy.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Info Section */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-black text-slate-900 tracking-tight">
                              #{dlv.orderId}
                            </span>
                            <Badge
                              variant={getStatusVariant(dlv.status)}
                              className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                              {dlv.status}
                            </Badge>
                          </div>
                          <h4 className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                            <HiOutlineUser className="h-3.5 w-3.5 text-slate-400" />
                            Customer:{" "}
                            <span className="text-slate-900 capitalize">
                              {dlv.customerName}
                            </span>
                          </h4>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Order Time
                          </p>
                          <p className="text-sm font-black text-primary tracking-tight">
                            {dlv.startTime}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <HiOutlineMapPin className="h-3.5 w-3.5 text-primary" />
                          Customer Address
                        </p>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">
                          {dlv.address}
                        </p>
                      </div>
                    </div>

                    {/* Action Button Section */}
                    <div className="lg:w-16 flex items-center justify-center p-3">
                      <button className="h-10 w-10 lg:h-full lg:w-full bg-slate-900 group-hover:bg-primary rounded-lg lg:rounded-r-lg lg:rounded-l-none flex items-center justify-center text-white transition-all duration-500 shadow-xl shadow-slate-900/10 hover:shadow-primary/30">
                        <HiOutlineTruck className="h-5 w-5 group-hover:scale-125 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredDeliveries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                <div className="h-20 w-20 bg-white rounded-lg flex items-center justify-center shadow-sm mb-4">
                  <HiOutlineTruck className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  No active tracking found
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">
                  Adjust filters or search terms
                </p>
              </div>
            )}
          </div>
        </Card>
      </BlurFade>
    </div>
  );
};

export default DeliveryTracking;
