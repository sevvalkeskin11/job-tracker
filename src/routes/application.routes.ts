import { Router } from "express";
import {
  createHandler,
  deleteHandler,
  getHandler,
  listHandler,
  updateHandler,
} from "../controllers/application.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createApplicationSchema, updateApplicationSchema } from "../schemas/application.schema";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listHandler));
router.get("/:id", asyncHandler(getHandler));
router.post("/", validate(createApplicationSchema), asyncHandler(createHandler));
router.patch("/:id", validate(updateApplicationSchema), asyncHandler(updateHandler));
router.delete("/:id", asyncHandler(deleteHandler));

export default router;
