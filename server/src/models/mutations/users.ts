import bcrypt from "bcrypt";
import db from "../../db.js";
import { JwtPayload } from "jsonwebtoken";

//utils
import { findOne } from "../../utils/common/queriesutils.js";
import { sendMail } from "../../utils/common/mailutils.js";
import {
  generateMagicToken,
  generateTokens,
  setCookies,
  verifyToken,
} from "../../utils/common/tokenutils.js";

//types
import { Request, Response } from "express";
import { usertype } from "../resolvers/types/usertypes.js";
import {
  logintype,
  magiclinktype,
  requestfpasswordtype,
  forgetpasswordtype,
} from "./types/usermutetypes.js";
import { IDSTYPE } from "../../utils/common/types.js";

export const userMutations = {
  Mutation: {
    insertUser: async (
      _: undefined,
      { data }: { data: usertype }
    ): Promise<usertype> => {
      try {
        const userFound: usertype = await findOne<usertype, { email: string }>(
          "users",
          { email: data.email }
        );

        if (userFound) {
          throw new Error(`User already Exists! Try forgetting password.`);
        }

        const encryptedPassword: string = await bcrypt.hash(data.password, 10);

        const [createUser]: usertype[] = await db("users")
          .insert({
            username: data.username,
            email: data.email,
            password: encryptedPassword,
          })
          .returning("*");

        return createUser;
      } catch (err) {
        throw new Error("Something went wrong: User Creation failed.");
      }
    },
    updateUser: async (
      _: undefined,
      { data }: { data: usertype }
    ): Promise<usertype> => {
      try {
        const userFound: usertype = await findOne<usertype, { id: string }>(
          "users",
          { id: data.id }
        );

        if (!userFound) {
          throw Error("User don't Exist! Try Signing up for new user.");
        }

        const [updateUser]: usertype[] = await db("users")
          .where("id", userFound.id)
          .update(data)
          .returning("*");

        return updateUser;
      } catch (err) {
        throw new Error("Something wrong with updating user");
      }
    },
    loginUser: async (
      _: undefined,
      { data }: { data: logintype },
      { res }: { res: Response }
    ): Promise<usertype> => {
      try {
        let userFound: usertype | undefined;

        if (data?.username) {
          userFound = await findOne<usertype, { username: string }>("users", {
            username: data.username,
          });
        } else if (data?.email) {
          userFound = await findOne<usertype, { email: string }>("users", {
            email: data.email,
          });
        }

        if (!userFound) {
          throw new Error("User don't exist. Try signing up for account");
        }

        if (userFound.status !== "ACTIVE") {
          throw new Error("User account is deactivated");
        }

        const validatePassword: boolean = await bcrypt.compare(
          data.password,
          userFound.password
        );

        if (!validatePassword) {
          throw new Error("Invalid User credentials");
        }

        const { refreshToken, accessToken } = await generateTokens(userFound);
        setCookies(res, refreshToken);

        userFound.token = accessToken;

        return userFound;
      } catch (err) {
        throw err;
      }
    },
    magicloginUser: async (
      _: undefined,
      { data }: { data: magiclinktype }
    ): Promise<string> => {
      try {
        const userFound: usertype = await findOne<usertype, { email: string }>(
          "users",
          { email: data.email }
        );

        if (!userFound) {
          const magicUsername: string = `interestedTom${Math.random()
            .toString(36)
            .slice(2, 7)}`;

          const magicUserPassword: string = await bcrypt.hash(
            data.password,
            10
          );

          await db("users")
            .insert({
              email: data.email,
              username: magicUsername,
              password: magicUserPassword,
              status: "INACTIVE",
            })
            .returning("*");
        }

        const magicToken = await generateMagicToken(data?.email);
        const magicMessage = data?.message + magicToken;

        await sendMail(data?.email, magicMessage);

        return "Magic link sent successfully";
      } catch (err) {
        throw new Error(`Something went wrong: Magic login failed`);
      }
    },
    requestForgetPassword: async (
      _: undefined,
      { data }: { data: requestfpasswordtype }
    ) => {
      try {
        const userFound: usertype = await findOne<usertype, { email: string }>(
          "users",
          { email: data.email }
        );

        if (!userFound) {
          throw new Error("User doesn't Exist");
        }

        const userPassword: string = userFound.password;
        const userEmail: string = userFound.email;

        const forgetPasswordHash = await bcrypt.hash(
          userPassword + userEmail,
          10
        );

        const forgetPasswordToken = btoa(
          `${forgetPasswordHash}?=${userFound.id}#==`
        );

        const forgetPasswordLink = `http://localhost:3000/account/passwordreset/${forgetPasswordToken}`;

        const forgetPasswordMessage = data?.message + forgetPasswordLink;

        await sendMail(
          data?.email,
          forgetPasswordMessage,
          "patchIt: Change your password"
        );

        return "Change Password mail sent successfully";
      } catch (err) {
        throw new Error(
          "Something went wrong: Update password request failed."
        );
      }
    },
    forgetPassword: async (
      _: undefined,
      { data }: { data: forgetpasswordtype }
    ): Promise<string> => {
      try {
        const fpasswordToken = atob(data?.token);

        const startIdx = fpasswordToken.indexOf("?=") + 2;
        const endIdx = fpasswordToken.indexOf("#==");

        if (startIdx < 1 && endIdx < startIdx) {
          throw new Error("User Id not found");
        }

        const userIdStr = fpasswordToken.substring(startIdx, endIdx);

        const userId: number = parseInt(userIdStr, 10);

        const userFound: usertype = await findOne<usertype, { id: number }>(
          "users",
          { id: userId }
        );

        if (!userFound) {
          throw new Error("Something went wrong: User don't exist.");
        }

        const tokenIdx = fpasswordToken.indexOf("?=");

        const token = fpasswordToken.substring(0, tokenIdx);

        const userPassword: string = userFound.password;
        const userEmail: string = userFound.email;

        const userInfo = userPassword + userEmail;

        const isTokenVerified = await bcrypt.compare(userInfo, token);

        if (!isTokenVerified) {
          throw new Error("Update password failed: User not authenticated");
        }

        if (data?.password !== data?.cpassword) {
          throw new Error("Update password failed: Password don't match.");
        }

        const newPassword: string = await bcrypt.hash(data?.password, 10);

        await db("users")
          .where("id", userFound.id)
          .update({ password: newPassword })
          .returning("*");

        await db("tokens").where("user_id", userId).del();

        return "Password updated successfully";
      } catch (err) {
        throw new Error("Something went wrong: Update password failed.");
      }
    },
    changePassword: async (
      _: undefined,
      { data }: { data: usertype }
    ): Promise<usertype> => {
      try {
        const userFound: usertype = await findOne<usertype, { id: string }>(
          "users",
          { id: data.id }
        );

        if (!userFound) {
          throw Error("User don't Exist! Try Signing up for new user.");
        }

        const isPasswordValid: boolean = await bcrypt.compare(
          data.password,
          userFound.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid Old password");
        }

        const newPassword: string = await bcrypt.hash(data.newPassword!, 10);

        const [updateUserPassword]: usertype[] = await db("users")
          .where("id", userFound.id)
          .update({ password: newPassword })
          .returning("*");

        return updateUserPassword;
      } catch (err) {
        throw err;
      }
    },
    logoutUser: async (
      _: undefined,
      { userId }: { userId: number },
      { res }: { res: Response }
    ): Promise<string> => {
      try {
        res.clearCookie("rToken");
        await db("tokens").where("user_id", userId).del();

        return "User logged Out";
      } catch (err) {
        throw new Error("Something wrong with user logging out");
      }
    },
    refreshToken: async (
      _: undefined,
      args: undefined,
      { req, res }: { req: Request; res: Response }
    ): Promise<usertype> => {
      try {
        const { rToken } = req.cookies;

        const userData: JwtPayload = verifyToken(
          rToken,
          process.env.REFRESH_TOKEN_SECRET!
        ) as JwtPayload;

        const userFound: usertype = await findOne<usertype, { id: number }>(
          "users",
          { id: userData.id }
        );

        if (!userFound) {
          throw new Error("Invalid req: User not found");
        }

        const { accessToken, refreshToken } = await generateTokens(userFound);
        setCookies(res, refreshToken);

        userFound.token = accessToken;

        return userFound;
      } catch (err) {
        throw new Error(`Something went wrong: Token refresh failed`);
      }
    },
    removeUser: async (
      _: undefined,
      { data }: { data: IDSTYPE },
      { res }: { res: Response }
    ): Promise<IDSTYPE> => {
      try {
        const userFound: usertype = await findOne<usertype, IDSTYPE>("users", {
          id: data.id,
        });

        if (!userFound) throw new Error("User not found...");

        const [deleteUser]: IDSTYPE[] = await db("users")
          .where("id", userFound.id)
          .del()
          .returning("id");

        res.clearCookie("rToken");
        await db("tokens").where("user_id", userFound.id).del().returning("*");

        return deleteUser;
      } catch (err) {
        throw new Error("Error removing user");
      }
    },
  },
};
