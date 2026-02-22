import customerRoute from "./customerAuth.js";
import deliveryRoute from "./deliveryAuth.js";
import adminRoute from "./adminAuth.js";
import sellerRoute from "./sellerAuth.js";
import categoryRoute from "./categoryRoutes.js";
import productRoute from "./productRoutes.js";



import express from "express";

const setupRoutes = (app) => {
    const router = express.Router();

    router.use("/customer", customerRoute);
    router.use("/delivery", deliveryRoute);
    router.use("/admin", adminRoute);
    router.use("/seller", sellerRoute);
    router.use("/admin/categories", categoryRoute);
    router.use("/products", productRoute);



    app.use("/api", router);
}
export default setupRoutes;
