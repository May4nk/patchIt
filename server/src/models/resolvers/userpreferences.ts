import { findOne } from "../../utils/common/queriesutils.js";

//types
import { usertype } from "./types/usertypes.js";
import { loggedusertype } from "../../utils/common/types.js";
import { userpreferencetype } from "./types/userpreferencetypes.js";

export const userpreferenceResolvers = {
  Query: {
    userpreference: async (
      _: undefined,
      { username }: { username: string },
      { user }: { user: loggedusertype }
    ): Promise<userpreferencetype> => {
      try {
        if (!user) throw Error("User not authenticated");

        if (user.username !== username) {
          throw Error("User not authorised...");
        }

        const userpreferenceById: userpreferencetype = await findOne<
          userpreferencetype,
          { user: string }
        >("user_preferences", { user: username });

        if (!userpreferenceById)
          throw new Error(`No setting found for User with Id: ${username}`);

        return userpreferenceById;
      } catch (err) {
        throw err;
      }
    },
  },
  UserPreferences: {
    user: async ({ user }: { user: string }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<
          usertype,
          { username: string }
        >("users", { username: user });

        return userById;
      } catch (err) {
        throw err;
      }
    },
  },
};
