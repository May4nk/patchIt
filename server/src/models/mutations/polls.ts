import db from "../../db.js";
import { findOne } from "../../common/queries.js";
import { polldatatype, rempolldatatype, rpolltype, polltype } from "./types/pollmutetypes.js";

export const pollsMutations = {
  Mutation:{
    upsertPolls: async(
      parent: undefined,
      { data }: polldatatype,
      contextValue: any
    ): Promise<polltype> => {
      try {
        if(!contextValue.user) throw new Error("user not authenticated");

        const foundPollUserReaction: polltype = await findOne<
          polltype, 
          { user_id: number, post_id: number }
        >("polls", { "user_id": data.user_id, "post_id": data.post_id });

        if(foundPollUserReaction) {
          const [updatePollUserReaction]: polltype[] = await db("polls")
            .where("id", foundPollUserReaction.id) 
            .update(data)        
            .returning("*");
         
          return updatePollUserReaction;
        } 
        
        const [createPollUserReaction]: polltype[] = await db("polls")
          .insert(data)
          .returning("*");

        return createPollUserReaction;        

      } catch(err) {
        throw err;
      }
    },
    removePoll: async(parent: undefined, { data }: rempolldatatype): Promise<rpolltype> => {
      try {
          const foundPollUserReaction: polltype = await findOne<
            polltype,
            { user_id: number, post_id: number }
          >("polls", { "user_id": data.user_id, "post_id": data.post_id });
        
        if(!foundPollUserReaction) throw new Error("Poll not found...");
        
        const [deletePoll]: rpolltype[] = await db("polls")
          .where("id", foundPollUserReaction.id)
          .del()
          .returning("id");
        
        return deletePoll;
      } catch(err) {
        throw err;
      }
    }
  }
}
