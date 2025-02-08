import db from "../../db.js";
import { findOne } from "../../utils/common/queriesutils.js";

//types
import { IDSTYPE } from "../../utils/common/types.js";
import {
  userscommunitytype,
  rawusercommunitytype,
  remusercommunitytype,
  userscommunityfiltertype,
} from "../resolvers/types/userscommunitytypes.js";

export const userscommunityMutations = {
  Mutation: {
    insertUserCommunity: async (
      _: undefined,
      { data }: { data: rawusercommunitytype }
    ): Promise<rawusercommunitytype> => {
      try {
        const [createUserCommunity]: rawusercommunitytype[] = await db(
          "user_community_relation"
        )
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
      { data }: { data: rawusercommunitytype[] }
    ): Promise<rawusercommunitytype[]> => {
      try {
        const createBulkUserCommunity: rawusercommunitytype[] = await db
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
    ): Promise<IDSTYPE> => {
      try {
        const foundUsersCommunity: userscommunitytype = await findOne<
          userscommunitytype,
          userscommunityfiltertype
        >("user_community_relation", {
          user_id: data.user_id,
          community_id: data.community_id,
        });

        if (!foundUsersCommunity)
          throw new Error("User is not member of this community yet...");

        const [deleteUserCommunity]: IDSTYPE[] = await db(
          "user_community_relation"
        )
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
