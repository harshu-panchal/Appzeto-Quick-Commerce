import customerRoute from "./customerAuth.js";
import deliveryRoute from "./deliveryAuth.js";
import adminRoute from "./adminAuth.js";
import sellerRoute from "./sellerAuth.js";
import categoryRoute from "./categoryRoutes.js";
import productRoute from "./productRoutes.js";
import cartRoute from "./cartRoutes.js";
import wishlistRoute from "./wishlistRoutes.js";
import orderRoute from "./orderRoutes.js";
import paymentRoute from "./paymentRoutes.js";
import notificationRoute from "./notificationRoutes.js";
import ticketRoute from "./ticketRoutes.js";
import reviewRoute from "./reviewRoutes.js";

import express from "express";

const setupRoutes = (app) => {
    const router = express.Router();

    router.use("/customer", customerRoute);
    router.use("/delivery", deliveryRoute);
    router.use("/admin", adminRoute);
    router.use("/seller", sellerRoute);
    router.use("/categories", categoryRoute);
    router.use("/admin/categories", categoryRoute);
    router.use("/products", productRoute);
    router.use("/cart", cartRoute);
    router.use("/wishlist", wishlistRoute);
    router.use("/orders", orderRoute);
    router.use("/payments", paymentRoute);
    router.use("/notifications", notificationRoute);
    router.use("/tickets", ticketRoute);
    router.use("/reviews", reviewRoute);

    app.use("/api", router);
}
export default setupRoutes;
