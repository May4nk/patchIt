import { useMutation, useLazyQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../utils/hooks/useAuth";

//components
import Tag from "./Tag";
import Postrulestab from "./Postrulestab";
import Typepostpoll from "./Typepostpoll";
import Typepostimage from "./Typepostimage";
import Htab from "../../components/html/Htabs";
import Askinput from "../../components/html/Askinput";
import Loadingpage from "../../components/Loadingpage";
import Patdrop from "../../components/html/patdrop/Patdrop";
import Infocreatecard from "../../components/infosection/Infocreatecard";
import Infodescription from "../../components/infosection/Infodescription";

//queries & mutations
import { UPSERTPOST, ALLCOMMUNITIESNAME, GETONECOMMUNITY, ALLTAGS, INSERTTAGS } from "./queries";

//css, types & constants
import "../css/main.css";
import "./css/newpost.css";
import { authcontexttype } from "../../context/types";
import { communityDropperprofile } from "../../constants/patdropconst";
import { droppertype, profiletype } from "../../components/html/patdrop/types";
import { defaultCommunityPic, newpostrules, postgenres } from "../../constants/const";
import { postdatatypes, postimgtypes, communitynametypes, communitytype, tagtype, newpolltype } from "./types";

const Newpost = () => {
  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const loggedInUserId: number | null = user && Number(user["id"]);

  //query & mutations
  const [createPost] = useMutation(UPSERTPOST);
  const [insertTags] = useMutation(INSERTTAGS);
  const [getCommunity, { loading, data }] = useLazyQuery(GETONECOMMUNITY);
  const [getTags, { loading: tagLoading, data: tagData }] = useLazyQuery(ALLTAGS);
  const [getCommunities, { data: communitiesData }] = useLazyQuery(ALLCOMMUNITIESNAME);

  //states
  const [postType, setPostType] = useState<string>("BLOG");
  const [currentpreviewImg, setCurrentpreviewImg] = useState<number>(1);
  const [selectedCommunity, setSelectedCommunity] = useState<string>("");
  const [postTags, setPostTags] = useState<number[]>([]);
  const [postImg, setPostImg] = useState<postimgtypes[]>([{ id: 0, postCaption: "", postSrc: "", postLink: "" }]);
  const [polls, setPolls] = useState<newpolltype[]>([
    { value: "", count: 0 },
    { value: "", count: 0 }
  ]);
  const [postData, setPostData] = useState<postdatatypes>({
    title: "",
    content: "",
    type: postType,
    owner: loggedInUserId!,
    community_id: null,
    privacy: "PUBLIC"
  });

  //constants
  const communityDroppersearch: droppertype[] = communitiesData?.listCommunities?.map((
    community: communitynametypes) => ({
      state: "CLICKED",
      title: `c/${community.communityname}`,
      img: community.profile_pic || defaultCommunityPic,
      event: () => setSelectedCommunity(community.communityname),
    }
  )) || [];

  const communityDroppers: droppertype[] = [
    { title: "COMMUNITIES", text: true }, ...communityDroppersearch
  ];

  const privacyDropperprofile: profiletype = { set: postData?.privacy };

  const privacyDroppers: droppertype[] = [
    {
      title: "PUBLIC", icn: "person_outline",
      state: "CLICKED", event: () => setPostData({ ...postData, privacy: "PUBLIC" })
    },
    {
      title: "PRIVATE", icn: "lock_outline",
      state: "CLICKED", event: () => setPostData({ ...postData, privacy: "PRIVATE" })
    },
    {
      title: "RESTRICTED", icn: "no_encryption",
      state: "CLICKED", event: () => setPostData({ ...postData, privacy: "RESTRICTED" })
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

    setPostTags(prevTags => prevTags.includes(tagId)
      ? prevTags.filter((tag: number) => tag !== tagId)
      : [...prevTags, tagId]
    )
  }

  const handleRemoveCurrentpreviewimg: (imgobjid: number) => void = (imgobjid: number) => {
    if (currentpreviewImg === postImg.length - 1 && currentpreviewImg > 1) {
      setCurrentpreviewImg(currentpreviewImg - 1);
    }

    const temppostImages: postimgtypes[] = postImg.filter((image: postimgtypes) => (
      image.id !== imgobjid
    ))

    setPostImg(temppostImages);
  }

  const handlePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && postType === "IMAGE") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImg([
          ...postImg,
          {
            id: postImg[postImg.length - 1].id + 1,
            postCaption: "",
            postLink: "",
            postSrc: reader.result as string
          }
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangepostdata: (e: any) => void = (e: any) => {
    if (postType === "IMAGE" && e.target.name === "content") {
      handlePic(e);
    } else {
      setPostData({
        ...postData,
        [e.target.name]: e.target.value
      })
    }
  }

  const handleDefault: () => void = () => {
    setPostData({ ...postData, content: "" });
    setPolls([{ value: "", count: 0 }, { value: "", count: 0 }]);
    setPostImg([{ id: 0, postCaption: "", postSrc: "", postLink: "" }]);
  }

  const handleSubmit: (e: any) => Promise<void> = async (e: any) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await createPost({
        variables: {
          data: postData
        },
        onCompleted: async ({ upsertPost }) => {
          if (upsertPost && postTags.length !== 0) {
            await insertTags({
              variables: {
                data: postTags.map((tagId: number) => (
                  {
                    "tag_id": tagId,
                    "post_id": upsertPost.id
                  }
                ))
              }
            });
          }

          navigate(`/post/${upsertPost?.id}`);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    setPostData({
      ...postData,
      content: postType === "IMAGE"
        ? JSON.stringify(postImg.slice(1,))
        : postType === "POLL"
          ? JSON.stringify(polls)
          : ""
    });
  }, [postImg, polls])

  useEffect(() => {
    if (selectedCommunity.length > 1) {
      getCommunity({
        variables: {
          communityname: selectedCommunity,
        },
        onCompleted: ({ community }: { community: communitytype }) => {
          if (community) {
            setPostData({
              ...postData,
              community_id: Number(community.id)
            })
          }
        }
      });
    }
  }, [selectedCommunity]);

  useEffect(() => {
    handleDefault();
  }, [postType])

  useEffect(() => {
    if (!user) {
      navigate("/c/popular");
      return;
    };

    handleposttype("BLOG");

    getTags();
    getCommunities({
      variables: {
        filter: {
          "privacy": "PUBLIC",
          "status": "ACTIVE"
        }
      }
    });
  }, []);  

  return (
    <div className="flexy">
      <div className="flexcontainerL">
        <div className="createpost">
          <div className="newposttitle"> 
            Create Post
          </div>
          <hr className="hr" />
          <div className="choose">
            <div className="choosecommunity">
              <Patdrop
                droppers={communityDroppers}
                profile={communityDropperprofile}
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
                  key={idx}
                  tabicn={genre.tabicn}
                  tabname={genre.tabname.toLowerCase()}
                  handleClick={() => handleposttype(genre.tabname)}
                />
              ))}
            </div>
            <form className="newpost" onSubmit={handleSubmit}>
              <div className="grey-text text-darken-1"> Tags </div>
              <div className="tags">
                {!tagLoading && (
                  tagData?.listTags?.map((tag: tagtype, idx: number) => (
                    <Tag
                      info={tag}
                      key={idx}
                      handleClick={handleTags}
                    />
                  ))
                )}
              </div>
              <div className="createposttile">
                <Askinput
                  type={"text"}
                  name={"title"}
                  required={true}
                  maxlength={100}
                  placeholder={"Title"}
                  onChange={handleChangepostdata}
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
                  image={postImg}
                  setImage={setPostImg}
                  onChange={handleChangepostdata}
                  currentpreviewImage={currentpreviewImg}
                  setCurrentpreviewImage={setCurrentpreviewImg}
                  handleRemovepreviewImage={handleRemoveCurrentpreviewimg}
                />
              ) : postType === "LINK" ? (
                <textarea
                  id="url"
                  required
                  name="content"
                  placeholder="Url"
                  onChange={handleChangepostdata}
                ></textarea>
              ) : postType === "POLL" && (
                <Typepostpoll
                  polls={polls}
                  setPolls={setPolls}
                />
              )}
              <div className="postbtnwrapper">
                <button
                  type="submit"
                  disabled={postData.title.length < 3 ? true : false}
                  className="waves-effect btn waves-light postbtn light-blue lighten-2 black-text"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="flexcontainerR">
        {selectedCommunity.length > 1 && (
          data && (
            !loading ? (
              <>
                <Infocreatecard data={{ ...data?.community, inCommunity: false }} />
                {data?.community?.description && (
                  <Infodescription info={data?.community?.description} />
                )}
              </>
            ) : (
              <Loadingpage />
            )
          )
        )}
        <div className="newpostinfo">
          <Postrulestab
            active={true}
            about={"Rules to patch!!"}
          />
          {newpostrules.map((rules: string, idx: number) => (
            <Postrulestab
              key={idx}
              about={rules}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Newpost;