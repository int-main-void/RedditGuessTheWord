import { type Context } from "@devvit/public-api";
import { wordBank } from "../../../shared/words.js";

export function getNewAnswer(
  context: Context,
  username: string,
  filter: String[]
): string {
  let newWord: string = "";

  for(let i=0; i< 1000; i++) {
    newWord = wordBank[Math.floor(Math.random() * wordBank.length)];
    if (! filter.includes(newWord) || i > 99) {
        return newWord;
    }
  }
  return newWord;

}
