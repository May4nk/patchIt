import db from "../../db.js";
import { findOne } from "../../utils/queriesutils.js";
import { usertype } from "../resolvers/types/usertypes.js";

//types
import {
  rcommunitypreferencetype,
  communitypreferencetype,
} from "./types/communitypreferencemutetypes.js";

export const communitypreferenceMutations = {
  Mutation: {
    upsertCommunityPreference: async (
      _: undefined,
      { data }: { data: communitypreferencetype },
      { user }: { user: usertype }
    ): Promise<communitypreferencetype> => {
      try {
        if (!user) throw new Error("user not authenticated");

        const communityPreferenceFound: communitypreferencetype = await findOne<
          communitypreferencetype,
          { community_name: string }
        >("community_preferences", { community_name: data.community_name });

        if (communityPreferenceFound) {
          const [updateCommunityPreference]: communitypreferencetype[] =
            await db("community_preferences")
              .where("community_name", communityPreferenceFound.community_name)
              .update(data)
              .returning("*");

          return updateCommunityPreference;
        }

        const [createCommunityPreference]: communitypreferencetype[] = await db(
          "community_preferences"
        )
          .insert(data)
          .returning("*");

        return createCommunityPreference;
      } catch (err) {
        throw err;
      }
    },
    removeCommunityPreference: async (
      _: undefined,
      { data }: { data: rcommunitypreferencetype }
    ): Promise<rcommunitypreferencetype> => {
      try {
        const communityPreferenceFound: communitypreferencetype = await findOne<
          communitypreferencetype,
          { community_name: string }
        >("community_preferences", { community_name: data.community_name });

        if (!communityPreferenceFound)
          throw Error("Community not found with settings...");

        const [deleteCommunityPreference]: rcommunitypreferencetype[] =
          await db("community_preferences")
            .where("community_name", communityPreferenceFound.community_name)
            .del()
            .returning("id");

        return deleteCommunityPreference;
      } catch (err) {
        throw err;
      }
    },
  },
};
