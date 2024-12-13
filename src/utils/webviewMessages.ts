import { Devvit } from "@devvit/public-api";

import { WEBVIEW_ID } from "../constants.js";
import { DevvitToWebviewMessage } from '../../shared/msgUtils.js'

export const sendMessageToWebview = (
  context: Devvit.Context,
  message: DevvitToWebviewMessage,
) => {
  context.ui.webView.postMessage(
    WEBVIEW_ID, 
    message
  );
};