import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

//components
import Commentcard from "../../components/cards/Commentcard";
import Zeropostcard from "../../components/cards/Zeropostcard";
import Searchcard from "../../components/cards/Searchcard";
import Postcard from "../../components/cards/Postcard";
import Loadingpage from "../../components/Loadingpage";
import Htab from "../../components/html/Htabs";

//queries
import { GETALLPOSTS } from "../queries/common";
import { GETALLCOMMENTS, GETCOMMUNITIES, GETCOMMUNITYALLACTIONS, GETUSERS } from "./queries";

//css & tyeps
import "./search.css";
import "../css/main.css";
import { posttype } from "../../utils/main/types";
import { communitytype, usertype } from "./types"
import { commentcardtype } from "../../components/cards/types";

const Search = () => {
  const { cname, searchtext } = useParams();

  const searchCategories: Record<"name" | "icn", string>[] = [
    { name: "Posts", icn: "collections" },
    { name: "Comments", icn: "forum" },
    ...(!cname ? [
      { name: "Communities", icn: "people_outline" },
    ] : []),
    { name: "Peoples", icn: "perm_identity" },
  ];

  //states
  const [searchBy, setSearchBy] = useState<string>("Posts");

  //queries
  const [getUsers, { data: allUsersData, loading: allUsersLoading }] = useLazyQuery(GETUSERS);
  const [getPosts, { data: allPostsData, loading: allPostsLoading }] = useLazyQuery(GETALLPOSTS);
  const [getComments, { data: allCommentsData, loading: allCommentsLoading }] = useLazyQuery(GETALLCOMMENTS);
  const [getCommunities, { data: allCommunitiesData, loading: allCommunitiesLoading }] = useLazyQuery(GETCOMMUNITIES);
  const [getCommunityActions, { data: communityData, loading: communityLoading }] = useLazyQuery(GETCOMMUNITYALLACTIONS);

  //handlers
  const handleSearchtabs: (searchbyoption: string) => void = (searchbyoption) => {
    document.querySelector(`.tab${searchBy}`)?.classList?.remove("selected");
    setSearchBy(searchbyoption);
    document.querySelector(`.tab${searchbyoption}`)?.classList?.add("selected");
  }

  const foundCommunities: communitytype[] = useMemo(() => {
    return !allCommunitiesLoading && allCommunitiesData?.listCommunities?.filter(
      (community: communitytype) => community.communityname.toLowerCase().includes(searchtext!.toLowerCase())
    );
  }, [allCommunitiesLoading, allCommunitiesData, searchtext]);

  const foundPeople: usertype[] = useMemo(() => {
    if (!searchtext || searchtext.length <= 1) return [];
    if (cname) {
      if (!communityLoading) {
        const communityUsers = communityData?.community?.users?.map((user: { user_id: usertype }) => user.user_id);
        return communityUsers?.filter((user: usertype) => (
          user.username?.toLowerCase().includes(searchtext.toLowerCase())
        ));
      }
    }

    if (!allUsersLoading) {
      return allUsersData?.listUsers?.filter((user: usertype) => (
        user.username.toLowerCase().includes(searchtext.toLowerCase())
      ));
    }

    return [];
  }, [searchtext, cname, allUsersData, allUsersLoading, communityLoading, communityData]);

  const foundPosts: posttype[] = useMemo(() => {
    if (!searchtext || searchtext.length <= 1) return [];
    if (cname) {
      if (!communityLoading) {
        return communityData?.community?.posts?.filter((post: posttype) => (
          post?.title?.toLowerCase().includes(searchtext.toLowerCase())
        ));
      }
    }

    if (!allPostsLoading) {
      return allPostsData?.listPosts?.filter((post: posttype) => (
        post?.title?.toLowerCase().includes(searchtext.toLowerCase())
      ));
    }

    return [];
  }, [searchtext, cname, communityLoading, allPostsLoading, allPostsData, communityData]);

  const foundComments: commentcardtype[] = useMemo(() => {
    if (!searchtext || searchtext.length <= 1) return [];
    if (cname) {
      if (!communityLoading) {
        const communityPostsComments = communityData?.community?.posts?.map((post: posttype) => post.comments);
        return communityPostsComments?.flat(1)?.filter((comment: commentcardtype) => (
          comment?.comment?.toLowerCase().includes(searchtext.toLowerCase())
        ));
      }
    }

    if (!allCommentsLoading) {
      return allCommentsData?.listComments.filter((comment: commentcardtype) => (
        comment?.comment?.toLowerCase().includes(searchtext.toLowerCase())
      ));
    }

    return [];
  }, [searchtext, cname, allCommentsLoading, allCommentsData, communityLoading, communityData]);

  useEffect(() => {
    if (searchtext && searchtext.length !== 0 && !cname) {
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

    if (searchtext && searchtext.length !== 0) {
      getCommunityActions({
        variables: {
          communityname: cname
        }
      })
    }
  }, []);

  useEffect(() => {
    handleSearchtabs("Posts");
  }, []);

  return (
    <>
      <div className="searchoverview"> Search result </div>
      <div className="useroverview">
        {searchCategories.map((category: { name: string, icn: string }, idx: number) => (
          <Htab
            tabname={category.name}
            handleClick={() => handleSearchtabs(category.name)}
            tabicn={category.icn}
            key={idx}
          />
        ))}
      </div>
      <div className="flexy">
        <div className="patchcontent">
          <div className="searchbycontent">
            {searchBy === "Posts" ? (
              (!allPostsLoading || !communityLoading) ? (
                foundPosts?.length > 0 ? (
                  foundPosts?.map((post: posttype, idx: number) => (
                    <Postcard
                      key={idx}
                      post={post}
                    />
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
              (!allCommentsLoading || !communityLoading) ? (
                foundComments?.length > 0 ? (
                  foundComments.map((comment: commentcardtype, idx: number) => (
                    <Commentcard
                      key={idx}
                      comment={comment}
                    />
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
              !allCommunitiesLoading ? (
                foundCommunities?.length > 0 ? (
                  foundCommunities?.map((community: communitytype, idx: number) => (
                    <Searchcard
                      key={idx}
                      usertype={false}
                      community={community}
                    />
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
              (!allUsersLoading || !communityLoading) ? (
                foundPeople?.length > 0 ? (
                  foundPeople?.map((user: usertype, idx: number) => (
                    <Searchcard
                      key={idx}
                      user={user}
                      usertype={true}
                    />
                  ))
                ) : (
                  <Zeropostcard
                    title={`Uh! oh No user found for "${searchtext}"`}
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

export default Search;