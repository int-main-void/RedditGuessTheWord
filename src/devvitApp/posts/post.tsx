import { type Context, Devvit, type JobContext } from "@devvit/public-api";
import {POST_TYPE_NAME} from '../../constants.js';
import { Preview } from "../components/preview.js";

Devvit.configure({
  redditAPI: true,
});

export async function submitNewPost(
  context: Context | JobContext,
) {
  const { reddit } = context;
  const subreddit = await reddit.getCurrentSubreddit();

  const post = await reddit.submitPost({
    title: POST_TYPE_NAME,
    subredditName: subreddit.name,
    preview: <Preview />,
  })

  // hack: JobContext has a ui member.
  if ('ui' in context) {
    context.ui.showToast({ text: "Created post!" });
    context.ui.navigateTo(post);
  }

}
