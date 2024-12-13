import { type Context, Devvit, useState, useAsync } from "@devvit/public-api";

import { getNewAnswer } from "../gameCore/words.js";
import {
  createMessage,
  MSG_TYPE_W_GAME_OVER,
  MSG_TYPE_W_NEW_GAME,
  MSG_TYPE_W_READY,
} from "../../../shared/msgUtils.js";
import { sendMessageToWebview } from "../../utils/webviewMessages.js";
import {
  answersKey,
  lastSessionKey,
  pointsKey,
  sessionCountKey,
} from "../../utils/redisUtils.js";

const newSessionPoints = 10;

async function newGame(context: Context, username: string) {
  // get all words user has answered
  const userAnswers = await context.redis.zScan(answersKey(username), 0);

  // translate Redis data from ZSet into list of strings
  let prevAnswers = userAnswers.members.reduce((acc, curValue) => {
    acc.push(curValue.member);
    return acc;
  }, [] as String[]);

  const newAnswer = getNewAnswer(context, username, prevAnswers);
  console.log("next word answer: ", newAnswer);

  const points = await context.redis.get(pointsKey(username));
  const wvmsg = createMessage({
    type: "GSMD_NewGame",
    username: username,
    userTotalPoints: points || "0",
    newWord: newAnswer,
  });
  console.log("Sending to webview: ", wvmsg);
  sendMessageToWebview(context, wvmsg);
}

async function gameOver(
  context: Context,
  username: string,
  timestamp: number,
  correctAnswer: string,
  userWasCorrect: boolean,
  pointsAwarded: number,
  userAnswer: string, // guesses - which letters were guessed
) {
  await context.redis.incrBy(pointsKey(username), pointsAwarded || 1);
  // TODO - track today's (or this session's) points

  // TODO - store this data
  console.log({
    timestamp,
    username,
    correctAnswer,
    userAnswer,
    userWasCorrect,
    pointsAwarded,
  });

  if (correctAnswer) {
    const k = answersKey(username);
    if ((await context.redis.type(k)) != "zset") {
      await context.redis.del(k);
    }
    await context.redis.zAdd(answersKey(username), {
      member: correctAnswer,
      score: pointsAwarded,
    });
  }
}

export function postApp(context: Context): JSX.Element {
  const [launched, setLaunched] = useState(false); // user clicked Play button

  const [username] = useState(async () => {
    const currUser = await context.reddit.getCurrentUser();
    return currUser?.username ?? "anon";
  });

  const {
    data: userDetails,
    loading: userDetailsLoading,
    error: userDetailsError,
  } = useAsync(
    async () => {
      if (!username) return null;

      let [points, sessionCount, lastSession] = await context.redis.mGet([
        pointsKey(username),
        sessionCountKey(username),
        lastSessionKey(username),
      ]);

      // TODO - track current session

      if (
        !lastSession ||
        Date.now() - new Date(lastSession).getTime() > 86400 / 2
      ) {
        // user either never played, or last played a long time ago
        await context.redis.set(lastSessionKey(username), String(Date.now()));
        await context.redis.incrBy(pointsKey(username), newSessionPoints);
        points = String(Number(points || 0) + newSessionPoints);
      }

      if(Number(points) < 0) {
        // use this to fixup a user
        // points = String(newSessionPoints)
        // await context.redis.set(pointsKey(username), points);
      }

      const playerIsEligible = Number(points || 0) > 0;

      const resp = {
        username,
        points,
        sessionCount,
        lastSession,
        playerIsEligible,
      };
      console.log("player details: ", resp);

      return resp;
    },
    {
      depends: username,
    },
  );

  const handleMessage = async (msg: any) => {
    console.log("received from webview: ", msg);

    if (msg.type === MSG_TYPE_W_READY) {
      await newGame(context, username);
    } else if (msg.type == MSG_TYPE_W_NEW_GAME) {
      await newGame(context, username);
    } else if (msg.type == MSG_TYPE_W_GAME_OVER) {
      const correctAnswer = msg.correctAnswer;
      const userWasCorrect = msg.wasCorrect;
      const pointsAwarded = msg.pointsAwarded;
      const userAnswer = msg.guesses;
      const timestamp = msg.timestamp;
      await gameOver(
        context,
        username,
        timestamp,
        correctAnswer,
        userWasCorrect,
        pointsAwarded,
        userAnswer,
      );
    }
  };

  const startPlay = async () => {
    // TODO - this is game count not session count
    await context.redis.incrBy(sessionCountKey(username), 1);

    // context.ui.webView.postMessage('myWebView', {
    //   type: 'initialData',
    //   data: {
    //     username: username,
    //   },
    // });

    setLaunched(true);
  };

  function renderLauncher() {
    return (
      <>
        <vstack
          height="100%"
          width="100%"
          alignment="center middle"
          grow
          padding="medium"
        >
          <text
            alignment="top center"
            size="xxlarge"
            weight="bold"
            color="black"
            outline="thin"
          >
            GUESS THE WORD
          </text>
          <spacer size="large" />
          username && (
          <text wrap width="80%" weight="bold" color="black" outline="thin">
            Welcome back {username}!
          </text>
          <spacer />
          <text wrap width="80%" weight="bold" color="black" outline="thin">
            You have {userDetails?.points || ""} points
          </text>
          <spacer size="medium" />)
          <text wrap width="80%" color="black" outline="thin">
            You will be given a word. Click letters to guess. Uncommon letters
            cost 1 point to guess, but vowels and common letters cost more.
            Reveal the whole word to earn points.
          </text>
          <spacer />
          <text wrap width="80%" color="black" outline="thin">
            You also earn points each day you play, so if you run out of points,
            come back tomorrow!
          </text>
          <spacer size="large" />
          <button size="large" appearance="primary" onPress={() => startPlay()}>
            PLAY
          </button>
          <spacer />
        </vstack>
      </>
    );
  }

  return launched ? (
    <webview
      id="myWebView"
      url="index.html"
      onMessage={(msg: any) => handleMessage(msg)}
      grow
      width="100%"
      height="100%"
    />
  ) : (
    <zstack width="100%" height="100%">
      <vstack
        height="100%"
        width="100%"
        alignment="center middle"
        grow
        backgroundColor="rgba(115, 165, 244, 0.1)"
        padding="medium"
      ></vstack>
      <image
        url="images/words-999.png"
        imageWidth={1200}
        imageHeight={800}
        height="100%"
        resizeMode="cover"
        description="words background"
      />
      {userDetails && userDetails.playerIsEligible ? (
        renderLauncher()
      ) : (
        <vstack
          height="100%"
          width="100%"
          alignment="center middle"
          grow
          padding="large"
        >
          <text
            wrap
            width="80%"
            weight="bold"
            color="black"
            outline="thin"
            size="xlarge"
          >
            Sorry, you are out of points. Come back tomorrow!
          </text>
        </vstack>
      )}
    </zstack>
  );
}
