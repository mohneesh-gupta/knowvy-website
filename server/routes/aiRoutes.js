// import express from "express";
// import { protect } from "../middleware/protect.js";
// import { chatWithAI, streamChat, getHistory } from "../controllers/aiController.js";

// const router = express.Router();

// router.post("/chat", protect, chatWithAI);
// router.post("/stream", protect, streamChat);
// router.get("/history", protect, getHistory);

// export default router;

import express from "express";
import { chatWithAI, streamChat, getHistory } from "../controllers/aiController.js";

const router = express.Router();

// REMOVE protect middleware
router.post("/chat", chatWithAI);
router.post("/stream", streamChat);
router.get("/history", getHistory);

export default router;
