"use client";

import { useGameManager } from "@/hooks/use-game-manager";
import { useHandleMathSymbolInputKeypress } from "@/hooks/use-handle-input-keypress";
import { SymbolOutput } from "./SymbolOutput";
import { InputSymbol } from "@/lib/types";
import { MathSymbolButton } from "./MathSymbolInputButton";

const mathSymbols: InputSymbol[] = [
  "+",
  "0",
  "1",
  "2",
  "3",
  "*",
  "-",
  "4",
  "5",
  "6",
  "7",
  "/",
  "Enter",
  "8",
  "9",
  "Delete",
];

export function Game({ correctAnswer }: { correctAnswer: string }) {
  const { gameState, handleGameStateChange, evaluatedEquation } =
    useGameManager({
      correctAnswer,
    });

  useHandleMathSymbolInputKeypress(handleGameStateChange);

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center">
          Can you guess the equation?
        </h1>
        <h2 className="text-2xl font-bold text-center">
          {gameState.state === "playing" && (
            <span>
              Turn {Number(gameState.turn) + 1} of 6. Answer of equation:{" "}
              {evaluatedEquation}
            </span>
          )}
          {gameState.state === "won" && (
            <span>You won! The answer was {evaluatedEquation}</span>
          )}
          {gameState.state === "lost" && (
            <span>
              You lost! The answer was {correctAnswer} = {evaluatedEquation}
            </span>
          )}
        </h2>
      </div>
      {/* input / numpad */}
      <div className="flex flex-col w-96">
        {/* The result */}
        {Array.from({ length: 6 }).map((_, i) => (
          <SymbolOutput
            key={i}
            currentGuessRow={i}
            gameState={gameState}
            gameDone={gameState.state !== "playing"}
          />
        ))}
        <div className="w-0 h-12" />
        {/* The input buttons */}
        <div className="flex flex-row justify-evenly flex-wrap w-72">
          {mathSymbols.map((symbol) => (
            <MathSymbolButton
              key={symbol}
              symbol={symbol}
              onClick={handleGameStateChange}
            />
          ))}
        </div>
      </div>
    </>
  );
}
