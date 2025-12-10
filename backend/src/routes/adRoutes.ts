import { Router } from "express";
import * as adController from "../controllers/adController.js";
import { authGuard } from "../middlewares/auth.js";
import { validateCreateAd,validateUpdateAd } from "../validators/adValidators.js";

const router = Router();

router.get("/", adController.getAds);
router.get("/me", authGuard, adController.getUserAds);
router.get("/:id", adController.getAdById);

router.post("/", authGuard, validateCreateAd, adController.createAd);

router.put("/:id", authGuard, validateUpdateAd, adController.updateAd);

router.delete("/:id", authGuard, adController.deleteUserAd);

export default router;