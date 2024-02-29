import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { useAuth, useLogged } from "../common/hooks/useAuth";

//components
import Loadingpage from "../components/Loadingpage";
import Infosection from "../components/infosection/Info";
import Infoabout from "../components/infosection/Infoabout";
import Post from "../components/Post";
import Sortpanel from "../components/Sortpanel";
import Newusersetup from "./Newusersetup";
import Zeropostcard from "../components/Zeropostcard";
import Htab from "../components/html/Htabs"

//queries
import { GETUSER, GETSIGNEDUPUSER } from "./queries/user";

//css
import "./css/main.css";
import "./css/user.css";
import { authcontexttype, loggedusercontexttype } from "../context/types";
import { posttype } from "../types/posttype";
import { commenttype, reactedposttype, savedposttype } from "./types/user";

const pic: string = require("../img/loginpagepic.jpg");

const Userpage = () => {
  const { uname } = useParams<string>();
  const { user }: authcontexttype = useAuth();
  const { loggedUser }: loggedusercontexttype = useLogged();
  const loggedInUsername = user && user["username"];
  const isNew:boolean = (user && loggedUser ) && loggedUser["new_user"] ? true : false;
  const allTabnames:string[] = ["posts", "comments", ...(user && (uname === loggedInUsername)) ? ["reactions", "saved"]: []];
  
  //state
  const [userOption, setUserOption] = useState<string>("posts");
  const [sortby, setSortby] = useState<string>("likes");

  //queries
  const [getUser, { data, loading, error }] = useLazyQuery(GETUSER);
  const [getSignedUser, { data: signedupuserData, loading: signedupuserLoading, error: signedupuserError }] = useLazyQuery(GETSIGNEDUPUSER);

  const uData = !user ? !loading && data?.user : !signedupuserLoading && signedupuserData?.user;  

  //handler
  const handleUserOptions: (uoption: string) => void = (uoption) => {
    document.querySelector(`.tab${userOption}`)?.classList?.remove("selected");
    setUserOption(uoption);
    document.querySelector(`.tab${uoption}`)?.classList?.add("selected");
  }
 
  useEffect(() => {
    handleUserOptions("posts");
    if(user) {
      getSignedUser({
        variables: {
          username: uname!
        }
      });
    } else {
      getUser({
        variables: {
          username: uname!
        }
      });
    }
  },[uname, user]);
  
  if (loading || signedupuserLoading) {
    return <Loadingpage />
  } else if(error || signedupuserError) {
    return <Loadingpage err ={ error?.message || signedupuserError?.message }/>
  } else {
    return (
      <>
        <div className="useroverview">  
          { allTabnames.map((usroption: string, idx: number) => (
            <Htab tabname={ usroption } key={ idx } handleClick={() => handleUserOptions(usroption) } />
          ))}
          <Newusersetup newUser={ isNew } />
        </div>
        <div className="flexy">
          <div className="contentpost">
            <div className="postsort">
              <Sortpanel sort={ sortby } setSort={ setSortby } />
            </div>
            { !loading ? (
              <>
                { userOption === "posts" ? (
                  uData?.posts.length > 0 ? (
                    uData?.posts.map((post: posttype, idx: number) => (
                      <div key={ idx }>
                        <Post
                          postData={ post } 
                          showcommunity={ true }
                        />
                      </div>
                    ))
                  ) : (
                    <Zeropostcard
                      title={ "No post Done yet!!" }
                      openstate={ false }
                      content={[
                        {
                          title: "Create",
                          content: "Create a post",
                          unlock: "blur_on",
                          btntxt: "create post",
                          link: "/post/new"
                        }
                      ]} 
                    />
                  )
                ) : userOption === "comments" ? (
                  !loading ? (
                    uData?.comments.length > 0 ? (
                      uData?.comments.map((cmnt: commenttype, idx: number) => (
                        <div className="useroverviewcomment" key={ idx }>
                          <div className="cmntoverviewpost">
                            <div className="cmntoverviewpostpicwrapper"> 
                              <img className="cmntoverviewpostpic" src={ pic } alt={"comment_ppic"}/>
                            </div>
                            <Link to={`/c/${cmnt?.post_id?.community_id?.communityname}`} className="cmntoverviewpostname"> 
                              c/{ cmnt?.post_id?.community_id?.communityname }
                            </Link>
                            . 2hours ago
                          </div>
                          <Link to={`/post/${ cmnt?.post_id?.id }`} className="cmntoverviewposttitle">
                            { cmnt?.post_id?.title}
                          </Link>
                          <div className="cmntoverviewcontent"> 
                            { cmnt?.parent_id ? (
                              <>
                                <div className= "cmntoverviewcontentparent">
                                  <div className="parentcmntwrapper">
                                    <div className="parentcmntpicwrapper">
                                      <img src={ pic } className="parentcmntpic" alt={"user_pic"}/>
                                    </div>
                                    u/{ cmnt?.parent_id?.user_id?.username }
                                  </div>
                                  <div className="parentcmnt">
                                    { cmnt?.parent_id?.comment }
                                  </div>
                                </div>
                                <div className="cmntoverviewcontent">
                                  { cmnt?.comment }
                                </div>
                              </>
                            ) : (
                              cmnt?.comment
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <Zeropostcard
                        title={ "No comments done yet!!" }
                        openstate={ false }
                        content={[
                          {
                            title: "Post something to comment on it",
                            unlock: "center_focus_weak",
                            content: "Create here",
                            btntxt: "create post",
                            link: "/post/new"
                          },
                        ]} 
                      />
                    )
                  ) : (
                    <Loadingpage />
                  )
                ) : userOption === "saved" ? (
                  !signedupuserLoading ? (
                    uData?.savedposts.length > 0 ? (
                      uData?.savedposts.map((post: savedposttype, idx: number) => (
                        <div key={ idx }>
                          <Post 
                            postData={ post.post_id } 
                            showcommunity={ post.post_id.community_id === null ? false : true }
                          />
                        </div>
                      ))
                    ) : (
                      <Zeropostcard 
                        title={ "No post saved yet!!" }
                        openstate={ false }
                        content={[
                          {
                            title: "Don't wanna save? Create one",
                            unlock: "center_focus_weak"
                          },
                        ]} 
                      />
                    )
                  ) : (
                    <Loadingpage />
                  )
                ) : userOption === "reactions" && (
                  !signedupuserLoading ? (
                    uData?.reactedposts.length > 0 ? (
                      uData?.reactedposts.map((post : reactedposttype, idx: number) => (
                        <div key={ idx }>
                          <Post
                            postData={ post.post_id } 
                            showcommunity={ post.post_id.community_id === null ? false : true }
                          />
                        </div>
                      ))
                    ) : (
                      <Zeropostcard
                        title={ "Not reacted to any posts/comments yet!!" }
                        openstate={ false }
                        content={[
                          {
                            title: "Seems you don't like/dislike anything...",
                            content: "First create a post",
                            unlock: "mood_on",
                            btntxt: "create post",
                            link: "/post/new"
                          },
                        ]}
                      />
                    )
                  ) : (
                    <Loadingpage />
                  )
                )}
              </>
            ) : (
              <Loadingpage />
            )}
          </div>
          <div className="contentinfo">
            { !loading ? (
              <Infoabout data={ uData } userdata={ true } />
            ) : (
              <Loadingpage />
            )}
            { !loading ? (
              uData?.ownedCommunities.length > 0 && (
                <Infosection communitypatcherdata={ uData?.ownedCommunities } />
              )
            ) : (
              <Loadingpage />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Userpage;
