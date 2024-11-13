import React from "react";
import { Route, Routes } from "react-router-dom";

//utils
import RequireAuth from "./utils/hooks/useRequireAuth";

//layouts
import Rootlayout from "./layouts/Rootlayout";

//containers
import Home from "./containers/Home";
import Userpage from "./containers/User";
import Popular from "./containers/Popular";
import Postpage from "./containers/Postpage";
import Login from "./containers/Login/Login";
import Signup from "./containers/Login/Signup";
import Community from "./containers/Community";
import Search from "./containers/Search/Search";
import Newpost from "./containers/newpost/Newpost";
import Patcoinwallet from "./containers/Patcoin/Patcoinwallet";
import Superadminprofile from "./su/containers/Superadminprofile";
import Profilesetting from "./containers/profileSettings/Profilesetting";
import Communitysetting from "./containers/communitySettings/Communitysetting";

const App = () => (
  <>
    <Routes>
      <Route path="account/login" element={<Login />} />
      <Route path="account/register" element={<Signup />} />
      <Route path="account/verify/:verifycode" element={<Login />} />
      <Route path="/" element={<Rootlayout />}>
        <Route index element={<Popular />} />
        <Route path="home" element={<Home />} />
        <Route path="u/:uname" element={<Userpage />} />
        <Route path="c/popular" element={<Popular />} />
        <Route path="c/:cname" element={<Community />} />
        <Route path="post/:postid" element={<Postpage />} />
        <Route path="search/:searchtext" element={<Search />} />
        <Route path="/c/:cname/search/:searchtext" element={<Search />} />
        <Route element={<RequireAuth />}>
          <Route path="post/new" element={<Newpost />} />
          <Route path="su/profile" element={<Superadminprofile />} />
          <Route path="/patcoin/dashboard" element={<Patcoinwallet />} />
          <Route path="c/:cname/settings" element={<Communitysetting />} />
          <Route path="u/:uname/settings/profile" element={<Profilesetting />} />
        </Route>
      </Route>
    </Routes>
  </>
)

export default App;
