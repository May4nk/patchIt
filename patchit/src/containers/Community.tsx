import React, { useState, useEffect, useReducer } from "react";
import { useQuery } from "@apollo/client";
import { useAuth } from "../utils/hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";

//utils
import { getSignedUrls } from "../utils/services/s3";
import { communityInitState, handleCommunityState } from "../utils/opx/communityopx";

//components
import Modal from "../components/Modal";
import Post from "../components/post/Post";
import Sortpanel from "../components/Sortpanel";
import Loadingpage from "../components/Loadingpage";
import Patpicer from "../components/html/Patpicer";
import Errorcard from "../components/cards/Errorcard";
import Zeropostcard from "../components/cards/Zeropostcard";
import Infoabout from "../components/infosection/Infoabout";
import Infosocial from "../components/infosection/Infosocial";
import Infodescription from "../components/infosection/Infodescription";

//queries
import { GETCOMMUNITY } from "./queries/community";

//css & types
import "./css/main.css";
import "./css/community.css";
import { communitydatatype } from "./types/main";
import { authcontexttype } from "../context/types";
import { defaultCommunityPic } from "../constants/const";
import { posttype, USER_S_N_TYPE } from "../utils/main/types";
import { signedfiletype, signedurltype } from "../utils/types";
import { communityusertype, infoaboutcommunitydatatype } from "../components/infosection/types";
const nsfwlogo: string = require(`../img/nsfwlogo.png`);

const Community = () => {
  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const { cname } = useParams<Record<string, string>>();
  const userId: USER_S_N_TYPE = user && user["id"];

  //states
  const [sortby, setSortby] = useState<string>("likes");
  const [showPic, setShowPic] = useState<boolean>(false);
  const [communityState, dispatch] = useReducer(handleCommunityState, communityInitState)

  //queries
  const { data, loading, error } = useQuery(GETCOMMUNITY, {
    variables: {
      "communityname": cname!
    }
  });

  //handlers
  const communityData: communitydatatype = !loading && data?.community;

  const handleShowPic: (e) => void = (e) => {
    dispatch({ type: "SET_PIC", pic: [communityState?.display_profile_pic || defaultCommunityPic] });
    setShowPic(true);
  }

  const infoAboutCommunity: infoaboutcommunitydatatype = {
    ...communityData,
    background_pic: communityState.display_background_pic,
    inCommunity: communityState.inCommunity,
    updateCommunitySettings: dispatch
  }

  useEffect(() => {
    if (!loading && data) {
      const community: communitydatatype = data?.community;
      const profile_pic: USER_S_N_TYPE = community.profile_pic;
      const background_pic: USER_S_N_TYPE = community?.background_pic;

      if (profile_pic || background_pic) {
        const images: signedfiletype[] = []
        if (background_pic !== null) {
          images.push({ name: background_pic })
        }

        if (profile_pic !== null) {
          images.push({ name: profile_pic })
        }

        if (images.length > 0) {
          (async function () {
            const signedUrls: signedurltype[] = await getSignedUrls({
              userId: community.owner.id,
              postId: "0",
              req: "GET",
              files: images
            });

            signedUrls.map((url: signedurltype) => (
              url.fileUrl.includes(`${cname}_profile_pic`)
                ? dispatch({ type: "UPDATE_PIC", profile_pic: url.signedUrl })
                : dispatch({ type: "UPDATE_BG_PIC", background_pic: url.signedUrl })
            ))
          }());
        }
      }

      if (userId) {
        const communityUsers = community?.users.filter((usr: communityusertype) => (
          usr.user_id.id === userId
        ));

        if (communityUsers?.length > 0) {
          dispatch({ type: "UPDATE_IN_COMMUNITY", inCommunity: true });
        }
      }

      dispatch({
        type: "UPDATE_COMMUNITY_SETTINGS", settings: {
          nsfw: community?.settings?.nsfw,
          allowppltofollow: community?.settings?.allowppltofollow
        }
      });
    }
  }, [data, loading, userId, cname]);

  if (loading) {
    return (<Loadingpage />)
  } else if (error) {
    return (<Loadingpage err={"Unable to load community..."} />)
  } else {
    return (
      <div className="flexy">
        {communityState?.settings.nsfw && (
          <Modal
            head="NSFW content"
            headlogo={nsfwlogo}
            btntxt={"proceed"}
            showModal={communityState?.settings.nsfw}
            handleClose={() => navigate(-1)}
            txt={"Are you sure you want to proceed?"}
            handleUpdate={() => dispatch({
              type: "UPDATE_COMMUNITY_SETTINGS",
              settings: { nsfw: false }
            })}
          />
        )}
        <div className="patchcontent">
          <div className="profileabout">
            <div className="profileintersection">
              <div className="profilepicwrapper">
                <img
                  className="profilepic"
                  alt={"community_profilepic"}
                  onClick={handleShowPic}
                  src={communityState?.display_profile_pic || defaultCommunityPic}
                />
              </div>
              <div className="profilename">
                <div className="name">{communityData?.display_name || communityData?.name}</div>
                <div className="channelname"> {`c/${communityData?.name}`} </div>
              </div>
            </div>
          </div>
          {!loading ? (
            communityData?.posts.length !== 0 ? (
              <>
                <div className="postsort">
                  <Sortpanel sort={sortby} setSort={setSortby} />
                </div>
                {communityData?.posts.map((post: posttype, idx: number) => (
                  <Post postData={post} key={idx} showcommunity={false} />
                ))}
              </>
            ) : (
              <Zeropostcard title={"No post has been submited in this community yet."} />
            )
          ) : (
            <Loadingpage />
          )}
        </div>
        <div className="contentinfo">
          {!loading ? (
            <>
              <Infoabout
                userdata={false}
                data={infoAboutCommunity}
              />

              {communityData?.description && (
                <Infodescription
                  info={communityData?.description}
                  theme={communityData.theme}
                />
              )}

              {communityData?.social_links && (
                <Infosocial
                  socialData={JSON.parse(communityData?.social_links)}
                />
              )}
            </>
          ) : (
            <Loadingpage />
          )}
        </div>
        <Patpicer
          showPic={showPic}
          setShowPic={setShowPic}
          pics={communityState?.pic}
        />
        {communityState?.error.message.length > 0 && (
          <Errorcard message={communityState?.error} />
        )}
      </div>
    );
  }
}


export default Community;