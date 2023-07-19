"use client";

import { InputSymbol } from "@/lib/types";
import { useHotkeys } from "react-hotkeys-hook";

export function useHandleMathSymbolInputKeypress(
  onInput: (symbol: InputSymbol) => void
): void {
  useHotkeys("0", () => onInput("0"));
  useHotkeys("1", () => onInput("1"));
  useHotkeys("2", () => onInput("2"));
  useHotkeys("3", () => onInput("3"));
  useHotkeys("4", () => onInput("4"));
  useHotkeys("5", () => onInput("5"));
  useHotkeys("6", () => onInput("6"));
  useHotkeys("7", () => onInput("7"));
  useHotkeys("8", () => onInput("8"));
  useHotkeys("9", () => onInput("9"));
  useHotkeys("-", () => onInput("-"), {
    ignoreEventWhen: (e) => {
      if (e.key === "/") return true;
      else return false;
    },
  });
  useHotkeys("*", () => onInput("*"), {
    ignoreEventWhen: (e) => {
      // ignore when NOT digit *
      if (e.key === "*") return false;
      else return true;
    },
  });
  useHotkeys("Enter", () => onInput("Enter")); // submit
  useHotkeys("Delete,Backspace", () => onInput("Delete"));

  useHotkeys("*", (e) => {
    if (e.code === "Slash") {
      onInput("/");
    } else if (e.key === "+") {
      onInput("+");
    }
  });
}
