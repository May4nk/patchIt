import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../utils/hooks/useAuth";

//component
import Patbtn from "../html/Patbtn";
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
import { ERRORTYPE, USER_S_N_TYPE, VOIDFUNC } from "../../utils/main/types";
import {
  categorytype,
  communities,
  createCommunityprops,
  createcommunitydatatype,
} from "./types";

const CreateCommunity = (createCommunityprops: createCommunityprops) => {
  const { showCreateCommunity, setShowCreateCommunity } = createCommunityprops;
  const show: string = showCreateCommunity ? "display" : "none";

  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const userId: USER_S_N_TYPE = user && user["id"];

  //states  
  const [checkError, setCheckError] = useState<ERRORTYPE>({ status: 0, message: "", show: false });
  const [createCommunityData, setCreateCommunityData] = useState<createcommunitydatatype>({
    about: "",
    name: "",
    owner: userId!,
    category: null,
    display_name: "",
    privacy: "PUBLIC",
  });

  //mutation
  const [createCommunity] = useMutation(CREATECOMMUNITY);
  const [getCommunitiesNames, { data }] = useLazyQuery(COMMUNITIESNAME);
  const [upsertCommunityPreference] = useMutation(UPSERTCOMMUNITYPREFERENCE);
  const [getCategories, { data: categoryData, loading: categoryLoading }] = useLazyQuery(GETCATEGORIES);

  //handler
  const handleChange: VOIDFUNC = (e: any) => {
    setCreateCommunityData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
    if (createCommunityData.name.length > 3) {
      let checkcommunityname = data?.listCommunities?.filter(
        (community: communities) => (
          community?.name === createCommunityData.name.toLowerCase().split(" ").join("")
        )
      )

      if (checkcommunityname?.length >= 1) {
        setCheckError({
          status: 500,
          show: true,
          message: `Community already exist with this name, please choose another name.`,
        })
      } else {
        setCheckError({ status: 0, message: "", show: false });
      }
    } else {
      setCheckError({ status: 500, message: "Community name should be 4-17 letters", show: true });
    }
  }

  const handleDefault: () => void = () => {
    setCreateCommunityData({
      name: "",
      about: "",
      owner: userId!,
      category: null,
      display_name: "",
      privacy: "PUBLIC",
    });
  }

  const handleClose: () => void = () => {
    handleDefault();
    setShowCreateCommunity(false);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (createCommunityData.name.length < 0) {
      setCheckError({
        status: 500,
        show: true,
        message: "name is required!!!"
      });

      return;
    }

    if (createCommunityData.about.length < 0) {
      setCheckError({
        status: 500,
        show: true,
        message: "about is required!!!"
      });

      return;
    }

    try {
      await createCommunity({
        variables: {
          data: {
            ...createCommunityData,
            name: createCommunityData?.name.toLowerCase().split(" ").join("")
          }
        },
        onCompleted: async ({ upsertCommunity }: { upsertCommunity: communities }) => {
          if (upsertCommunity) {
            await upsertCommunityPreference({
              variables: {
                data: {
                  community_name: upsertCommunity.name,
                  handlers: JSON.stringify([userId])
                }
              }
            })

            handleDefault();
            setShowCreateCommunity(false);
            navigate(`c/${upsertCommunity.name}`);
          }
        },
      })
    } catch (err) {
      setCheckError({ status: 500, message: "Something went wrong: Community failed to create.", show: true });
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

  useEffect(() => {
    if (checkError.show) {
      setTimeout(() => {
        setCheckError({
          status: 0,
          message: "",
          show: false
        })
      }, 3000);
    }
  }, [checkError.show])

  return (
    <div className={show}>
      <div className="overlay">
        <form className="communityform" onSubmit={handleSubmit}>
          <div className="communityformtitle">
            <div className="formtitle blue-text"> Create Community </div>
            <i className="material-icons closeicn" onClick={handleClose}> close </i>
          </div>
          <div className={`checkerror ${checkError.show ? "showerror" : ""} red lighten-2`}>
            <i className="material-icons checkerroricn">error_outline</i>
            {checkError.message}
          </div>
          <div className="communityformname"> name </div>
          <div className="createcommunityusername">
            <Askinput
              name={"display_name"}
              maxlength={21}
              required={true}
              onChange={handleChange}
              placeholder={"display name"}
              value={createCommunityData.display_name}
            />
          </div>
          <div className="createcommunityusername">
            <Askinput
              name={"name"}
              maxlength={17}
              required={true}
              prefixes={["c/"]}
              onBlur={handleFocus}
              onChange={handleChange}
              placeholder={"communityname *"}
              value={createCommunityData.name}
            />
          </div>
          <div className="nameinfo">
            <i className="material-icons nameinfoicn">info_outline</i>
            No spaces allowed in community name
          </div>
          <div className="communityformname"> describe * </div>
          <div className="createcommunitydesc">
            <Askinput
              maxlength={89}
              name={"about"}
              required={true}
              onChange={handleChange}
              value={createCommunityData.about}
              placeholder={"Describe your community in one line."}
            />
          </div>
          <div className="createcommunitycategory">
            <Patdrop profile={createCommunityProfile} droppers={createCommunityDroppers} />
          </div>
          <div className="nameinfo">
            <i className="material-icons nameinfoicn">info_outline</i>
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
                checked={true}
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
          <div className="createcommunitybtnwrapper">
            <Patbtn
              type={"submit"}
              text={"create"}
              state={"active"}
              disabled={(createCommunityData?.name.length < 4 || createCommunityData?.about.length < 1)}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCommunity;
