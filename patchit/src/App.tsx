import React from "react";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "./common/hooks/useRequireAuth";
//containers
import Home from "./containers/Home";
import Popular from "./containers/Popular";
import Userpage from "./containers/User";
import Searchpage from "./containers/Searchpage";
import Postpage from "./containers/Postpage";
import Newpost from "./containers/Newpost";
import Community from "./containers/Community";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Profilesetting from "./containers/profileSettings/Profilesetting";
import Superadminprofile from "./su/containers/Superadminprofile";
import Communitysetting from "./containers/Communitysetting";
//layouts
import Rootlayout from "./layouts/Rootlayout";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="account/login" element={<Login />} />
        <Route path="account/register" element={<Signup />} />
        <Route path="account/verify/:verifycode" element={<Login />} />
        <Route path="/" element={<Rootlayout />}>
          <Route index element={<Popular />} />
          <Route path="c/popular" element={<Popular />} />
          <Route path="home" element={<Home />} />
          <Route path="c/:cname" element={<Community />} />
          <Route path="u/:uname" element={<Userpage />} />
          <Route path="search/:searchtext" element={<Searchpage />} />
          <Route path="post/:postid" element={<Postpage />} />
          <Route element={<RequireAuth />}>
            <Route path="post/new" element={<Newpost />} />
            <Route path="c/:cname/submit" element={<Newpost />} />
            <Route path="u/:uname/settings/profile" element={<Profilesetting />} />
            <Route path="c/:cname/settings" element={<Communitysetting />} />
            <Route path="su/profile" element={<Superadminprofile />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
