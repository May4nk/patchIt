import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { roletype, rolefiltertype } from "./types/roletypes.js";

export const roleResolvers = {
  Query: {
    listRoles: async (parent: undefined, filter: filtersorttype<rolefiltertype>): Promise<roletype[]> => {
      try {
        const allRoles: roletype[] = await listAll<roletype, rolefiltertype>("roles", filter);
        return allRoles;
      } catch(err) {
        throw err;
      }
    },
    role: async (parent: undefined, { role }: { role: string }): Promise<roletype> => {
      try {
        const roleByName: roletype = await findOne<roletype, { role: string }>("roles", { "role": role }); 

        if(!roleByName) throw new Error(`${role} role not found`);

        return roleByName;
      } catch(err) {
        throw err;
      }
    }
  }
}
