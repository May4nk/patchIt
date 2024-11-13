import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../utils/hooks/useAuth";

//component
import Askinput from "../html/Askinput";
import Patradio from "../html/Patradio";
import Patdrop from "../html/patdrop/Patdrop";

//query&mutations
import { COMMUNITIESNAME, CREATECOMMUNITY, GETCATEGORIES } from "./queries";
import { UPSERTCOMMUNITYPREFERENCE } from "../../containers/communitySettings/queries";

//css && types
import "./css/createcommunity.css";
import { authcontexttype } from "../../context/types";
import { droppertype, profiletype } from "../html/patdrop/types";
import {
  categorytype,
  communities,
  createCommunityprops,
  createcommunitydatatype,
  upsertcommunitytype
} from "./types";

const CreateCommunity = (createCommunityprops: createCommunityprops) => {
  const { showCreateCommunity, setShowCreateCommunity } = createCommunityprops;

  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const show: string = showCreateCommunity ? "display" : "none";
  const userId: number | null = user && Number(user["id"]);

  //states
  const [checkError, setCheckError] = useState<string>("");
  const [createCommunityData, setCreateCommunityData] = useState<createcommunitydatatype>({
    about: "",
    owner: userId!,
    category: null,
    privacy: "PUBLIC",
    communityname: "",
  });

  //mutation
  const [createCommunity] = useMutation(CREATECOMMUNITY);
  const [getCommunitiesNames, { data }] = useLazyQuery(COMMUNITIESNAME);
  const [upsertCommunityPreference] = useMutation(UPSERTCOMMUNITYPREFERENCE);
  const [getCategories, { data: categoryData, loading: categoryLoading }] = useLazyQuery(GETCATEGORIES);

  //handler
  const handleChange: (e: any) => void = (e: any) => {
    setCreateCommunityData({
      ...createCommunityData,
      [e.target.name]: e.target.value,
    });
  }

  const createCommunityProfile: profiletype = {
    icn: "color_lens",
    title: "Category",
  }

  const createCommunityDroppers: droppertype[] = [
    ...(showCreateCommunity && !categoryLoading && categoryData)
      ? categoryData?.listCategories.map((category: categorytype) => (
        {
          icn: category?.categoryicon,
          title: category?.categoryname,
          state: "CLICKED",
          event: () => setCreateCommunityData({ ...createCommunityData, category: category?.categoryname })
        }
      )) : []
  ];

  const handleFocus: () => void = () => {
    if (createCommunityData.communityname.length > 3) {
      let checkcommunityname = data?.listCommunities?.filter(
        (community: communities) => (
          community?.communityname === createCommunityData.communityname.toLowerCase().split(" ").join("")
        )
      )

      if (checkcommunityname?.length >= 1) {
        setCheckError(`Community with name "${checkcommunityname[0].communityname}" already exist, please choose another name.`)
      } else {
        setCheckError("");
      }
    } else {
      setCheckError("Community name should be 4-17 letters")
    }
  }

  const handleDefault: () => void = () => {
    setCreateCommunityData({
      about: "",
      owner: userId!,
      category: null,
      communityname: "",
      privacy: "PUBLIC",
    });
  }

  const handleClose: () => void = () => {
    handleDefault();
    setShowCreateCommunity(false);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (checkError.length > 0) {
      return;
    }

    try {
      await createCommunity({
        variables: {
          data: {
            ...createCommunityData,
            communityname: createCommunityData?.communityname.toLowerCase().split(" ").join("")
          }
        },
        onCompleted: async ({ upsertCommunity }: { upsertCommunity: upsertcommunitytype }) => {
          if (upsertCommunity) {
            await upsertCommunityPreference({
              variables: {
                data: {
                  community_name: upsertCommunity.communityname,
                  handlers: JSON.stringify([userId])
                }
              }
            })

            handleDefault();
            setShowCreateCommunity(false);
            navigate(`c/${upsertCommunity.communityname}`);
          }
        },
      })
    } catch (err) {
      setCheckError("Something went wrong: Community failed to create.");
    }
  }

  useEffect(() => {
    if (showCreateCommunity) {
      getCommunitiesNames({
        variables: {
          filter: {
            "status": "ACTIVE"
          }
        }
      });
      getCategories();
    }
  }, [showCreateCommunity]);

  return (
    <div className={show}>
      <div className="overlay">
        <form className="communityform" onSubmit={handleSubmit}>
          <div className="communityformtitle">
            <div className="formtitle blue-text"> Create Community </div>
            <i className="material-icons white-text closeicn" onClick={handleClose}> close </i>
          </div>
          <div className={`checkerror ${checkError.length > 0 ? "showerror" : ""} red lighten-2`}>
            <i className="material-icons checkerroricn">error_outline</i>
            {checkError}
          </div>
          <div className="communityformname">
            <div className="formname"> Name </div>
          </div>
          <div className="createcommunityusername">
            <Askinput
              maxlength={17}
              required={true}
              prefixes={["c/"]}
              onBlur={handleFocus}
              name={"communityname"}
              onChange={handleChange}
              placeholder={"communityname"}
              value={createCommunityData.communityname}
            />
          </div>
          <div className="createcommunitydesc">
            <Askinput
              maxlength={89}
              name={"about"}
              required={true}
              placeholder={"Describe your community in one line."}
              value={createCommunityData.about}
              onChange={handleChange}
            />
          </div>
          <div className="createcommunitycategory">
            <Patdrop profile={createCommunityProfile} droppers={createCommunityDroppers} />
          </div>
          <div className="formnameinfo">
            Choose category to make your community more visible.
          </div>
          <div className="communityformtype">
            <div className="formname"> Community Type </div>
            <div className="communitytype">
              <Patradio
                id={"public"}
                name={"privacy"}
                value={"PUBLIC"}
                title={"Public"}
                handleChange={handleChange}
                metatitle={"(Anyone can view, post, and comment in this community)"}
              />
            </div>
            <div className="communitytype">
              <Patradio
                id={"private"}
                name={"privacy"}
                value={"PRIVATE"}
                title={"Private"}
                handleChange={handleChange}
                metatitle={"(Only community members can view, post, and comment in this community)"}
              />
            </div>
          </div>
          <div className="communityformbtnwrapper">
            <button className="waves-effect waves-light communityformbtn" type="submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCommunity;
