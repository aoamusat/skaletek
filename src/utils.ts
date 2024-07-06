import { Game } from "@prisma/client";
import crypto from "crypto";

export const generateGameId = () => {
  return crypto.randomUUID().replace(/-/g, "");
};

export type GameResponse = {
  message: string;
  game?: {
    id: number;
    playerName: string;
    attempts: number;
    status: string;
  };
};

export const generateRandomNumber = () => Math.floor(Math.random() * 100) + 1;

export const gameSummary = (game: Game) => {
  return {
    status: game.status,
    ...(game.status === "active" ? {} : { targetNumber: game.targetNumber }),
    attempts: game.attempts,
  };
};
