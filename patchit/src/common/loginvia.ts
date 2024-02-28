import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useGoogleLogin } from '@react-oauth/google';

import { Randomcred } from "./helpers";
import { useAuth, useLogged } from "./hooks/useAuth";

import { SIGNUPUSER, LOGINUSER, MAGICLINKLOGIN, UPDATEUSER, LISTUSERS, UPSERTUSERPREFERENCE } from "./loginqueries"; //queries

//types
import { authcontexttype } from "../context/types";
import { loginUsertype, loggedintype, loginthroughtype, usrdatatype, logindatatype, usertype } from "./types";

const useLoginvia = (loginmethod: loginthroughtype) =>  {
  
  const navigate = useNavigate();
  const authcontext: authcontexttype = useAuth();
  const { updateLoggedUser } = useLogged();

  const randomMail: () => string = Randomcred("mail");
  const randomUsername: (unames: string[]) => string = Randomcred("username");
  const randomPassword: () => string = Randomcred("password");

  //queries
  const [loginuser] = useMutation(LOGINUSER);
  const [magicLogin] = useMutation(MAGICLINKLOGIN);
  const [updateUser] = useMutation(UPDATEUSER);
  const [signupuser] = useMutation(SIGNUPUSER); 
  const [createUserpreference] = useMutation(UPSERTUSERPREFERENCE);
  const [getUsers, { data, loading }] = useLazyQuery(LISTUSERS);

  useEffect(() => {
    getUsers();
  },[]);

  //helper func 
  const checker:(uname: string, uemail: string) => boolean = (uname: string, uemail: string) => {
    const checkUser: string[] = !loading && data?.listUsers.filter((user: usertype) => {
      return user.username === uname && user.email === uemail;
    })

    if(checkUser.length > 0) return true;
    return false;
  }

  const login: (usrdata: usrdatatype) => Promise<loginUsertype> = (usrdata: usrdatatype) => {
    return new Promise((resolve, reject) => {
      loginuser({
        variables: {
          data: {
            username: usrdata.username, 
            password: usrdata.password,
          }
        }, onError: ({ message }: { message: string}) => {
          reject(message);
        },
        onCompleted: ({ loginUser }: loggedintype) => {
          if(loginUser) {
            const loggedinData: loginUsertype = loginUser;
            resolve(loggedinData);
            authcontext.login(loggedinData);
            updateLoggedUser({ new_user: loggedinData?.new_user! });
            !loggedinData?.new_user! ? navigate("/home") : navigate(`/u/${ loggedinData?.username! }`);
          }
        }
      });
    })
  }

  const googleLogin: () => void = useGoogleLogin({
    onSuccess: async(res) => { 
      const credReq = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${res.access_token}`);
      const userCred = await credReq.json();
      const signupdata = { 
        email: userCred.email,
        username: userCred.name, 
        password: randomPassword(),
      }
      const isUserExist: boolean = checker(userCred.name, userCred.email);

      if(!isUserExist) {
        signupuser({ 
          variables: {
            data: signupdata
          },   
          onError: (err: any) => {
            throw Error(err.message);
          },
          onCompleted: ({ insertUser }: { insertUser: usertype }) => {
            if(insertUser) {
              createUserpreference({
                variables: {
                  data: {
                    user_id: insertUser.id
                  }
                }
              });
              login({ password: signupdata.password, ...insertUser });
            }
          }
        })
      } else {
        const { email, ...logindata } = signupdata;
        login(logindata).catch((err: string) => {
          console.log(err);
        });
      }
    },
    onError: codeResponse => {
      throw new Error(`Error: ${codeResponse}`)
    }
  });
  
  const anonymousLogin: () => void = () => {
    let anonusername: string = randomUsername([]);
    let anonemail: string = randomMail();

    let isUsernameExist: boolean = checker(anonusername, anonemail);

    while (isUsernameExist) {
      anonusername = randomUsername([]);
      anonemail = randomMail();
      isUsernameExist = checker(anonusername, anonemail);
    }

    if(!isUsernameExist) {
      const anonlogindata: logindatatype = {
        username: anonusername,
        password: randomPassword(),
        email: anonemail,
      };
      try {
        signupuser({
          variables: {
            data: anonlogindata
          },
          onCompleted: ({ insertUser }: { insertUser: usertype }) => {
            if(insertUser) {
              updateUser({
                variables: {
                  data: {
                    id: insertUser.id,
                    role: 1337
                  }
                }
              });
              createUserpreference({
                variables: {
                  data: {
                    user_id: insertUser.id
                  }
                }
              }).then(() => {
                const { email, ...anonData } = anonlogindata;
                login(anonData);
              });
            }
          }
        });
      } catch(err: any) {
        throw new Error(err);
      }

    }
  }

  const magiclinkLogin: (mailTo: string) => any = async(mailTo: string) => {
    try {
      const clicklogin = await magicLogin({
        variables: {
          data: {
            email: mailTo,
          }
        },
      });

      createUserpreference({
        variables: {
          data: {
            user_id: clicklogin.data.magicloginUser.id
          }
        }
      });
      
      const token: string = clicklogin.data.magicloginUser.token;
    
      const mail = {
        service_id: 'service_6ntc9cu',
        template_id: 'template_wrjw7a4',
        user_id: 'suEDEnYrpT15nDWJf',
        template_params: {
          'to_email': mailTo,
          'to_name': mailTo.substring(0, mailTo.indexOf("@")),
          'message': `Please click on link to verify yourself. \n http://localhost:3000/account/verify/${ token }`,
        }
      }
    
      const sendMail = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        body: JSON.stringify(mail),
        headers: {
          "Content-Type": "application/json",
        },
      });
    
      return sendMail;
    } catch(err: any) {
      throw new Error(err.message);
    }
  }

  const loginThrough: Record<loginthroughtype, (mailTo?: any) => any > = {
    anonymousLogin,
    googleLogin,
    magiclinkLogin,
    login
  }

  return loginThrough[loginmethod];
}

export default useLoginvia;
