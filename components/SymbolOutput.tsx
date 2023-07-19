"use client";

import { GameState, Guess } from "@/lib/types";

function OneSymbol({
  isCurrentGuessRow,
  guess,
  gameDone,
}: {
  isCurrentGuessRow: boolean;
  guess: Guess;
  gameDone: boolean;
}) {
  const shouldStyleSymbol = !isCurrentGuessRow || gameDone;

  const isCorrectGuess = guess?.guessState === "correct" && shouldStyleSymbol;
  const isInWrongPlaceGuess =
    guess?.guessState === "in-wrong-place" && shouldStyleSymbol;

  const baseStyle =
    "text-black rounded-lg shadow-lg p-4 m-1 w-10 h-12 text-center";
  const defaultStyle = `bg-white ${baseStyle}`;
  const correctStyle = `bg-green-400 ${baseStyle}`;
  const inWrongPlaceStyle = `bg-yellow-300 ${baseStyle}`;

  return (
    <div
      className={
        isCorrectGuess
          ? correctStyle
          : isInWrongPlaceGuess
          ? inWrongPlaceStyle
          : defaultStyle
      }
    >
      {guess?.value}
    </div>
  );
}

// one guess row
export function SymbolOutput({
  currentGuessRow,
  gameState,
  gameDone,
}: {
  currentGuessRow: number;
  gameState: GameState;
  gameDone: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        {Array.from({ length: 6 }).map((_, j) => {
          const isCurrentGuessRow = Number(gameState.turn) === currentGuessRow;
          // @ts-ignore
          const guessRow = gameState.guesses[currentGuessRow] as Guess[];

          return (
            <OneSymbol
              key={j}
              isCurrentGuessRow={isCurrentGuessRow}
              guess={guessRow[j]}
              gameDone={gameDone}
            />
          );
        })}
      </div>
    </div>
  );
}
