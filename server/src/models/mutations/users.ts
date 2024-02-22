import db from "../../db.js";
import { findOne } from "../../common/queries.js";
import { userdatatype, remuserdatatype, rusertype, logindatatype, magiclinkdatatype } from "./types/usermutetypes.js";
import { usertype } from "../resolvers/types/usertypes.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userMutations = {
  Mutation: {       
    insertUser: async(parent: undefined, { data }: userdatatype): Promise<usertype> => {
      try {
        const userFound: usertype = await findOne<usertype, { email: string }>("users", { email: data.email });        

        if (userFound) {
          throw Error(`User already Exists! Try forgetting password or Use another email.`);
        }

        const encryptedPassword: string = await bcrypt.hash(data.password, 10);        

        const [createUser]: usertype[] = await db("users")
          .insert({
            username: data.username,
            email: data.email,
            password: encryptedPassword
          })
          .returning("*");

        return createUser;         
        
      } catch(err) {
        throw err;
      }
    },
    updateUser: async(parent: undefined, { data }: userdatatype): Promise<usertype> => {
      try {       

        const userFound: usertype = await findOne<usertype, { id: number }>("users", { "id": data.id });        

        if(!userFound) {
          throw Error("User don't Exist! Try Signing up for new user.");       
        }
        
        const encryptedPassword: string = data?.password ? await bcrypt.hash(data?.password!, 10) : "";
               
        const [updateUser]: usertype[] = await db("users")
          .where("id", userFound.id)
          .update(data)
          .returning("*");
        
        return updateUser;
      } catch(err) {
        throw err
      }
    },
    loginUser: async(parent: undefined, { data }: logindatatype): Promise<usertype> => {
      try {
        
        const userFound: usertype = await findOne<usertype, { username: string }>("users", { username: data.username });

        if (userFound) {
          
          const validatePassword: boolean = await bcrypt.compare(data.password, userFound.password);

          if (validatePassword) {
            const token: string = jwt.sign({
              user_id: userFound.id,
              email: userFound.email,
              username: userFound.username,
              role_id: userFound.role
            }, 
            "PASS_STRING",
            { expiresIn: "2h" });

            const checkUserToken = await findOne("tokens", { user_id: userFound.id });

            if(checkUserToken){
              const updateTokenInDb = await db("tokens")
                .where("user_id", userFound.id)
                .update({
                  token: token
                })
            } else {
              const insertTokenInDb = await db("tokens")
                .insert({
                  token: token,
                  user_id: userFound.id,
                });
            }
            
            userFound.token = token;

            return userFound;

          } else {
            throw Error("incorrect password");
          }
        } else {
          throw Error("user not found");
        }
      } catch(err) {
        throw err;
      }
    },   
    magicloginUser: async(parent: undefined, { data }: magiclinkdatatype): Promise<usertype> => {
      try {
        const userFound: usertype = await findOne<usertype, { email: string }>("users", { "email": data.email });

        if(!userFound) {
          const [createUser]: usertype[] = await db("users")
            .insert({
              username: `interestedTom${Math.random().toString(36).slice(2, 7)}`,
              email: data.email,
            })            
            .returning("*");
            
          const token: string = jwt.sign(
            {
              user_id: createUser.id,
              email: createUser.email,
              username: createUser.username,
              role_id: createUser.role
            },
            "PASS_STRING",
            {
              expiresIn: "2h"
            }
          );
          
          const insertTokenInDb = await db("tokens")
            .insert({
              token: token,
              user_id: createUser.id,
            });

          createUser.token = token;

          return createUser;

        } else {
                
          const token: string = jwt.sign({
            user_id: userFound.id,
            email: userFound.email,
            username: userFound.username,
            role_id: userFound.role
          },
          "PASS_STRING",
          { expiresIn: "2h" });

          const checkUserToken = await findOne("tokens", { user_id: userFound.id });

            if(checkUserToken) {
              
              const updateTokenInDb = await db("tokens")
                .where({ user_id: userFound.id })
                .update({ token: token });

            } else {
              const insertTokenInDb = await db("tokens")
                .insert({ token: token, user_id: userFound.id, });
            }

            userFound.token = token;
            return userFound;
        }

      } catch(err) {
        throw err;
      }    
    },
    removeUser: async(parent: undefined, { data }: remuserdatatype): Promise<rusertype> => {
      try {
        const userFound: usertype = await findOne<usertype, { id: number }>("users", { "id": data.id });
        
        if(!userFound) throw Error("User not found...");
        
        const [deleteUser]: rusertype[] = await db("users")
          .where("id", userFound.id)
          .del()
          .returning("id");
        
        return deleteUser;
      } catch(err) {
        throw err;
      }
    }
  }
}
