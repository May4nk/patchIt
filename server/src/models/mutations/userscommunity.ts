import db from "../../db.js";
import { findOne } from "../../utils/queriesutils.js";

//types
import { remusercommunitytype, usercommunitytype, } from "./types/usercommunitiesmutetypes.js";

export const userscommunityMutations = {
  Mutation: {
    insertUserCommunity: async (
      _: undefined,
      { data }: { data: usercommunitytype }
    ): Promise<usercommunitytype> => {
      try {
        const [createUserCommunity]: usercommunitytype[] = await db("user_community_relation")
          .insert({
            user_id: data.user_id,
            community_id: data.community_id,
          })
          .returning("*");

        return createUserCommunity;
      } catch (err) {
        throw err;
      }
    },
    batchInsertUserCommunity: async (
      _: undefined,
      { data }: { data: usercommunitytype[] }
    ): Promise<usercommunitytype[]> => {
      try {
        const createBulkUserCommunity: usercommunitytype[] = await db
          .batchInsert("user_community_relation", [...data])
          .returning("*");

        return createBulkUserCommunity;
      } catch (err) {
        throw err;
      }
    },
    removeUserCommunity: async (
      _: undefined,
      { data }: { data: remusercommunitytype }
    ): Promise<{ id: number }> => {
      try {
        const foundUsersCommunity: usercommunitytype = await findOne<
          usercommunitytype,
          { user_id: number; community_id: number }
        >("user_community_relation", {
          user_id: data.user_id,
          community_id: data.community_id,
        });

        if (!foundUsersCommunity)
          throw new Error("User is not member of this community yet...");

        const [deleteUserCommunity]: { id: number }[] = await db("user_community_relation")
          .where("id", foundUsersCommunity.id)
          .del()
          .returning("id");

        return deleteUserCommunity;
      } catch (err) {
        throw err;
      }
    },
  },
};
