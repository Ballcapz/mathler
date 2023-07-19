import { act, renderHook, waitFor } from "@testing-library/react";
import { useGameManager } from "../use-game-manager";
import { GameState } from "@/lib/types";

const CORRECT_ANSWER = "120-10";

describe("useGameManager", () => {
  it("should return a game manager", () => {
    const { result } = renderHook(() =>
      useGameManager({ correctAnswer: CORRECT_ANSWER })
    );
    expect(result.current).toBeDefined();
    expect(result.current.gameState).toBeDefined();
    expect(result.current.gameState.state).toBe("playing");
    expect(result.current.gameState.turn).toBe("0");
    Object.entries(result.current.gameState.guesses).forEach((guess) => {
      expect(guess[1]).toEqual([]);
    });
    expect(result.current.evaluatedEquation).toBe(110);
  });

  describe("handleGameStateChange", () => {
    it("should add a guess to the current turn", async () => {
      const { result } = renderHook(() =>
        useGameManager({ correctAnswer: CORRECT_ANSWER })
      );

      act(() => {
        result.current.handleGameStateChange("1");
      });

      await waitFor(() => {
        expect(result.current.gameState.guesses["0"][0].value).toEqual("1");
        expect(result.current.gameState.guesses["0"][0].guessState).toEqual(
          "correct"
        );
      });
    });

    it("should add multiple guesses to the current turn", async () => {
      const { result } = renderHook(() =>
        useGameManager({ correctAnswer: CORRECT_ANSWER })
      );

      act(() => {
        result.current.handleGameStateChange("1");
      });

      await waitFor(() => {
        expect(result.current.gameState.guesses["0"][0].value).toEqual("1");
        expect(result.current.gameState.guesses["0"][0].guessState).toEqual(
          "correct"
        );
      });

      act(() => {
        result.current.handleGameStateChange("2");
      });

      await waitFor(() => {
        expect(result.current.gameState.guesses["0"][0].value).toEqual("1");
        expect(result.current.gameState.guesses["0"][0].guessState).toEqual(
          "correct"
        );
        expect(result.current.gameState.guesses["0"][1].value).toEqual("2");
        expect(result.current.gameState.guesses["0"][1].guessState).toEqual(
          "correct"
        );
      });
    });

    it("should add a guess to the next turn after the first turn is complete but not successful", async () => {
      const { result } = renderHook(() =>
        useGameManager({ correctAnswer: CORRECT_ANSWER })
      );

      act(() => {
        result.current.handleGameStateChange("1");
      });
      act(() => {
        result.current.handleGameStateChange("2");
      });
      act(() => {
        result.current.handleGameStateChange("1");
      });
      act(() => {
        result.current.handleGameStateChange("2");
      });
      act(() => {
        result.current.handleGameStateChange("1");
      });
      act(() => {
        result.current.handleGameStateChange("2");
      });

      act(() => {
        result.current.handleGameStateChange("Enter");
      });

      await waitFor(() => {
        expect(result.current.gameState.turn).toEqual("1");
        expect(result.current.gameState.state).toEqual("playing");
      });

      act(() => {
        result.current.handleGameStateChange("1");
      });

      await waitFor(() => {
        expect(result.current.gameState.guesses["1"][0].value).toEqual("1");
        expect(result.current.gameState.guesses["1"][0].guessState).toEqual(
          "correct"
        );
      });
    });

    it('should update state to "won" when the correct answer is guessed', async () => {
      const { result } = renderHook(() =>
        useGameManager({ correctAnswer: CORRECT_ANSWER })
      );

      act(() => {
        result.current.handleGameStateChange("1");
      });
      act(() => {
        result.current.handleGameStateChange("2");
      });
      act(() => {
        result.current.handleGameStateChange("0");
      });
      act(() => {
        result.current.handleGameStateChange("-");
      });
      act(() => {
        result.current.handleGameStateChange("1");
      });
      act(() => {
        result.current.handleGameStateChange("0");
      });

      act(() => {
        result.current.handleGameStateChange("Enter");
      });

      await waitFor(() => {
        expect(result.current.gameState.state).toEqual("won");
      });
    });

    it('should update state to "lost" when the incorrect answer is guessed on the last turn', async () => {
      const MOCK_INITIAL_STATE: GameState = {
        state: "playing",
        turn: "5",
        guesses: {
          "0": Array(6).fill({ value: "1", guessState: "incorrect" }),
          "1": Array(6).fill({ value: "1", guessState: "incorrect" }),
          "2": Array(6).fill({ value: "1", guessState: "incorrect" }),
          "3": Array(6).fill({ value: "1", guessState: "incorrect" }),
          "4": Array(6).fill({ value: "1", guessState: "incorrect" }),
          "5": [],
        },
      };

      const { result } = renderHook(() =>
        useGameManager({
          correctAnswer: CORRECT_ANSWER,
          initialState: MOCK_INITIAL_STATE,
        })
      );

      act(() => {
        result.current.handleGameStateChange("1");
      });
      act(() => {
        result.current.handleGameStateChange("2");
      });
      act(() => {
        result.current.handleGameStateChange("0");
      });
      act(() => {
        result.current.handleGameStateChange("+");
      });
      act(() => {
        result.current.handleGameStateChange("0");
      });
      act(() => {
        result.current.handleGameStateChange("1");
      });

      act(() => {
        result.current.handleGameStateChange("Enter");
      });

      await waitFor(() => {
        expect(result.current.gameState.state).toEqual("lost");
      });
    });

    it("should no-op when enter is pressed and there is not a full guess for the current turn", async () => {
      const { result } = renderHook(() =>
        useGameManager({ correctAnswer: CORRECT_ANSWER })
      );

      act(() => {
        result.current.handleGameStateChange("1");
      });
      act(() => {
        result.current.handleGameStateChange("2");
      });
      act(() => {
        result.current.handleGameStateChange("Enter");
      });

      await waitFor(() => {
        expect(result.current.gameState.turn).toEqual("0");
        expect(result.current.gameState.state).toEqual("playing");
        expect(result.current.gameState.guesses["0"].length).toEqual(2);
      });
    });

    it("should delete the last guess when backspace is pressed", async () => {
      const { result } = renderHook(() =>
        useGameManager({ correctAnswer: CORRECT_ANSWER })
      );

      act(() => {
        result.current.handleGameStateChange("1");
      });
      act(() => {
        result.current.handleGameStateChange("2");
      });
      act(() => {
        result.current.handleGameStateChange("Delete");
      });

      await waitFor(() => {
        expect(result.current.gameState.guesses["0"].length).toEqual(1);
      });
    });

    it("should no-op when there are no guesses for the current turn and backspace is pressed", async () => {
      const { result } = renderHook(() =>
        useGameManager({ correctAnswer: CORRECT_ANSWER })
      );

      act(() => {
        result.current.handleGameStateChange("Delete");
      });

      await waitFor(() => {
        expect(result.current.gameState.guesses["0"].length).toEqual(0);
      });
    });

    it("should no-op when there are max-guesses for the current turn and a valid input key is pressed", async () => {
      const { result } = renderHook(() =>
        useGameManager({ correctAnswer: CORRECT_ANSWER })
      );

      act(() => {
        result.current.handleGameStateChange("1");
      });
      act(() => {
        result.current.handleGameStateChange("2");
      });
      act(() => {
        result.current.handleGameStateChange("3");
      });
      act(() => {
        result.current.handleGameStateChange("4");
      });
      act(() => {
        result.current.handleGameStateChange("5");
      });
      act(() => {
        result.current.handleGameStateChange("6");
      });
      act(() => {
        result.current.handleGameStateChange("7");
      });

      await waitFor(() => {
        expect(result.current.gameState.guesses["0"].length).toEqual(6);
      });
    });
  });
});
