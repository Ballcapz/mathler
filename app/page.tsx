import { Game } from "@/components/Game";

const CORRECT_ANSWER = "119 - 41".replace(/\s/g, "");

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Game correctAnswer={CORRECT_ANSWER} />
    </main>
  );
}
