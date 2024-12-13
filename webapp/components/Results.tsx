import { throwConfetti } from "./Confetti";

export default function Results({
  callback,
  points,
  gamePoints,
  answer,
  canPlayAgain,
  wasCorrect,
}: {
  points: number;
  gamePoints: number;
  answer: string;
  canPlayAgain: boolean;
  callback: () => void;
  wasCorrect: string;
}): JSX.Element {

  let resultMessage = "";

  if (gamePoints > 0) {
    if (wasCorrect) {
      console.log("was correct and points > 0 so throwing confetti")
      throwConfetti();
    }
    resultMessage = "Great job!"
  } else {
     resultMessage =  "Better luck next time!";
  }

  return (
    <div className="LetterGuessResults">
      <div className="message">{resultMessage}</div>
      <div className="answer">
        {answer.split("").map((ch) => (
          <span className="Letter">{ch}</span>
        ))}
      </div>
      <div>
        You {gamePoints > 0 ? "earned" : "lost"} {Math.abs(gamePoints)} points.
      </div>
      {canPlayAgain ? (
        <div>
          <button onClick={() => callback()}>Play Again</button>
        </div>
      ) : (
        <div>Come back tomorrow to play again!</div>
      )}
    </div>
  );
}
