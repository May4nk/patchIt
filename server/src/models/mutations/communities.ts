import db from "../../db.js";
import { findOne } from "../../common/queries.js";
import { communitydatatype, remcommunitydatatype, rcommunitytype } from "./types/communitiesmutetypes.js";
import { communitytype } from "../resolvers/types/communitiestypes.js";

export const communityMutations = {
  Mutation:{
    upsertCommunity: async(parent: undefined, { data }: communitydatatype, contextValue: any): Promise<communitytype> => {
      try {
        if(!contextValue) {
          throw new Error("User not authenticated");
        }

        const foundCommunity: communitytype = await findOne<communitytype, { communityname: string}>("communities", { "communityname": data.communityname });
        
        if(!foundCommunity) {

          const [createCommunity]: communitytype[] = await db("communities")
            .insert(data)
            .returning("*");

          return createCommunity;

        } else if(foundCommunity && contextValue.owner === foundCommunity.owner) {

          const [updateCommunity]: communitytype[] = await db("communities")
            .where("id", foundCommunity["id"])
            .update(data)
            .returning("*");
          
          return updateCommunity;

        } else {          
          throw new Error("Changes not done by superuser");
        }          
        
      } catch(err) {
        throw err;
      }
    },
    removeCommunity: async(parent: undefined, { data }: remcommunitydatatype): Promise<rcommunitytype> => {
      try {

        const foundCommunity: communitytype = await findOne<communitytype, { id: number }>("communities", { id: data.id });
        
        if(!foundCommunity) throw new Error("Community not found...");
        
        const [deleteCommunity]: rcommunitytype[] = await db("communities")
          .where("id", data.id)
          .del()
          .returning("id");
        
        return deleteCommunity;
      } catch(err) {
        throw err;
      }
    }
  }
}
