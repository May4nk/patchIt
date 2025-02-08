import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

//utils
import { GETMAGICTOKENUSER } from '../../utils/loginqueries';
import { useAuth, useLogged } from '../../utils/hooks/useAuth';

//components
import Log from './Log';
import Sign from './Sign';
import Greetings from './Greetings';
import Fpassword from "./Fpassword";
import Magiclogin from './Magiclogin';
import Errorcard from '../../components/cards/Errorcard';

//css, images & types
import "./login.css";
import { ERRORTYPE } from '../../utils/main/types';
import { loginpagelevels, magictokenusertype } from './types';
import { authcontexttype, loggedusercontexttype, loginusertype } from '../../context/types';

function Loginpage() {
  const navigate = useNavigate();
  const { verifycode, fpasswordtoken } = useParams();
  const location = useLocation();
  const { user, login }: authcontexttype = useAuth();
  const { updateLoggedUser }: loggedusercontexttype = useLogged();

  //queries
  const [verifyMagicToken] = useLazyQuery(GETMAGICTOKENUSER);

  //states
  const [move, setMove] = useState<boolean>(false);
  const [loginLevel, setLoginLevel] = useState<loginpagelevels>(0);
  //0: login, 1: signup, 3: forgot password request, 4: forget mail sent, 5: reset password, 7: magiclink login, 8: magic mail sent, 9: verify magic mail  
  const [error, setError] = useState<ERRORTYPE>({ status: 0, message: "", show: false });

  //handlers
  const handleLoginGreetings = (level: loginpagelevels) => {
    setMove(true);

    setTimeout(() => {
      setLoginLevel(level);
    }, 300);

    setTimeout(() => {
      setMove(false);
    }, 2000);
  }

  useEffect(() => {
    if (user !== null) {
      navigate("/home");
    }

    if (location.pathname.includes("account/register")) {
      handleLoginGreetings(1);
    }

    if (verifycode && verifycode?.length > 0) {
      try {
        handleLoginGreetings(9);
        verifyMagicToken({
          variables: {
            token: verifycode!
          },
          onCompleted: ({ verifyMagicToken }: { verifyMagicToken: magictokenusertype }) => {
            if (verifyMagicToken) {
              const tokenUser: magictokenusertype = verifyMagicToken;
              const loggedinData: loginusertype = {
                id: tokenUser.id,
                token: tokenUser.token,
                email: tokenUser.email,
                role: tokenUser.role.role_id,
                username: tokenUser.username,
                new_user: tokenUser.new_user,
              };

              login(loggedinData);
              // updateLoggedUser({ new_user: loggedinData?.new_user });
              // !loggedinData?.new_user
              //   ? navigate("/home")
              //   : navigate(`/u/${loggedinData?.username!}`);
            }
          },
          onError: () => {
            setError({ status: 500, message: `Verification failed: Please login again to create new token`, show: true });
            setInterval(() => {
              navigate("/home");
            }, 5000);
          }
        })
      } catch (err) {
        setError({
          status: 500,
          show: true,
          message: "Verification failed: Please login again to create new token",
        });
      }
    } else if (fpasswordtoken && fpasswordtoken.length > 0) {
      handleLoginGreetings(5);
    }
  }, [])

  return (
    <div className="loginpagewrapper">
      <div className="loginpagecard">
        <Greetings
          move={move}
          loginLevel={loginLevel}
          setLoginLevel={setLoginLevel}
          handleLoginGreetings={handleLoginGreetings}
        />
        <div className="loginpageform">
          {loginLevel === 0 ? (
            <Log
              setError={setError}
              handleLoginGreetings={handleLoginGreetings}
            />
          ) : loginLevel === 1 ? (
            <Sign
              setError={setError}
              handleLoginGreetings={handleLoginGreetings}
            />
          ) : (loginLevel >= 3 && loginLevel <= 5) ? (
            <Fpassword
              setError={setError}
              token={fpasswordtoken}
              loginLevel={loginLevel}
              handleLoginGreetings={handleLoginGreetings}
            />
          ) : loginLevel >= 7 && (
            <Magiclogin
              error={error}
              setError={setError}
              loginLevel={loginLevel}
              handleLoginGreetings={handleLoginGreetings}
            />
          )}
        </div>
      </div>
      {
        error && (
          <Errorcard message={error} />
        )
      }
    </div >
  )
}

export default Loginpage;