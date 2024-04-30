import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../common/hooks/useAuth";
//components
import Typepostimage from "../components/newpost/Typepostimage";
import Typepostpoll from "../components/newpost/Typepostpoll";
import Tag from "../components/newpost/Tag";
import Postrulestab from "../components/newpost/Postrulestab";
import Askinput from "../components/html/Askinput";
import Htab from "../components/html/Htabs";
import Loadingpage from "../components/Loadingpage";
import Infocreatecard from "../components/infosection/Infocreatecard";
import Patdrop from "../components/html/patdrop/Patdrop";
//queries & mutations
import { UPSERTPOST, ALLCOMMUNITIESNAME, GETONECOMMUNITY, ALLTAGS, INSERTTAGS } from "./queries/newpost";
//css, types & constants
import "./css/newpost.css";
import "./css/main.css";
import { droppertype } from "../components/html/patdrop/types";
import { authcontexttype } from "../context/types";
import { newpostrules, postgenres } from "../constants/const"; //constants
import { communityDropperprofile, privacyDropperprofile } from "../constants/patdropconst";
import { postdatatypes, postimgtypes, communitynametypes, communitytype, tagtype, polltype } from "./types/newposttypes";

let pic: string = require("../img/a.jpg");

const Newpost = () => {
  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const loggedInUserId: number | null = Number(user && (user["user_id"] || user["id"]));

  //query & mutations
  const [createPost] = useMutation(UPSERTPOST);
  const [insertTags] = useMutation(INSERTTAGS);
  const [getCommunity, { loading, data }] = useLazyQuery(GETONECOMMUNITY);
  const [getTags, { loading: tagLoading, data: tagData }] = useLazyQuery(ALLTAGS);
  const { data: communitiesData, loading: communitiesLoading } = useQuery(ALLCOMMUNITIESNAME, {
    variables: {
      filter: {
        "privacy": "PUBLIC",
        "status": "ACTIVE"
      }
    }
  });
  //states
  const [postType, setPostType] = useState<string>("BLOG");
  const [currentpreviewImg, setCurrentpreviewImg] = useState<number>(1);
  const [selectedCommunity, setSelectedCommunity] = useState<string>("");
  const [postTags, setPostTags] = useState<number[]>([]);
  const [polls, setPolls] = useState<polltype[]>([
    { value: "", count: 0 },
    { value: "", count: 0 }
  ]);
  const [postImg, setPostImg] = useState<postimgtypes[]>([{ id: 0, postCaption: "", postSrc: "", postLink: "" }]);
  const [postData, setPostData] = useState<postdatatypes>({
    title: "",
    content: "",
    type: postType,
    owner: loggedInUserId,
    community_id: null,
    privacy: "PUBLIC"
  });
  //constants
  const communityDroppersearch: droppertype[] = communitiesData?.listCommunities.map((community: communitynametypes) => (
    {
      value: `c/${community.communityname}`,
      img: pic,
      state: "clicked",
      event: () => setSelectedCommunity(community.communityname),
    }
  ));

  const communityDroppers: droppertype[] = [
    { value: "COMMUNITIES", text: true },
    ...!communitiesLoading ? communitiesData?.listCommunities.map((community: communitynametypes) => (
      {
        value: `c/${community.communityname}`,
        img: pic,
        state: "clicked",
        event: () => setSelectedCommunity(community.communityname)
      }
    )) : []
  ];

  const privacyDroppers: droppertype[] = [
    {
      value: "Public", icn: "person_outline",
      state: "clicked", event: () => setPostData({ ...postData, privacy: "PUBLIC" })
    },
    {
      value: "Private", icn: "lock_outline",
      state: "clicked", event: () => setPostData({ ...postData, privacy: "PRIVATE" })
    },
    {
      value: "Restricted", icn: "no_encryption",
      state: "clicked", event: () => setPostData({ ...postData, privacy: "RESTRICTED" })
    }
  ];
  //handlers 
  const handleposttype: (typeofpost: string) => void = (typeofpost: string) => {
    setPostData({ ...postData, type: typeofpost });
    document.querySelector(`.tab${postType.toLowerCase()}`)?.classList?.remove("active");
    setPostType(typeofpost);
    document.querySelector(`.tab${typeofpost.toLowerCase()}`)?.classList?.add("active");
  }

  const handleTags: (e: any, tagId: number) => void = (e: any, tagId: number) => {
    e.currentTarget.classList.toggle("active");
    if (postTags.includes(tagId)) {
      postTags.splice(postTags.indexOf(tagId), 1);
    } else {
      setPostTags([...postTags, tagId]);
    }
  }

  const handleRemoveCurrentpreviewimg: (imgobjid: number) => void = (imgobjid: number) => {
    if (currentpreviewImg === postImg.length - 1 && currentpreviewImg > 1) {
      setCurrentpreviewImg(currentpreviewImg - 1);
    }
    const temppostImages = postImg.filter((image: postimgtypes) => (
      image.id !== imgobjid
    ))
    setPostImg(temppostImages);
  }

  const handleChangepostdata: (e: any) => void = (e: any) => {
    if (postType === "IMAGE" && e.target.name === "content") {
      setPostImg([
        ...postImg,
        {
          "id": postImg[postImg.length - 1].id + 1,
          "postCaption": "",
          "postLink": "",
          "postSrc": e.target.value.substr(12),
        }
      ]);
    } else {
      setPostData({
        ...postData,
        [e.target.name]: e.target.value
      })
    }
  }

  const handleSubmit: (e: any) => void = (e: any) => {
    e.preventDefault();
    if (user) {
      createPost({
        variables: {
          data: postData
        },
      }).then(({ data }) => {
        if (data) {
          const insertedPost = data?.upsertPost;
          if (postTags.length !== 0) {
            insertTags({
              variables: {
                data: postTags.map((tagId: number) => {
                  return { "tag_id": tagId, "post_id": insertedPost.id }
                })
              }
            })
          }
          navigate(`/post/${insertedPost?.id}`);
        }
      });
    } else {
      navigate("/login");
    }
  }

  useEffect(() => {
    if (postType === "IMAGE") {
      setPostData({
        ...postData,
        content: JSON.stringify(postImg.slice(1,))
      })
    }
  }, [postImg])

  useEffect(() => {
    if (postType === "POLL") {
      setPostData({
        ...postData,
        content: JSON.stringify(polls)
      });
    }
  }, [polls]);

  useEffect(() => {
    if (selectedCommunity) {
      getCommunity({
        variables: {
          communityname: selectedCommunity,
        }
      }).then(({ data }: { data: { community: communitytype } }) => {
        if (data) {
          setPostData({
            ...postData,
            community_id: Number(data?.community.id)
          })
        }
      })
    }
  }, [selectedCommunity]);

  useEffect(() => {
    setPostData({
      ...postData,
      content: ""
    })
  }, [postType])

  useEffect(() => {
    if (!user) {
      navigate("/c/popular");
    }
    handleposttype("BLOG");
    getTags();
  }, []);

  return (
    <div className="flexy">
      <div className="flexcontainerL">
        <div className="createpost">
          <div className="newposttitle"> Create Post </div>
          <hr className="hr" />
          <div className="choose">
            <div className="choosecommunity">
              <Patdrop
                profile={communityDropperprofile}
                droppers={communityDroppers}
                searchinto={communityDroppersearch}
              />
            </div>
            <div className="chooseprivacy">
              <Patdrop profile={privacyDropperprofile} droppers={privacyDroppers} />
            </div>
          </div>
          <div className="createnewpost">
            <div className="typeofpost">
              {postgenres.map((genre: Record<"tabname" | "tabicn", string>, idx: number) => (
                <Htab
                  tabname={genre.tabname.toLowerCase()}
                  tabicn={genre.tabicn}
                  handleClick={() => handleposttype(genre.tabname)}
                  key={idx}
                />
              ))}
            </div>
            <form className="newpost" onSubmit={handleSubmit}>
              <div className="grey-text text-darken-1"> Tags </div>
              <div className="tags">
                {!tagLoading && (
                  tagData?.listTags?.map((tag: tagtype, idx: number) => (
                    <Tag info={tag} key={idx} handleClick={handleTags} />
                  ))
                )}
              </div>
              <div className="createposttile">
                <Askinput type={"text"}
                  placeholder={"Title"}
                  name={"title"}
                  onChange={handleChangepostdata}
                  required={true}
                  maxlength={100}
                />
              </div>
              {postType === "BLOG" ? (
                <textarea
                  id="postcontent"
                  placeholder="Text(optional)"
                  name="content"
                  onChange={handleChangepostdata}
                ></textarea>
              ) : postType === "IMAGE" ? (
                <Typepostimage
                  onChange={handleChangepostdata}
                  currentpreviewImage={currentpreviewImg}
                  setCurrentpreviewImage={setCurrentpreviewImg}
                  image={postImg}
                  setImage={setPostImg}
                  handleRemovepreviewImage={handleRemoveCurrentpreviewimg}
                />
              ) : postType === "LINK" ? (
                <textarea
                  id="url"
                  placeholder="Url"
                  name="content"
                  onChange={handleChangepostdata}
                  required
                ></textarea>
              ) : postType === "POLL" && (
                <Typepostpoll
                  polls={polls}
                  setPolls={setPolls}
                />
              )}
              <div className="postbtnwrapper">
                <button className="waves-effect btn waves-light postbtn blue black-text" disabled={postData.title.length < 3 ? true : false} type="submit">
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="flexcontainerR">
        {data && (
          !loading ? (
            <Infocreatecard data={data?.community} />
          ) : (
            <Loadingpage />
          )
        )}
        <div className="newpostinfo">
          <Postrulestab about={"Rules to patch!!"} active={true} />
          {newpostrules.map((rules: string, idx: number) => (
            <Postrulestab about={rules} key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Newpost;