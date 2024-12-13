import { Devvit } from "@devvit/public-api";
import { postApp } from "./devvitApp/posts/postApp.js";
import { submitNewPost } from "./devvitApp/posts/post.js";
import { POST_TYPE_NAME } from "./constants.js";
import { DEVVIT_SETTINGS_KEYS } from './constants.js';

Devvit.addSettings([
  {
    name: DEVVIT_SETTINGS_KEYS.SECRET_API_KEY,
    label: 'API Key for secret things',
    type: 'string',
    isSecret: true,
    scope: 'app',
  },
]);
Devvit.configure({
  redditAPI: true,
  redis: true,
});

Devvit.addCustomPostType({
  name: POST_TYPE_NAME,
  height: "tall",
  render: postApp,
});

Devvit.addMenuItem({
  label: "Add Game Post",
  location: "subreddit",
  onPress: (_event, context) => submitNewPost(context),
});

export default Devvit;
