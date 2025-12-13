import express from "express";
import { speakWithElevenLabs } from "../controllers/ttsController.js";

const router = express.Router();

router.post("/speak", speakWithElevenLabs);

export default router;
