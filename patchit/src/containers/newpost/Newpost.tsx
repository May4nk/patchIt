import React, { useEffect, useReducer } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

//utils
import { useAuth } from "../../utils/hooks/useAuth";
import { newPostInitState } from "../../utils/opx/postopx";
import { uploadToS3, getSignedUrls } from "../../utils/services/s3";

//components
import Tag from "./Tag";
import Postrulestab from "./Postrulestab";
import Typepostpoll from "./Typepostpoll";
import Typepostimage from "./Typepostimage";
import Htab from "../../components/html/Htabs";
import Patbtn from "../../components/html/Patbtn";
import Askinput from "../../components/html/Askinput";
import Loadingpage from "../../components/Loadingpage";
import Errorcard from "../../components/cards/Errorcard";
import Patdrop from "../../components/html/patdrop/Patdrop";
import Infocreatecard from "../../components/infosection/Infocreatecard";
import Infodescription from "../../components/infosection/Infodescription";

//queries & mutations
import { ALLCOMMUNITIESNAME, GETONECOMMUNITY, ALLTAGS, INSERTTAGS, CREATEPOST } from "./queries";

//css, types & constants
import "../css/main.css";
import "./css/newpost.css";
import { POSTTYPE } from "../../utils/main/types";
import { signedurltype } from "../../utils/types";
import { authcontexttype } from "../../context/types";
import { droppertype, profiletype } from "../../components/html/patdrop/types";
import { defaultCommunityPic, newpostrules, postgenres } from "../../constants/const";
import {
  communitynametypes,
  communitytype,
  genretype,
  newpoststatetype,
  newpostactiontype,
  postimagetype,
  postpolltype,
  posttagtype,
} from "./types";

const Newpost = () => {
  const navigate = useNavigate();
  const { cname } = useParams();
  const { user }: authcontexttype = useAuth();
  const userId: string | null = user && user["id"];

  //query & mutations
  const [createPost] = useMutation(CREATEPOST);
  const [insertTags] = useMutation(INSERTTAGS);
  const [getCommunity, { loading, data }] = useLazyQuery(GETONECOMMUNITY);
  const [getTags, { loading: tagLoading, data: tagData }] = useLazyQuery(ALLTAGS);
  const [getCommunities, { data: communitiesData }] = useLazyQuery(ALLCOMMUNITIESNAME);

  //reducer
  function handleNewPostState(state: newpoststatetype, action: newpostactiontype): newpoststatetype {
    switch (action.type) {
      case "ADD_IMAGES":
        return { ...state, postImages: action.images };

      case "DEL_IMAGE":
        return {
          ...state,
          postImages: state.postImages?.filter(
            (image: postimagetype, idx: number) => idx !== action.imgIdx
          )
        };

      case "ADD_TAG":
        return { ...state, postTags: [...state.postTags, action.tagId] };

      case "DEL_TAG":
        return {
          ...state,
          postTags: state.postTags.filter(
            (tag: number) => tag !== action.tagId
          )
        };

      case "ADD_POLLS":
        return { ...state, postPolls: action.polls };

      case "DEL_POLL":
        return {
          ...state, postPolls: state.postPolls?.filter(
            (poll: postpolltype, idx: number) => idx !== action.pollIdx
          )
        }

      case "SET_ERROR":
        return { ...state, error: action.error };

      case "SET_PROGRESS":
        return { ...state, uploadProgress: action.payload };

      case "SET_COMMUNITY":
        return { ...state, selectedCommunity: action.payload };

      case "SET_POSTDATA_FIELD":
        return {
          ...state,
          postData: {
            ...state.postData,
            [action.field]: action.value
          },
        };

      case "RESET":
        return {
          ...newPostInitState,
          selectedCommunity: state?.selectedCommunity,
          postData: {
            ...newPostInitState.postData,
            type: state.postData.type,
            community_id: state.postData.community_id
          },
        };

      default:
        return state;
    }
  }

  const [newPostState, dispatch] = useReducer(handleNewPostState, newPostInitState);

  //constants
  const communityDropperprofile: profiletype = {
    state: "INPUT",
    icn: "people_outline",
    title: "select community",
    placeholder: "Search community",
  };

  const communityDroppersearch: droppertype[] = communitiesData?.listCommunities?.map((
    community: communitynametypes) => ({
      state: "CLICKED",
      title: `c/${community.name}`,
      img: community.profile_pic || defaultCommunityPic,
      event: () => dispatch({
        type: "SET_COMMUNITY",
        payload: community.name
      }),
    }
  )) || [];

  const communityDroppers: droppertype[] = [
    { title: "COMMUNITIES", text: true }, ...communityDroppersearch
  ];

  //handlers 
  const handleposttype: (typeofpost: POSTTYPE) => void = (typeofpost: POSTTYPE) => {
    document.querySelector(`.tab${newPostState?.postData?.type.toLowerCase()}`)?.classList?.remove("active");
    dispatch({ type: "SET_POSTDATA_FIELD", field: "type", value: typeofpost });
    document.querySelector(`.tab${typeofpost.toLowerCase()}`)?.classList?.add("active");
  }

  const handleTags: (e: any, tagId: number) => void = (e: any, tagId: number) => {
    e.currentTarget.classList.toggle("active");

    if (newPostState.postTags.includes(tagId)) {
      dispatch({ type: "DEL_TAG", tagId });
    } else {
      dispatch({ type: "ADD_TAG", tagId });
    }
  }

  const handleChangepostdata: (e: any) => void = (e: any) => {
    dispatch({ type: "SET_POSTDATA_FIELD", field: e.target.name, value: e.target.value });
  }

  const handleSubmit: (e: any) => Promise<void> = async (e: any) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    let content: string = "";
    try {
      const id: string = uuid();
      if (newPostState?.postData.type === "IMAGE") {
        const urlImages = newPostState?.postImages.map((data: postimagetype) => ({
          name: data?.postSrc.name,
          type: data?.postSrc.type,
        }));

        const signedUrls: signedurltype[] = await getSignedUrls({
          userId: userId!,
          postId: id,
          req: "PUT",
          files: urlImages,
        });

        const uploadPromises = newPostState.postImages.map((img: postimagetype, idx: number) => {
          uploadToS3({
            url: signedUrls[idx].signedUrl,
            file: img.postSrc,
            progress: (progress) => {
              dispatch({ type: "SET_PROGRESS", payload: Math.round(progress) });
            }
          });

          return {
            postSrc: signedUrls[idx].fileUrl,
            postCaption: img.postCaption,
            postLink: img.postLink
          }
        });

        content = JSON.stringify(uploadPromises);
      } else if (newPostState?.postData.type === "POLL") {
        content = JSON.stringify(newPostState?.postTags)
      } else {
        content = newPostState?.postData?.content
      }

      const newPostData = {
        ...newPostState?.postData,
        id,
        content,
        owner: userId,
      }

      await createPost({
        variables: {
          data: newPostData
        },
        onCompleted: ({ insertPost }: { insertPost: { id: string } }) => {
          if (insertPost && newPostState?.postTags.length > 0) {
            insertTags({
              variables: {
                data: newPostState?.postTags.map((tag: number) => (
                  {
                    "tag_id": tag,
                    "post_id": insertPost.id
                  }
                ))
              }
            });
          }

          // if (newPostState?.uploadProgress === 100) {
          // navigate(`/post/${upsertPost?.id}`);
          // }
        }
      });
    } catch (err) {
      dispatch({ type: "RESET" });
      dispatch({
        type: "SET_ERROR",
        error: { status: 500, show: true, message: "Post Creation failed: Something went wrong" },
      });
    }
  }

  useEffect(() => {
    if (cname) {
      dispatch({ type: "SET_COMMUNITY", payload: cname });
    } else {
      dispatch({ type: "SET_COMMUNITY", payload: "" });
    }
  }, [cname])

  useEffect(() => {
    if (newPostState?.selectedCommunity.length > 1) {
      getCommunity({
        variables: {
          communityname: newPostState?.selectedCommunity,
        },
        onCompleted: ({ community }: { community: communitytype }) => {
          if (community) {
            dispatch({
              type: "SET_POSTDATA_FIELD",
              field: "community_id",
              value: Number(community.id),
            })
          }
        }
      });
    } else {
      dispatch({ type: "SET_COMMUNITY", payload: "" });
    }
  }, [newPostState?.selectedCommunity]);

  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [newPostState?.postData.type])

  useEffect(() => {
    if (!user) {
      navigate("/c/popular");
      return;
    };

    getTags();
    getCommunities({
      variables: {
        filter: {
          "privacy": "PUBLIC",
          "status": "ACTIVE"
        }
      }
    });

    handleposttype("BLOG");
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
          </div>
          <div className="createnewpost">
            <div className="typeofpost">
              {postgenres.map((genre: genretype, idx: number) => (
                <Htab
                  key={idx}
                  tabicn={genre.tabicn}
                  tabname={genre.tabname.toLowerCase()}
                  handleClick={() => handleposttype(genre.tabname)}
                />
              ))}
            </div>
            <form className="newpost" onSubmit={handleSubmit}>
              <div className="createposttile">
                <Askinput
                  type={"text"}
                  name={"title"}
                  required={true}
                  maxlength={100}
                  placeholder={"Heading"}
                  value={newPostState?.postData?.title}
                  onChange={handleChangepostdata}
                />
              </div>
              <div className="tags">
                {!tagLoading && (
                  tagData?.listTags?.map((tag: posttagtype, idx: number) => (
                    <Tag
                      key={idx}
                      info={tag}
                      handleClick={handleTags}
                    />
                  ))
                )}
              </div>
              {newPostState?.postData.type === "BLOG" ? (
                <textarea
                  name="content"
                  id="postcontent"
                  placeholder="Text(optional)"
                  onChange={handleChangepostdata}
                ></textarea>
              ) : newPostState?.postData.type === "IMAGE" ? (
                <>
                  {newPostState?.uploadProgress !== 0 && (
                    <div className="progress">
                      <div className="determinate" style={{ width: newPostState?.uploadProgress }}></div>
                    </div>
                  )}
                  <Typepostimage
                    images={newPostState?.postImages}
                    setImages={dispatch}
                  />
                </>
              ) : newPostState?.postData.type === "LINK" ? (
                <textarea
                  id="url"
                  required
                  name="content"
                  placeholder="Url"
                  onChange={handleChangepostdata}
                ></textarea>
              ) : newPostState?.postData.type === "POLL" && (
                <Typepostpoll
                  polls={newPostState?.postPolls}
                  setPolls={dispatch}
                />
              )}
              <div className="postbtnwrapper">
                <Patbtn
                  type="submit"
                  text={"post"}
                  state="active"
                  disabled={newPostState?.postData.title.length < 3}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="flexcontainerR">
        {newPostState?.selectedCommunity.length > 1 && (
          data && (
            !loading ? (
              <>
                <Infocreatecard
                  data={{ ...data?.community, inCommunity: false }}
                />
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
              active={false}
            />
          ))}
        </div>
      </div>
      <Errorcard message={newPostState?.error} />
    </div>
  );
};

export default Newpost;