import { useEffect, useState } from "react";

import { sendToDevvit } from "./devvit/utils";
import AnswerBox from "./components/AnswerBox";
import { GameKeyboard } from "./components/Letters";
import Results from "./components/Results";
import UserHUD from "./components/UserHUD";
import {
  createMessage,
  DevvitMessageType,
  MSG_TYPE_D_NEW_GAME,
  MSG_TYPE_W_GAME_OVER,
  MSG_TYPE_W_NEW_GAME,
  MSG_TYPE_W_READY,
} from "../shared/msgUtils";

import { testMsg1 } from "./test/testMessages";

const TESTING=false; // TODO - if going beyond this simple POC, improve this

export type GAME_STATE =
  | "loading"
  | "ineligible"
  | "playing"
  | "overWon"
  | "overLost";

export const App = () => {
  const [username, setUsername] = useState("");
  const [answer, setAnswer] = useState("");
  const initialAnswer = answer.replace(/./g, "*");
  const [userAnswer, setUserAnswer] = useState(initialAnswer);
  const [guesses, setGuesses] = useState<String[]>([]);
  const [gameState, setGameState] = useState<GAME_STATE>("loading");
  const [points, setPoints] = useState(0); // all time points total
  const [gamePoints, setGamePoints] = useState(0);
  // TODO - add points just for this game
  // TODO - add points just for this session (day)

  // TODO - consolidate audio into manager/player
  const incorrectAudio = new Audio("assets/sfx/incorrect.mp3");
  incorrectAudio.volume = 0.5;
  const correctAudio = new Audio("assets/sfx/correct.mp3");
  correctAudio.volume = 0.5;
  const gameWonAudio = new Audio("assets/sfx/gameWon.mp3");
  gameWonAudio.volume = 0.5;
  const gameLostAudio = new Audio("assets/sfx/gameLost.mp3");
  gameLostAudio.volume = 0.5;
  let backgroundMusic: HTMLAudioElement = new Audio(
    "assets/sfx/backgroundMusic.mp3",
  );
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.1;

  useEffect(() => {
    sendToDevvit(createMessage({ type: MSG_TYPE_W_READY }));

    window.addEventListener("message", onDevvitMessage);

    if(backgroundMusic.paused) backgroundMusic.play();

    if(TESTING) { window.postMessage(testMsg1, "*"); }
  }, []);

  const onDevvitMessage = (event: MessageEvent) => {
    // console.log("event: ", event);
    if (event.data.type === DevvitMessageType) {
      console.log("Received from Devvit:", event.data);


      var contents = event.data.data.message;
      // console.log("contents: ", contents);
      if (contents.type === MSG_TYPE_D_NEW_GAME) {
        onNewGame(
          contents.username,
          contents.newWord,
          contents.userTotalPoints,
        );
      }
    }
  };

  const onNewGame = (
    newGameUsername: string,
    newGameWord: string,
    newUserTotalPoints: number,
  ) => {
    setUsername(newGameUsername);
    setNewAnswer(newGameWord);
    setPoints(newUserTotalPoints);
    setGamePoints(0);

    if(backgroundMusic.paused) backgroundMusic.play();

    if (newUserTotalPoints <= 0) {
      setGameState("ineligible");
    } else {
      setGameState("playing");
    }
  };

  const handleAnswer = (guess: string) => {
    const vowels = ["a", "e", "i", "o", "u"]; // cost 3 points for a wrong guess
    const commonLetters = ["r", "t", "s", "l", "n"]; // cost 2 points for a wrong guess

    const allGuesses = guesses.includes(guess)
      ? guesses
      : guesses.concat(guess);
    setGuesses(allGuesses);

    let displayAnswer = "";
    let numRemaining = 0;
    let mistake = true;
    for (let i = 0; i < answer.length; i++) {
      let c = answer.charAt(i);
      if (allGuesses.includes(c)) {
        displayAnswer += c;
        if (guess == c) mistake = false;
        // TODO - tell keyboard to display this char as incorrect
      } else {
        displayAnswer += "*";
        numRemaining += 1;
      }
    }
    setUserAnswer(displayAnswer);

    if (numRemaining <= 0) {
      onGameOver(mistake ? "overLost" : "overWon");
    } else {
      if (mistake) {
        incorrectAudio.play();

        let errorPoints = 1;
        if (commonLetters.includes(guess)) {
          errorPoints = 2;
        }
        if (vowels.includes(guess)) {
          errorPoints = 3;
        }
        const newGamePoints = gamePoints - errorPoints;
        setGamePoints(newGamePoints);
        console.log("new game points: ", newGamePoints, " gp: ", Number(points),  " tot: ", (Number(points)+newGamePoints))
        if((Number(points) + newGamePoints) <= 0) {
          setGameState("overLost")
        }
      } else {
        correctAudio.play();
      }
    }
  };

  const onPlayAgain = () => {
    sendToDevvit(
      createMessage({
        type: MSG_TYPE_W_NEW_GAME,
        username,
      }),
    );
  };

  function onGameOver(endGameState: "overWon" | "overLost") {
    setTimeout(() => {
      if (endGameState === "overWon") {
        gameWonAudio.play();
      } else {
        gameLostAudio.play();
      }

      setGameState(endGameState);

      const newGamePoints = gamePoints + answer.length;
      setGamePoints(newGamePoints);

      sendToDevvit(
        createMessage({
          type: MSG_TYPE_W_GAME_OVER,
          username,
          correctAnswer: answer,
          wasCorrect: gameState,
          pointsAwarded: newGamePoints,
          guesses,
        }),
      );
    }, 500);
  }

  function setNewAnswer(newAnswerStr: string) {
    setAnswer(newAnswerStr);
    setUserAnswer(newAnswerStr.replace(/./g, "*"));
    setGuesses([]);
  }

  function renderGame() {
        if(gameState == "overWon" || gameState == "overLost") {
        return <Results
          points={points}
          gamePoints={gamePoints}
          answer={answer}
          canPlayAgain={points > 0}
          callback={onPlayAgain}
          wasCorrect={gameState}
        />;
        } else if(username && points) {
         return <>
          <UserHUD points={points} gamePoints={gamePoints} />
          {answer && (
            <div className="LetterGuessGame">
              <AnswerBox value={userAnswer} />
              <GameKeyboard guesses={guesses} callback={handleAnswer} />
            </div>
          )}
        </>
        }
    
  }

  return (
    <div className="LetterGuessMain">
      {gameState === "loading" ? (
        <div>
          <span className="loader"></span>
        </div>
      ) : gameState === "ineligible" ? (
        <div className="Ineligible">
          <div>Sorry, you are out of points. Come back tomorrow!</div>
        </div>
      ) : (
        renderGame()
      )}
    </div>
  );
};
