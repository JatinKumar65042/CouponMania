// const Coupon = require("../models/Coupon");
import {Coupon} from "../models/coupon.model.js";
import { v4 as uuidv4 } from "uuid";


const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json({ success: true, coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error fetching coupons", error });
    }
};

const getUnclaimedCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({ isClaimed: false });
        res.json({ success: true, coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error fetching unclaimed coupons", error });
    }
};

const getClaimedCoupons = async (req, res) => {
     try {
        const coupons = await Coupon.find({ isClaimed: true });
        res.json({ success: true, coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error fetching claimed coupons", error });
    }
};

const generateCoupons = async (req, res) => {
    const { numberOfCoupons } = req.body;

    if (!numberOfCoupons || numberOfCoupons <= 0) {
        return res.status(400).json({ success: false, message: "❌ Please enter a valid number of coupons" });
    }

    try {
        let coupons = [];
        for (let i = 0; i < numberOfCoupons; i++) {
            coupons.push({ code: uuidv4().toUpperCase(), isClaimed: false, isActive: true });
        }

        await Coupon.insertMany(coupons);
        res.json({ success: true, message: `✅ ${numberOfCoupons} coupons generated successfully!`, coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error generating coupons", error });
    }
};



const claimCoupon = async (req, res) => {
    try {
        const userIP = req.ip; 
        const userSession = req.cookies?.sessionId; 
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); 

        if (!userSession) {
            const sessionId = Math.random().toString(36).substring(2); 
            res.cookie("sessionId", sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 24 * 60 * 60 * 1000, 
            });
        }

        const recentClaim = await Coupon.findOne({
            $or: [
                { claimedBy: userIP, claimedAt: { $gte: oneDayAgo } }, 
                { claimedBy: userSession, claimedAt: { $gte: oneDayAgo } }, 
            ]
        });

        if (recentClaim) {
            return res.status(403).json({
                success: false,
                message: "❌ You have already claimed a coupon. Try again after 24 hours."
            });
        }

        const coupon = await Coupon.findOneAndUpdate(
            { isClaimed: false, isActive: true }, // ✅ Only claim active coupons
            { isClaimed: true, claimedBy: userSession || userIP, claimedAt: new Date() },
            { new: true }
        );

        if (!coupon) {
            return res.status(400).json({
                success: false,
                message: "❌ No available coupons at the moment."
            });
        }

        res.json({
            success: true,
            message: `✅ Coupon claimed successfully! Your coupon code is: ${coupon.code}`,
            coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌ Error claiming coupon",
            error: error.message
        });
    }
};

const toggleCouponAvailability = async (req, res) => {
    try {
        const { couponId, isActive } = req.body;
        
        if (!couponId || isActive === undefined) {
            return res.status(400).json({ success: false, message: "❌ Coupon ID and status are required" });
        }

        // ✅ Update only the specific coupon
        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            return res.status(404).json({ success: false, message: "❌ Coupon not found" });
        }

        coupon.isActive = isActive;
        await coupon.save(); // ✅ Save the updated coupon

        res.json({ success: true, message: `✅ Coupon ${isActive ? "enabled" : "disabled"} successfully!`, coupon });
    } catch (error) {
        console.error("❌ Error updating coupon status:", error);
        res.status(500).json({ success: false, message: "❌ Error updating coupon status", error });
    }
};

const deleteAllCoupons = async (req, res) => {
    try {
        await Coupon.deleteMany();
        res.json({ success: true, message: "✅ All coupons deleted!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error deleting coupons", error });
    }
};

export {
    getAllCoupons,
    getUnclaimedCoupons,
    getClaimedCoupons,
    generateCoupons,
    claimCoupon,
    deleteAllCoupons,
    toggleCouponAvailability,
}