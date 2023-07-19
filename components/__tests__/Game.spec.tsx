import { render, screen } from "@testing-library/react";
import { Game } from "../Game";

describe("Game", () => {
  it("renders the game board with an answer", () => {
    const correctAnswer = "120-10";

    render(<Game correctAnswer={correctAnswer} />);

    const equation = screen.getByText(/Answer of equation/i);

    expect(equation).toBeInTheDocument();
    expect(equation).toHaveTextContent("Answer of equation: 110");
  });
});
