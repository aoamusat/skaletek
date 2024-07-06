import { Request, Response } from "express";
// import { Game } from "../core/Game";
import { prismaClient } from "../config/prisma";
import { GameResponse, gameSummary, generateRandomNumber } from "../utils";

// To be replace with DB
// const games: { [key: string]: Game } = {};

export const startGame = async (request: Request, response: Response) => {
  const { playerName } = request.body;
  if (!playerName) {
    return response.status(400).json({ message: "Player name is required" });
  }

  // const gameObject = new Game(playerName);

  const game = await prismaClient.game.create({
    data: {
      playerName: playerName,
      targetNumber: generateRandomNumber(),
    },
  });

  return response.json({ message: "New game started", gameId: game.id });
};

export const guessNumber = async (request: Request, response: Response) => {
  const { gameId, number } = request.body;
  if (!gameId || !number) {
    return response.status(400).json({ message: "Game ID and guess number are required" });
  }

  const game = await prismaClient.game.findUnique({ where: { id: gameId } });
  if (!game) {
    return response.status(404).json({ message: "Game not found!" });
  }
  if (game.status !== "active") {
    return response.json({ message: "Game already completed", ...gameSummary(game) });
  }

  await prismaClient.guess.create({
    data: { gameId, number },
  });

  const updatedGame = await prismaClient.game.update({
    where: { id: gameId },
    data: { attempts: { increment: 1 } },
  });

  let message: string;
  if (number === game.targetNumber) {
    message = "Correct guess! You win!";
    await prismaClient.game.update({
      where: { id: gameId },
      data: { status: "completed" },
    });
  } else if (number < game.targetNumber) {
    message = "Too low, try again!";
  } else {
    message = "Too high, try again!";
  }

  return response.json({ message, ...gameSummary(updatedGame) });
};

export const stopGame = async (request: Request, response: Response) => {
  const { gameId } = request.body;
  if (!gameId) {
    return response.status(400).json({ message: "Game ID is required" });
  }

  const game = await prismaClient.game.findUnique({ where: { id: gameId } });
  if (!game) {
    return response.status(404).json({ message: "Game not found" });
  }

  await prismaClient.game.update({
    where: { id: gameId },
    data: { status: "completed" },
  });

  const message = game.status === "completed" ? "You won!" : "Game over!";

  response.json({ message, ...gameSummary(game) });
};
