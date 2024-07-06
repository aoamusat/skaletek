import express from "express";
import { guessNumber, startGame, stopGame } from "./controller/game.controller";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.post("/api/v1/start", startGame);
app.post("/api/v1/guess", guessNumber);
app.post("/api/v1/stop/:gameId", stopGame);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
