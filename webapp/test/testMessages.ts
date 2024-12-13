import { createMessage } from "../../shared/msgUtils";

export const testMsg1 = {
  type: "devvit-message",
  data: {
    message: createMessage({
      type: "GSMD_NewGame",
      username: "testuser1",
      userTotalPoints: 15,
      newWord: "abitda",
    })
  },
};
