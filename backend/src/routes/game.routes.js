
import { Router } from "express";
import {
  getGameController,
  listGamesController,
} from "../controllers/game.controller.js";

const router = Router();

// Keep these routes read-only for the public catalog.
// Administrative editing will be added in the data-governance phase.
router.get("/", listGamesController);
router.get("/:slug", getGameController);

export default router;