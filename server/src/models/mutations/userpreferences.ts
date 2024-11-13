import db from "../../db.js";
import { findOne } from "../../utils/queriesutils.js";

//types
import {
  userpreferencedatatype,
  remuserpreferencedatatype,
  ruserpreferencetype,
  userpreferencetype,
} from "./types/userpreferencemutetypes.js";

export const userpreferenceMutations = {
  Mutation: {
    upsertUserPreference: async (
      _: undefined,
      { data }: userpreferencedatatype
    ): Promise<userpreferencetype> => {
      try {
        const userPreferenceFound: userpreferencetype = await findOne<
          userpreferencetype,
          { user_id: number }
        >("user_preferences", { user_id: data.user_id });

        if (userPreferenceFound) {
          const [updateUserPreference]: userpreferencetype[] = await db(
            "user_preferences"
          )
            .where("user_id", userPreferenceFound.user_id)
            .update(data)
            .returning("*");

          return updateUserPreference;
        }

        const [createUserPreference]: userpreferencetype[] = await db(
          "user_preferences"
        )
          .insert(data)
          .returning("*");

        return createUserPreference;
      } catch (err) {
        throw err;
      }
    },
    removeUserPreference: async (
      _: undefined,
      { data }: remuserpreferencedatatype
    ): Promise<ruserpreferencetype> => {
      try {
        const userPreferenceFound: userpreferencetype = await findOne<
          userpreferencetype,
          { user_id: number }
        >("user_preferences", { user_id: data.user_id });

        if (!userPreferenceFound)
          throw Error("User not found with settings...");

        const [deleteUserPreference]: ruserpreferencetype[] = await db(
          "user_preferences"
        )
          .where("user_id", userPreferenceFound.user_id)
          .del()
          .returning("id");

        return deleteUserPreference;
      } catch (err) {
        throw err;
      }
    },
  },
};
