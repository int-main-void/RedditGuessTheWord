import { v4 as uuidv4 } from "uuid";

export const DevvitMessageType = "devvit-message";

export function createMessage(payload: any) {
  return {
    messageId: uuidv4(),
    timestamp: Date.now(),
    ...payload,
  };
}

// Devvit messages
export const MSG_TYPE_D_NEW_GAME: string = "GSMD_NewGame";

// from Devvit to Webview
export type DevvitNewGameMessage = {
  type: "GSMD_NewGame";
  messageId: string;
  timestamp: number;
  username: string;
  userTotalPoints: string;
  newWord: string; // TODO - complex type?
};

export type DevvitToWebviewMessage = DevvitNewGameMessage;

// Webview messages
export const MSG_TYPE_W_READY = "GSMW_WebviewReady";
export const MSG_TYPE_W_NEW_GAME = "GSMW_NewGame";
export const MSG_TYPE_W_GAME_OVER = "GSMW_GameOver";

export type GSMW_WebviewReady = {
  type: "GSMW_WebviewReady";
  messageId: string;
  timestamp: number;
};

// webview requests a new game
export type GSMW_NewGame = {
  type: "GSMW_NewGame";
  messageId: string;
  timestamp: number;
  username: string;
};

export type GSMW_GameOver = {
  type: "GSMW_GameOver";
  messageId: string;
  timestamp: number;
  username: string;
  correctAnswer: string;
  wasCorrect: boolean;
  pointsAwarded: number;
  guesses: string;
};

export type WebviewToDevvitMessage =
  | GSMW_WebviewReady
  | GSMW_NewGame
  | GSMW_GameOver;
