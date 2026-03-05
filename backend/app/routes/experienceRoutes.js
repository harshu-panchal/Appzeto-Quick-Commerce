import express from "express";
import {
  getAdminExperienceSections,
  createExperienceSection,
  updateExperienceSection,
  deleteExperienceSection,
  reorderExperienceSections,
  getPublicExperienceSections,
  uploadBannerImage,
} from "../controller/experienceController.js";
import { verifyToken, allowRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Admin routes (protected)
router.get(
  "/admin/experience",
  verifyToken,
  allowRoles("admin"),
  getAdminExperienceSections
);

router.post(
  "/admin/experience",
  verifyToken,
  allowRoles("admin"),
  createExperienceSection
);

// Specific route MUST come before generic parameterized route
router.put(
  "/admin/experience/reorder",
  verifyToken,
  allowRoles("admin"),
  reorderExperienceSections
);

router.put(
  "/admin/experience/:id",
  verifyToken,
  allowRoles("admin"),
  updateExperienceSection
);

router.delete(
  "/admin/experience/:id",
  verifyToken,
  allowRoles("admin"),
  deleteExperienceSection
);

router.post(
  "/admin/experience/upload-banner",
  verifyToken,
  allowRoles("admin"),
  upload.single("image"),
  uploadBannerImage
);

// Public route
router.get("/experience", getPublicExperienceSections);

export default router;

