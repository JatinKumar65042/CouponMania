// const router = express.Router();
import { Router } from "express";
// const couponController = require("../controllers/controller");
import { getAllCoupons , getUnclaimedCoupons , getClaimedCoupons , generateCoupons , deleteAllCoupons , claimCoupon, toggleCouponAvailability } from "../controllers/coupon.controller.js";

// const { verifyToken, authorizedRoles } = require("../middleware/auth");
import { verifyToken , authorizedRoles } from "../middlewares/auth.middleware.js";

const router = Router() ;

router.get("/all", verifyToken, authorizedRoles("ADMIN"), getAllCoupons);

router.get("/unclaimed", verifyToken, authorizedRoles("ADMIN"), getUnclaimedCoupons);

router.get("/claimed", verifyToken, authorizedRoles("ADMIN"), getClaimedCoupons);

router.post("/generate", verifyToken, authorizedRoles("ADMIN"), generateCoupons);

router.post("/claim", claimCoupon);

router.post("/toggle-availability", verifyToken, authorizedRoles("ADMIN"), toggleCouponAvailability);

router.delete("/delete-all", verifyToken, authorizedRoles("ADMIN"), deleteAllCoupons);

export default router ;
