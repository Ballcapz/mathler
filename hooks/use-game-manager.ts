"use client";

import { GameState, GuessState, InputSymbol } from "@/lib/types";
import { useRef, useState } from "react";
import { evaluate } from "mathjs";

export type GameManager = {
  gameState: GameState;
  // setGameState: (state: GameState) => void;
  handleGameStateChange: (symbol: InputSymbol) => void;
  evaluatedEquation: string;
};

const LAST_TURN = "5";

const INITIAL_GAME_STATE: GameState = {
  state: "playing",
  turn: "0",
  guesses: {
    "0": [],
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": [],
  },
};

export function useGameManager({
  correctAnswer,
  initialState = INITIAL_GAME_STATE,
}: {
  correctAnswer: string;
  initialState?: GameState;
}): GameManager {
  const [gameState, setGameState] = useState(initialState);

  const evaluatedAnswer = useRef(evaluate(correctAnswer));

  const handleGameStateChange = (symbol: InputSymbol) => {
    const currentTurnGuesses = gameState.guesses[gameState.turn];

    if (symbol === "Enter" && currentTurnGuesses.length === 6) {
      // check if correct
      const guess = currentTurnGuesses.map((guess) => guess.value).join("");
      const result = correctAnswer === guess;

      console.log(
        "guess",
        guess,
        "result",
        result,
        "correctAnswer",
        correctAnswer
      );

      // handle submit
      if (gameState.turn === LAST_TURN && result) {
        // set game state to won or lost
        setGameState({
          ...gameState,
          state: "won",
        });
        return;
      } else if (gameState.turn === LAST_TURN && !result) {
        setGameState({
          ...gameState,
          state: "lost",
        });
        return;
      } else if (result) {
        setGameState({
          ...gameState,
          state: "won",
        });
        return;
      } else {
        // still playing, increment turn
        setGameState({
          ...gameState,
          turn: String(Number(gameState.turn) + 1) as GameState["turn"],
        });
      }

      return;
    } else if (symbol === "Enter") {
      return;
    }

    if (symbol === "Delete") {
      if (currentTurnGuesses.length === 0) return;
      setGameState({
        ...gameState,
        guesses: {
          ...gameState.guesses,
          [gameState.turn]: currentTurnGuesses.slice(
            0,
            currentTurnGuesses.length - 1
          ),
        },
      });

      return;
    }

    if (currentTurnGuesses.length === 6) return;

    let guessState: GuessState = "incorrect";

    if (
      correctAnswer.includes(symbol) &&
      correctAnswer[currentTurnGuesses.length] === symbol
    ) {
      guessState = "correct";
    } else if (correctAnswer.includes(symbol)) {
      guessState = "in-wrong-place";
    } else {
      guessState = "incorrect";
    }

    const guess = {
      value: symbol,
      guessState,
    };

    setGameState({
      ...gameState,
      guesses: {
        ...gameState.guesses,
        [gameState.turn]: [...currentTurnGuesses, guess],
      },
    });
  };

  return {
    gameState,
    handleGameStateChange,
    evaluatedEquation: evaluatedAnswer.current,
  };
}
