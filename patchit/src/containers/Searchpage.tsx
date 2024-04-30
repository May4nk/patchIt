import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
//components
import Loadingpage from "../components/Loadingpage";
import Zeropostcard from "../components/Zeropostcard";
import Htab from "../components/html/Htabs";
import { dateFormatter } from "../common/helpers";
//queries
import { GETALLCOMMENTS, GETCOMMUNITIES, GETUSERS } from "./queries/searchpage";
import { GETALLPOSTS } from "./queries/common";
//css & tyeps
import "./css/main.css";
import "./css/searchpage.css";
import { posttype } from "../types/posttype";
import { searchCategories } from "../constants/const";
import { commenttype, communitytype, usertype } from "./types/searchpage"

let pic: string = require("../img/a.jpg");

const Searchpage = () => {
  const { searchtext } = useParams();

  const [searchBy, setSearchBy] = useState<string>("Posts");
  
  const [getCommunities, { data: allCommunitiesData, loading: allCommunitiesLoading }] = useLazyQuery(GETCOMMUNITIES);
  const [getUsers, { data: allUsersData, loading: allUsersLoading }] = useLazyQuery(GETUSERS);
  const [getPosts, { data: allPostsData, loading: allPostsLoading }] = useLazyQuery(GETALLPOSTS);
  const [getComments, { data: allCommentsData, loading: allCommentsLoading }] = useLazyQuery(GETALLCOMMENTS);
    
  //handlers
  const handleSearchtabs:(searchbyoption: string) => void = (searchbyoption) => {
    document.querySelector(`.tab${searchBy}`)?.classList?.remove("selected");
    setSearchBy(searchbyoption);
    document.querySelector(`.tab${searchbyoption}`)?.classList?.add("selected");
  }

  const foundCommunities: communitytype[] = !allCommunitiesLoading && allCommunitiesData?.listCommunities?.filter((community: communitytype) => {
    return community.communityname.toLowerCase().includes(searchtext!.toLowerCase());
  });
 
  const foundPeople: usertype[] = !allUsersLoading && allUsersData?.listUsers?.filter((user: usertype) => {
    return user.username.toLowerCase().includes(searchtext!.toLowerCase());    
  });
  
  const foundPost: posttype[] = !allPostsLoading && allPostsData?.listPosts.filter((post: posttype) => {
    return post.title.toLowerCase().includes(searchtext!.toLowerCase()); 
  });

  const foundComments: commenttype[] = !allCommentsLoading && allCommentsData?.listComments.filter((comment: commenttype) => {
    return comment.comment.toLowerCase().includes(searchtext!.toLowerCase());
  })

  useEffect(() => {
    if(searchtext && searchtext.length !== 0) {
      getCommunities({
        variables: {
          filter: {
            status: "ACTIVE",
            privacy: "PUBLIC"
          }
        }
      });  
      getPosts({
        variables: {
          filter: {
            status: "ACTIVE",
            privacy: "PUBLIC"
          }
        }
      });
      getUsers({
        variables: {
          filter: {
            status: "ACTIVE",
            privacy: "PUBLIC"
          }
        }
      });
      getComments({
        variables: {
          filter: {
            status: "ACTIVE"
          }
        }
      })
    }
  }, [searchtext]);

  useEffect(() => {
    handleSearchtabs("Posts");
  }, [])
 
  return (
    <>    
      <div className="searchoverview"> Search result </div> 
      <div className="useroverview">        
        { searchCategories.map((category: { name: string, icn: string }, idx: number) => (
          <Htab 
            tabname={ category.name } 
            handleClick={ () =>  handleSearchtabs(category.name) } 
            tabicn={ category.icn } 
            key={ idx }
            />
            ))}
      </div>    
      <div className="flexy">
        <div className="contentpost">           
          <div className="searchbycontent">
            { searchBy === "Posts" ? (
              allPostsLoading === false ? (           
                foundPost?.length > 0 ? (
                  foundPost?.map((post: posttype, idx: number) => (
                    <Link to={`/post/${ post.id }`} className="searchbycard" key={ idx }>
                      <div className="searchbypostcontent">
                        <div className="searchbypostheader"> 
                          <div className="searchbyheaderpicwrapper">
                            <img className="searchbyheaderpic" src={ pic } alt={pic}/>                      
                          </div>
                          <div className="searchbyheadercommunity">c/{ post?.community_id?.communityname }</div>
                          <div className="searchbyheaderposttime">. 2 years ago </div>
                        </div>
                        <div className="searchbypostbody"> 
                          { post.title }
                        </div>
                        <div className="searchbypostfooter"> 
                          { post?.likes } likes .{  post?.comments.length } comments
                        </div>
                      </div>
                      { post.type === "IMAGE" && (
                        <div className="searchbypostpicwrapper">
                          <img src={ pic } className="searchbypostpic" alt={"post_pic"}/>
                        </div>
                      )}
                    </Link>
                  ))
                ) : (
                  <Zeropostcard 
                    title={`Uh! oh No Post found for "${searchtext}"`} 
                    content={[
                      {
                        title: "Create your own post", 
                        content: "User must be logged in.",
                        unlock: "people_outline",
                        link: "/post/new",
                        btntxt: "create post"
                      },
                    ]} 
                  />
                )
              ) : (
                <Loadingpage />
              )
            ) : searchBy === "Comments" ? (
              !allCommentsLoading ? (
                foundComments?.length > 0 ? (
                  foundComments.map((comment: commenttype, idx: number) => (
                    <Link to={`/post/${ comment?.post_id.id }`} className="searchbycard" key={ idx }>
                      <div className="searchbypostcontent">
                        <div className="searchbypostheader"> 
                          <div className="searchbyheaderpicwrapper">
                            <img className="searchbyheaderpic" src={ pic } alt={ "community_profile_pic" } />                      
                          </div>
                          <div className="searchbyheadercommunity">c/{ comment?.post_id?.community_id?.communityname }</div>
                          <div className="searchbyheaderposttime">. { dateFormatter(comment?.created_at) } </div>
                        </div>
                        <div className="searchbypostbody"> 
                          { comment?.post_id?.title }
                        </div>
                        { comment.parent_id ? (
                          <div className="searchbypostpcomment"> 
                            <div className="searchbypostpcommentheader">
                              <div className="searchbypostpcommentpicwrapper">
                                <img src={ pic } alt="pic" className="searchbypostpcommentpic" />                                
                              </div>
                              u/{ comment.parent_id.user_id.username }
                            </div>
                            <div className="searchbypostcommenttext">
                              { comment.parent_id.comment }
                            </div>
                            <div className="searchbypostcomment"> 
                              { comment.comment }
                            </div>
                          </div>
                        ) : (
                          <div className="searchbypostcomment"> 
                            <div className="searchbypostpcommentheader">
                              <div className="searchbypostpcommentpicwrapper">
                                <img src={ pic } alt="pic" className="searchbypostpcommentpic" />                                
                              </div>
                              u/{ comment.user_id.username }
                            </div>
                            <div className="searchbypostcommenttext">
                              { comment.comment }
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <Zeropostcard 
                    title={`Uh! oh No comments found for "${searchtext}"`}
                  />
                )
              ) : (
                <Loadingpage />
              )              
            ) : searchBy === "Communities" ? (
              allCommunitiesLoading === false ? (
                foundCommunities?.length > 0 ? (               
                  foundCommunities?.map((community: communitytype, idx: number) => (
                    <Link to={`/c/${ community.communityname }`} className="searchbycard" key={ idx }>
                      <div className="searchbycardpicwrapper">
                        <img src={ pic } className="searchbycardpic" alt={"community_profile_pic"} /> 
                      </div>
                      <div className="searchbycardcontent">
                        <div className="searchbycardcontentheader"> 
                          c/{ community.communityname }
                        </div>
                        <div className="searchbycardcontentabout"> 
                          { community.posts.length } post{ community.posts.length > 1 && 's'} . { community.users.length } member{ community.users.length > 1 && 's'}
                        </div>
                        { community.description && (
                          <div className="searchbycardcontentinfo"> 
                            { community.description }
                          </div>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <Zeropostcard 
                    title={`Uh! oh No results found for "${searchtext}"`}
                  />
                )
              ) : (
                <Loadingpage />
              )
            ) : searchBy === "Peoples" && (
              allUsersLoading === false ? (
                foundPeople?.length > 0 ? (
                  foundPeople?.map((user: usertype, idx: number) => (
                    <Link to={`/u/${ user.username }`} className="searchbycard" key={ idx }>
                      <div className="searchbycardpicwrapper">
                        <img src={ pic } className="searchbycardpic" alt={ "user_profile_pic" }/> 
                      </div>
                      <div className="searchbycardcontent">
                        <div className="searchbycardcontentheader"> 
                          { user.username }
                        </div>
                        <div className="searchbycardcontentabout"> 
                          { user.posts.length } posts . 1 patcoin
                        </div>
                        { user.about && (
                          <div className="searchbycardcontentinfo"> 
                            { user.about }
                          </div>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <Zeropostcard 
                    title={ `Uh! oh No user found for "${searchtext}"`}
                    content={[
                      {
                        title: "Try signing up on your own account", 
                        content: "Sign up here",
                        unlock: "perm_identity",
                        link: "/account/register",
                        btntxt: "Sign up"
                      },
                    ]} 
                  />
                )
              ) : (
                <Loadingpage />
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Searchpage;

