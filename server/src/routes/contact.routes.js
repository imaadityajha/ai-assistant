import { Router } from "express";
import contactController from "../controllers/contact.controller.js";

const router = new Router();

// Public route - send contact message
router.route("/send").post(contactController.sendContactMessage);

// Public route - subscribe to newsletter
router.route("/subscribe").post(contactController.subscribeNewsletter);

// Admin routes (optional - for managing contact messages)
router.route("/all").get(contactController.getAllContactMessages);
router.route("/:id").get(contactController.getContactMessage);
router.route("/:id").patch(contactController.updateContactMessage);

export default router;
