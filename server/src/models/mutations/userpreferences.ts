import db from "../../db.js";
import { findOne } from "../../utils/common/queriesutils.js";

//types
import {
  rawuserpreferencetype,
  userpreferencetype,
  ruserpreferencetype,
} from "../resolvers/types/userpreferencetypes.js";
import { IDSTYPE } from "../../utils/common/types.js";

export const userpreferenceMutations = {
  Mutation: {
    upsertUserPreference: async (
      _: undefined,
      { data }: { data: rawuserpreferencetype }
    ): Promise<rawuserpreferencetype> => {
      try {
        const userPreferenceFound: userpreferencetype = await findOne<
          userpreferencetype,
          { user: string }
        >("user_preferences", { user: data.user });

        if (userPreferenceFound) {
          const [updateUserPreference]: rawuserpreferencetype[] = await db(
            "user_preferences"
          )
            .where("user_id", userPreferenceFound.user)
            .update(data)
            .returning("*");

          return updateUserPreference;
        }

        const [createUserPreference]: rawuserpreferencetype[] = await db(
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
      { data }: { data: ruserpreferencetype }
    ): Promise<IDSTYPE> => {
      try {
        const userPreferenceFound: userpreferencetype = await findOne<
          userpreferencetype,
          { user: string }
        >("user_preferences", { user: data.user });

        if (!userPreferenceFound)
          throw Error("User not found with settings...");

        const [deleteUserPreference]: ruserpreferencetype[] = await db(
          "user_preferences"
        )
          .where("user_id", userPreferenceFound.user)
          .del()
          .returning("id");

        return deleteUserPreference;
      } catch (err) {
        throw err;
      }
    },
  },
};
