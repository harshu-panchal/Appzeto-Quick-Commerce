import Seller from "../models/seller.js";
import handleResponse from "../utils/helper.js";

/* ===============================
   GET SELLER PROFILE
================================ */
export const getSellerProfile = async (req, res) => {
    try {
        const seller = await Seller.findById(req.user.id);
        if (!seller) {
            return handleResponse(res, 404, "Seller not found");
        }
        return handleResponse(res, 200, "Seller profile fetched successfully", seller);
    } catch (error) {
        return handleResponse(res, 500, error.message);
    }
};

/* ===============================
   UPDATE SELLER PROFILE
================================ */
export const updateSellerProfile = async (req, res) => {
    try {
        const { name, shopName, phone } = req.body;

        // Find seller
        const seller = await Seller.findById(req.user.id);
        if (!seller) {
            return handleResponse(res, 404, "Seller not found");
        }

        // Update fields if provided
        if (name) seller.name = name;
        if (shopName) seller.shopName = shopName;
        if (phone) seller.phone = phone;

        const updatedSeller = await seller.save();

        return handleResponse(res, 200, "Profile updated successfully", updatedSeller);
    } catch (error) {
        // Handle duplicate phone error
        if (error.code === 11000) {
            return handleResponse(res, 400, "Phone number already in use");
        }
        return handleResponse(res, 500, error.message);
    }
};
