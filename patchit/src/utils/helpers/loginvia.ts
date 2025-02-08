import { useMutation, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

//utils
import { Randomcred } from "./helpers";
import { useAuth } from "../hooks/useAuth";

//queries
import { UPSERTUSERPREFERENCES } from "../../containers/profileSettings/queries";
import {
  SIGNUPUSER,
  LOGINUSER,
  MAGICLINKLOGIN,
  UPDATEUSER,
  LISTUSERS,
} from "../loginqueries";

//types
import { authcontexttype, loginusertype } from "../../context/types";
import {
  loginthroughtype,
  userdatatype,
  usertype,
  checkusernametype,
  logintype,
  magiclogintype,
  loggedinuserdatatype,
  signupdatatype,
} from "../types";

const useLoginvia = (loginmethod: loginthroughtype) => {
  const navigate = useNavigate();
  const authcontext: authcontexttype = useAuth();

  const randomMail: () => string = Randomcred("mail");
  const randomPassword: () => string = Randomcred("password");
  const randomUsername: (unames: string[]) => string = Randomcred("username");

  //queries
  const [getUsers] = useLazyQuery(LISTUSERS);
  const [loginuser] = useMutation(LOGINUSER);
  const [updateUser] = useMutation(UPDATEUSER);
  const [signupuser] = useMutation(SIGNUPUSER);
  const [magicLogin] = useMutation(MAGICLINKLOGIN);
  const [createUserpreference] = useMutation(UPSERTUSERPREFERENCES);

  //helpers
  const isUsernameAvailable: checkusernametype = async (
    uname?: string,
    uemail?: string
  ) => {
    const { data } = await getUsers();
    const allUsers = data?.listUsers;

    if (allUsers) {
      const user = allUsers.find(
        (user: usertype) => user.username === uname || user.email === uemail
      );

      if (user) return true;
    }

    return false;
  };

  const login: logintype = (userdata: userdatatype) => {
    return new Promise((resolve, reject) => {
      let loginData: userdatatype | undefined;

      if (userdata?.email) {
        loginData = {
          email: userdata?.email.trim(),
          password: userdata?.password.trim(),
        };
      } else if (userdata?.username) {
        loginData = {
          username: userdata?.username.trim(),
          password: userdata.password.trim(),
        };
      }

      if (!loginData) {
        reject("Username/email & password is required!!!");
        return;
      }

      loginuser({
        variables: {
          data: loginData,
        },
        onError: ({ message }: { message: string }) => {
          reject(message);
        },
        onCompleted: ({ loginUser }: { loginUser: loggedinuserdatatype }) => {
          if (loginUser) {
            const loggedinData: loggedinuserdatatype = loginUser;
            const loginData: loginusertype = {
              id: loggedinData.id,
              email: loggedinData.email,
              username: loggedinData.username,
              new_user: loggedinData.new_user,
              role: loggedinData.role.role_id,
              token: loggedinData.token,
            };

            authcontext.login(loginData);
            loggedinData?.new_user! &&
              navigate(`/u/${loggedinData?.username!}`);

            resolve(loggedinData);
          }
        },
      });
    });
  };

  async function signupAndLoginUser(
    signupData: signupdatatype,
    anon: boolean = false
  ): Promise<void> {
    try {
      await signupuser({
        variables: {
          data: signupData,
        },
        onError: (err: any) => {
          throw Error(err.message);
        },
        onCompleted: async ({ insertUser }: { insertUser: usertype }) => {
          if (insertUser) {
            if (anon) {
              await updateUser({
                variables: {
                  data: {
                    id: insertUser.id,
                    role: 1337,
                  },
                },
              });
            }

            await createUserpreference({
              variables: {
                data: {
                  user: insertUser.username,
                },
              },
            });
            await login({
              password: signupData.password,
              username: insertUser.username,
            });
          }
        },
      });
    } catch (err) {
      throw new Error("Something went wrong with signup and logging user");
    }
  }

  const handleGoogleLoginSuccess = async (res: { access_token: string }) => {
    try {
      const credReq = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${res.access_token}`
      );
      const userInfo = await credReq.json();
      const isUserExist: boolean = await isUsernameAvailable(
        userInfo.name,
        userInfo.email
      );

      const signupData = {
        email: userInfo.email,
        username: userInfo.name,
        password: randomPassword(),
      };

      if (!isUserExist) {
        await signupAndLoginUser(signupData);
      } else {
        const { email, ...logindata } = signupData;
        await login(logindata);
      }
    } catch (err) {
      throw new Error("Error in google login");
    }
  };

  const googleLogin: () => void = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: (codeResponse: any) => {
      throw new Error(`Error: ${codeResponse}`);
    },
  });

  const anonymousLogin: () => Promise<void> = async () => {
    let anonemail: string = randomMail();
    let anonusername: string = randomUsername([]);
    let isUsernameExist: boolean = await isUsernameAvailable(
      anonusername,
      anonemail
    );

    while (isUsernameExist) {
      anonusername = randomUsername([]);
      anonemail = randomMail();
      isUsernameExist = await isUsernameAvailable(anonusername, anonemail);
    }

    if (!isUsernameExist) {
      const anonlogindata: signupdatatype = {
        username: anonusername,
        password: randomPassword(),
        email: anonemail,
      };
      await signupAndLoginUser(anonlogindata, true);
    }
  };

  const magiclinkLogin: magiclogintype = async (mailTo: string) => {
    try {
      await magicLogin({
        variables: {
          data: {
            email: mailTo,
            password: randomPassword(),
            message: `Tired of passwords? Here is your magic link for one click login. \n`,
          },
        },
        onCompleted: (data) => {
          if (data) {
            return { status: 200, message: "Mail Sent Successfully" };
          }
        },
      });

      return { status: 500, message: "Something went wrong with sending mail" };
    } catch (err) {
      throw err;
    }
  };

  const loginThrough: Record<loginthroughtype, any> = {
    login,
    googleLogin,
    anonymousLogin,
    magiclinkLogin,
    isUsernameAvailable,
    signupAndLoginUser,
  };

  return loginThrough[loginmethod];
};

export default useLoginvia;
