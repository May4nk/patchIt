import { listAll, findOne } from "../../utils/queriesutils.js";

//types
import { usertype } from "./types/usertypes.js";
import { filtersorttype } from "../../utils/types.js";
import { communitytype } from "./types/communitiestypes.js";
import {
  communitypreferencetype,
  communitypreferencefiltertype,
  communitypreferenceresolvertype,
} from "./types/communitypreferencetypes.js";

export const communitypreferenceResolvers = {
  Query: {
    listCommunityPreferences: async (
      _: undefined,
      filter: filtersorttype<communitypreferencefiltertype>,
      { user }: { user: usertype }
    ): Promise<communitypreferenceresolvertype[]> => {
      if (!user) throw new Error("user not authenticated");

      try {
        const allcommunitypreferences: communitypreferenceresolvertype[] =
          await listAll<
            communitypreferenceresolvertype,
            communitypreferencefiltertype
          >("community_preferences", filter);

        return allcommunitypreferences;
      } catch (err) {
        throw err;
      }
    },
    communitypreference: async (
      _: undefined,
      { communityName }: { communityName: string },
      { user }: { user: usertype }
    ): Promise<communitypreferencetype> => {
      if (!user) throw new Error("user not authenticated");

      try {
        const communitypreferenceByName: communitypreferencetype =
          await findOne<communitypreferencetype, { community_name: string }>(
            "community_preferences",
            { community_name: communityName }
          );

        if (!communitypreferenceByName) {
          throw new Error(
            `No setting found for Community with Name: ${communityName}`
          );
        }

        const owners: number[] = JSON.parse(communitypreferenceByName.handlers);

        const isUserOwner = owners.includes(user.id);

        if (!isUserOwner) {
          throw new Error("Not authorised to access it.");
        }

        return communitypreferenceByName;
      } catch (err) {
        throw err;
      }
    },
  },
  CommunityPreferences: {
    community_name: async ({ community_name }: { community_name: string }): Promise<communitytype> => {
      try {
        const communityByName: communitytype = await findOne<
          communitytype,
          { communityname: string }
        >("communities", { communityname: community_name });

        return communityByName;
      } catch (err) {
        throw err;
      }
    },
    handlers: async ({ handlers }: { handlers: string }): Promise<usertype[]> => {
      try {
        const owners: number[] = JSON.parse(handlers);

        const communityHandlers: usertype[] = await listAll<
          usertype,
          { id: number[] }
        >("users", { filter: { id: owners } });

        return communityHandlers;
      } catch (err) {
        throw err;
      }
    },
  },
};
