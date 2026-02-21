import customerRoute from "./customerAuth.js";
import deliveryRoute from "./deliveryAuth.js";
import adminRoute from "./adminAuth.js";
import sellerRoute from "./sellerAuth.js";
import categoryRoute from "./categoryRoutes.js";
import productRoute from "./productRoutes.js";

const setupRoutes = (app) => {
    app.use("/customer", customerRoute);
    app.use("/delivery", deliveryRoute);
    app.use("/admin", adminRoute);
    app.use("/seller", sellerRoute);
    app.use("/admin/categories", categoryRoute);
    app.use("/products", productRoute);
}
export default setupRoutes;
