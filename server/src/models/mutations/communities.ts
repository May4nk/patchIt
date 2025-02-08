import db from "../../db.js";
import { findOne } from "../../utils/common/queriesutils.js";

//types
import { IDSTYPE, loggedusertype } from "../../utils/common/types.js";
import { rawcommunitytype } from "../resolvers/types/communitiestypes.js";

export const communityMutations = {
  Mutation: {
    upsertCommunity: async (
      _: undefined,
      { data }: { data: rawcommunitytype },
      { user }: { user: loggedusertype }
    ): Promise<rawcommunitytype> => {
      try {
        if (!user) {
          throw new Error("User not authenticated");
        }

        const foundCommunity: rawcommunitytype = await findOne<
          rawcommunitytype,
          { name: string }
        >("communities", { name: data.name });

        if (!foundCommunity) {
          const [createCommunity]: rawcommunitytype[] = await db("communities")
            .insert(data)
            .returning("*");

          return createCommunity;
        } else if (foundCommunity && user.id === foundCommunity.owner) {
          const [updateCommunity]: rawcommunitytype[] = await db("communities")
            .where("id", foundCommunity["id"])
            .update(data)
            .returning("*");

          return updateCommunity;
        } else {
          throw new Error("Changes not done by superuser");
        }
      } catch (err) {
        throw err;
      }
    },
    removeCommunity: async (
      _: undefined,
      { data }: { data: IDSTYPE }
    ): Promise<IDSTYPE> => {
      try {
        const foundCommunity: rawcommunitytype = await findOne<
          rawcommunitytype,
          { id: string }
        >("communities", { id: data.id });

        if (!foundCommunity) throw new Error("Community not found...");

        const [deleteCommunity]: IDSTYPE[] = await db("communities")
          .where("id", data.id)
          .del()
          .returning("id");

        return deleteCommunity;
      } catch (err) {
        throw err;
      }
    },
  },
};
