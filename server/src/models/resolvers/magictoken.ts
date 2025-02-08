import db from "../../db.js";
import { listAll, findOne } from "../../utils/common/queriesutils.js";
import { generateTokens, setCookies } from "../../utils/common/tokenutils.js";

//types
import { Response } from "express";
import { usertype } from "./types/usertypes.js";
import { filtersorttype } from "../../utils/common/types.js";
import {
  magictokentype,
  magictokenfiltertype,
  magictokenmutetype,
} from "./types/magictokentypes.js";

export const magictokenResolvers = {
  Query: {
    listMagicTokens: async (
      _: undefined,
      filter?: filtersorttype<magictokenfiltertype>
    ): Promise<magictokentype[]> => {
      try {
        const allMagicTokens: magictokentype[] = await listAll<
          magictokentype,
          magictokenfiltertype
        >("magic_tokens", filter);

        return allMagicTokens;
      } catch (err) {
        throw err;
      }
    },
    magicToken: async (
      _: undefined,
      { email }: { email: string }
    ): Promise<magictokentype> => {
      try {
        const magicTokenUser: magictokentype = await findOne<
          magictokentype,
          { email: string }
        >("magic_tokens", { email: email });

        if (!magicTokenUser)
          throw new Error(`Magic Token not found with email: ${email}`);

        return magicTokenUser;
      } catch (err) {
        throw err;
      }
    },
    verifyMagicToken: async (
      _: undefined,
      { token }: { token: string },
      { res }: { res: Response }
    ): Promise<usertype> => {
      try {
        const userMagicToken: magictokenmutetype = await findOne<
          magictokenmutetype,
          { token: string }
        >("magic_tokens", { token: token });

        if (!userMagicToken) {
          throw new Error(`Magic Token is Already Used or Invalid`);
        }

        const date = new Date().valueOf() / 1000 / 60;
        const tokenExpiry =
          new Date(userMagicToken.expires_at).valueOf() / 1000 / 60;

        if (date - tokenExpiry > 15) {
          await db("magic_tokens").where({ email: userMagicToken.email }).del();

          throw new Error("Magic Token expired. Login again to get new one");
        }

        const magicUser: usertype = await findOne<usertype, { email: string }>(
          "users",
          { email: userMagicToken.email }
        );

        if (magicUser.status !== "ACTIVE") {
          await db("users")
            .where({ email: userMagicToken.email })
            .update({ status: "ACTIVE" });
        }

        const { accessToken, refreshToken } = await generateTokens(magicUser);

        await db("magic_tokens").where({ email: userMagicToken.email }).del();

        setCookies(res, refreshToken);
        magicUser.token = accessToken;

        return magicUser;
      } catch (err) {
        throw new Error(`Token verification failed: ${err}`);
      }
    },
  },
  MagicToken: {
    email: async ({ email }: { email: string }): Promise<usertype> => {
      try {
        const user: usertype = await findOne<usertype, { email: string }>(
          "users",
          { email: email }
        );

        return user;
      } catch (err) {
        throw err;
      }
    },
  },
};
