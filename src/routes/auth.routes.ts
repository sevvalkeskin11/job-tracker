import { Router } from "express";
import { loginHandler, registerHandler } from "../controllers/auth.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(registerHandler));
router.post("/login", validate(loginSchema), asyncHandler(loginHandler));

export default router;
