import { InputSymbol } from "@/lib/types";

export function MathSymbolButton({
  symbol,
  onClick,
}: {
  symbol: InputSymbol;
  onClick: (symbol: InputSymbol) => void;
}) {
  return (
    <button
      className={`bg-white text-black rounded-lg shadow-lg p-3 m-1 hover:bg-slate-400 h-12 ${
        isWide(symbol) ? "w-20" : "w-10"
      }`}
      onClick={() => onClick(symbol)}
    >
      {symbol}
    </button>
  );
}

function isWide(symbol: InputSymbol) {
  return symbol === "Enter" || symbol === "Delete";
}
