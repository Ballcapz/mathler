export type InputSymbol =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "+"
  | "-"
  | "*"
  | "/"
  | "Enter"
  | "Delete";

export type GuessState = "correct" | "incorrect" | "in-wrong-place";

export type Guess = {
  value: InputSymbol;
  guessState: GuessState;
};

export type GameState = {
  state: "playing" | "won" | "lost";
  turn: "0" | "1" | "2" | "3" | "4" | "5";
  guesses: {
    [key in "0" | "1" | "2" | "3" | "4" | "5" | 0 | 1 | 2 | 3 | 4 | 5]: Guess[];
  };
};
