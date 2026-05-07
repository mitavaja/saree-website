import express from "express";
import {
  getPrivacyPolicy,
  updatePrivacyPolicy,
  getTerms,
  updateTerms,
  getReturnPolicy,
  updateReturnPolicy,
  getShippingPolicy,
  updateShippingPolicy
} from "../controllers/policyController.js";

const router = express.Router();
// privacy
router.get("/privacy", getPrivacyPolicy);
router.post("/privacy", updatePrivacyPolicy);
// terms
router.get("/terms", getTerms);
router.post("/terms", updateTerms);
// return
router.get("/return", getReturnPolicy);
router.post("/return", updateReturnPolicy);
// shipping
router.get("/shipping", getShippingPolicy);
router.post("/shipping", updateShippingPolicy);
export default router;