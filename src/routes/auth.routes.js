import express from "express";
import passport from "passport";
import { assignTask } from "../controllers/assign.controller.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/unauthorized" }),
  (req, res) => res.redirect("/dashboard")
);

router.post("/assign", assignTask);

export default router;
