import db from "../../db.js";
import { findOne } from "../../utils/common/queriesutils.js";

//types
import { IDSTYPE, loggedusertype } from "../../utils/common/types.js";
import {
  communitypreferencetype,
  rawcommunitypreferencetype,
  rcommunitypreferencetype,
} from "../resolvers/types/communitypreferencetypes.js";

export const communitypreferenceMutations = {
  Mutation: {
    upsertCommunityPreference: async (
      _: undefined,
      { data }: { data: rawcommunitypreferencetype },
      { user }: { user: loggedusertype }
    ): Promise<rawcommunitypreferencetype> => {
      try {
        if (!user) throw new Error("user not authenticated");

        const communityPreferenceFound: communitypreferencetype = await findOne<
          communitypreferencetype,
          { community_name: string }
        >("community_preferences", { community_name: data.community_name });

        if (communityPreferenceFound) {
          const [updateCommunityPreference]: rawcommunitypreferencetype[] =
            await db("community_preferences")
              .where("community_name", communityPreferenceFound.community_name)
              .update(data)
              .returning("*");

          return updateCommunityPreference;
        }

        const [createCommunityPreference]: rawcommunitypreferencetype[] =
          await db("community_preferences").insert(data).returning("*");

        return createCommunityPreference;
      } catch (err) {
        throw err;
      }
    },
    removeCommunityPreference: async (
      _: undefined,
      { data }: { data: rcommunitypreferencetype }
    ): Promise<IDSTYPE> => {
      try {
        const communityPreferenceFound: communitypreferencetype = await findOne<
          communitypreferencetype,
          { community_name: string }
        >("community_preferences", { community_name: data.community_name });

        if (!communityPreferenceFound)
          throw Error("Community not found with settings...");

        const [deleteCommunityPreference]: IDSTYPE[] = await db(
          "community_preferences"
        )
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
