import React from "react";
import {
  Bell,
  ArrowLeft,
  Calendar,
  Megaphone,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/shared/components/ui/Button";
import Card from "@/shared/components/ui/Card";

const Notifications = () => {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      type: "order",
      title: "New High Demand Area!",
      message:
        "Indiranagar is experiencing high order volume. Go there to earn 1.5x surge pricing!",
      time: "2 mins ago",
      read: false,
    },
    {
      id: 2,
      type: "incentive",
      title: "Weekly Incentive Unlocked",
      message:
        "Congratulations! You have completed 50 orders this week. ₹500 bonus added to your wallet.",
      time: "2 hours ago",
      read: true,
    },
    {
      id: 3,
      type: "payment",
      title: "Payout Processed",
      message:
        "Your weekly payout of ₹4,250 has been processed and will reflect in your bank account by tomorrow.",
      time: "Yesterday",
      read: true,
    },
    {
      id: 4,
      type: "app",
      title: "App Update Available",
      message:
        "New features added to improve battery life. Update now for better experience.",
      time: "2 days ago",
      read: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-30 backdrop-blur-md bg-white/90">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="ds-h3 text-gray-900">Notifications</h1>
      </div>

      <motion.div
        className="p-4 space-y-3 max-w-lg mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        {notifications.map((notification) => (
          <motion.div key={notification.id} variants={itemVariants}>
            <Card
              className={`p-4 border-none shadow-sm relative overflow-hidden ${
                !notification.read
                  ? "bg-blue-50/50 border-l-4 border-l-blue-500"
                  : "bg-white"
              }`}>
              {!notification.read && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              )}

              <div className="flex items-start">
                <div
                  className={`p-3 rounded-full mr-4 flex-shrink-0 ${
                    notification.type === "order"
                      ? "bg-orange-100 text-orange-600"
                      : notification.type === "incentive"
                        ? "bg-yellow-100 text-yellow-600"
                        : notification.type === "payment"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                  }`}>
                  {notification.type === "order" && <Megaphone size={20} />}
                  {notification.type === "incentive" && (
                    <CheckCircle size={20} />
                  )}
                  {notification.type === "payment" && <CheckCircle size={20} />}
                  {notification.type === "app" && <Bell size={20} />}
                </div>

                <div>
                  <h3
                    className={`font-bold text-gray-900 mb-1 ${!notification.read ? "text-black" : ""}`}>
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="ds-caption text-gray-400 font-medium">
                    {notification.time}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {notifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-gray-400" />
            </div>
            <h3 className="ds-h3 text-gray-900">No Notifications</h3>
            <p className="text-gray-500 text-sm">You're all caught up!</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Notifications;
