import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useAuth } from "../utils/hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";

//components
import Modal from "../components/Modal";
import Post from "../components/post/Post";
import Sortpanel from "../components/Sortpanel";
import Loadingpage from "../components/Loadingpage";
import Patpicer from "../components/html/Patpicer";
import Zeropostcard from "../components/cards/Zeropostcard";
import Infoabout from "../components/infosection/Infoabout";
import Infosocial from "../components/infosection/Infosocial";
import Infodescription from "../components/infosection/Infodescription";

//queries
import { GETCOMMUNITY } from "./queries/community";

//css & types
import "./css/main.css";
import "./css/community.css";
import { ERRORTYPE, posttype, STATUS } from "../utils/main/types";
import { communitydatatype } from "./types/main";
import { authcontexttype } from "../context/types";
import { defaultCommunityPic } from "../constants/const";
import { communityusertype, infoaboutcommunitydatatype } from "../components/infosection/types";
import Errorcard from "../components/cards/Errorcard";
const nsfwlogo: string = require(`../img/nsfwlogo.png`);

const Community = () => {
  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const { cname } = useParams<Record<string, string>>();
  const userId: number | null = user && Number(user["id"]);

  //states
  const [pic, setPic] = useState<string>("");
  const [sortby, setSortby] = useState<string>("likes");
  const [showPic, setShowPic] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<ERRORTYPE>({ status: 0, message: "", show: false });
  const [inCommunity, setInCommunity] = useState<boolean>(false);
  const [communityStatus, setCommunityStatus] = useState<STATUS>("ACTIVE");
  const [communitySettings, setCommunitySettings] = useState<communitydatatype["settings"]>({
    nsfw: false,
    allowppltofollow: true
  });

  //queries
  const [getCommunity, { data, loading, error }] = useLazyQuery(GETCOMMUNITY);

  //handlers
  const communityData: communitydatatype = !loading && data?.community;
  const handleShowPic: (e) => void = (e) => {
    setPic(communityData?.profile_pic || defaultCommunityPic);
    setShowPic(true);
  }

  const infoAboutCommunity: infoaboutcommunitydatatype = {
    ...communityData,
    inCommunity,
    setInCommunity
  }

  useEffect(() => {
    if (cname) {
      getCommunity({
        variables: {
          "communityname": cname!
        },
        onCompleted: ({ community }: { community: communitydatatype }) => {
          if (community) {
            if (community.status === "INACTIVE") {
              setCommunityStatus("INACTIVE");
            }

            if (user) {
              const communityUsers = community?.users.filter((usr: communityusertype) => (
                usr.user_id.id === userId
              ));

              if (communityUsers?.length > 0) {
                setInCommunity(true);
              }
            }

            setCommunitySettings({
              nsfw: community?.settings?.nsfw,
              allowppltofollow: community?.settings?.allowppltofollow
            })
          }
        }
      });
    }
  }, [cname]);

  if (communityStatus !== "ACTIVE") {
    return (
      <Loadingpage
        msg={"Seems Like Community not ACTIVE anymore..."}
        onErrorMsg={"Redirecting..."}
      />
    )
  } else if (loading) {
    return (<Loadingpage />)
  } else if (error) {
    return (<Loadingpage err={error.message} />)
  } else {
    return (
      <div className="flexy">
        {communitySettings.nsfw && (
          <Modal
            head="NSFW content"
            headlogo={nsfwlogo}
            btntxt={"proceed"}
            showModal={communitySettings.nsfw}
            handleClose={() => navigate(-1)}
            txt={"Are you sure you want to proceed?"}
            handleUpdate={() => setCommunitySettings((prev) => ({ ...prev, nsfw: false }))}
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
                  src={communityData?.profile_pic || defaultCommunityPic}
                />
              </div>
              <div className="profilename">
                <div className="name">{communityData?.communityname}</div>
                <div className="channelname"> {`c/${communityData?.communityname}`} </div>
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
                setError={setErrorMessage}
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
          pics={[pic]}
        />

        <Errorcard message={errorMessage} />
      </div>
    );
  }
}

export default Community;