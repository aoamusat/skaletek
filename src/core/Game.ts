// import { prismaClient } from "../config/prisma";
// import { generateGameId } from "../utils";
// prismaClient;

// export class Game {
//   public playerName: string;
//   public gameId: string;
//   private numberToGuess: number;
//   public isCompleted: boolean;
//   public attempts: number[];
//   public status: string;

//   constructor(playerName: string) {
//     this.playerName = playerName;
//     this.gameId = generateGameId();
//     this.numberToGuess = Math.floor(Math.random() * 100) + 1;
//     this.isCompleted = false;
//     this.attempts = [];
//     this.status = "Lost";
//   }

//   async saveToDatabase() {
//     await prismaClient.game.create({
//       data: {
//         id: this.gameId,
//         target: this.numberToGuess,
//         totalAttempts: this.attempts.length,
//         winner: this.isCompleted && this.status === "Won" ? this.playerName : null,
//         players: {
//           create: {
//             username: this.playerName,
//             attempts: this.attempts.length,
//           },
//         },
//       },
//     });
//   }

//   async guessNumber(value: number) {
//     this.attempts.push(value);
//     if (value === this.numberToGuess) {
//       this.isCompleted = true;
//       this.status = "Won";
//       await prismaClient.game.update({
//         where: { id: this.gameId },
//         data: { totalAttempts: this.attempts.length, winner: this.playerName },
//       });
//       return "Correct";
//     } else if (value < this.numberToGuess) {
//       return "Low guess";
//     } else {
//       return "High guess";
//     }
//   }

//   gameSummary() {
//     return {
//       status: this.status,
//       ...(this.isCompleted ? { targetNumber: this.numberToGuess } : {}),
//       numOfTries: this.attempts.length,
//     };
//   }

//   async stop() {
//     this.isCompleted = true;
//     this.status = "Lost";
//     await prismaClient.game.update({
//       where: { id: this.gameId },
//       data: { totalAttempts: this.attempts.length, winner: null },
//     });
//   }
// }
