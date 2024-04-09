import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { usertype } from "./types/usertypes.js";
import { userpreferencetype, userpreferencefiltertype } from "./types/userpreferencetypes.js";

export const userpreferenceResolvers = {
  Query: {
    listUserPreferences: async (
      parent: undefined,
      filter?: filtersorttype<userpreferencefiltertype>
    ): Promise<userpreferencetype[]> => {
      try {
        const alluserpreferences: userpreferencetype[] = await listAll<
          userpreferencetype,
          userpreferencefiltertype
        >("user_preferences", filter);
        return alluserpreferences;
      } catch (err) {
        throw err;
      }
    },
    userpreference: async (parent: undefined, { userId }: { userId: number }): Promise<userpreferencetype> => {
      try {
        const userpreferenceById: userpreferencetype = await findOne<
          userpreferencetype,
          { user_id: number }
        >("user_preferences", { user_id: userId });
        
        if (!userpreferenceById) throw new Error(`No setting found for User with Id: ${userId}`);

        return userpreferenceById;
      } catch (err) {
        throw err;
      }
    },
  },
  UserPreferences: {
    user_id: async ({ user_id }: { user_id: number }): Promise<usertype> => {
      try {
        const userById: usertype = await findOne<usertype, { id: number }>("users", { id: user_id });
        return userById;
      } catch (err) {
        throw err;
      }
    },
  },
};
