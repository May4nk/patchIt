import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../common/hooks/useAuth";

//component
import Askinput from "./html/Askinput"; 
import Patdrop from "./html/patdrop/Patdrop";

//query&mutations
import { COMMUNITIESNAME, CREATECOMMUNITY, GETCATEGORIES }  from "./queries/createcommunity";
import { UPSERTCOMMUNITYPREFERENCE } from "../containers/queries/communitysetting";

//css
import "./css/createcommunity.css";
import { authcontexttype } from "../context/types";
import { droppertype, profiletype } from "./html/patdrop/types";
import { 
  categorytype,
  communities,
  createCommunityprops,
  createcommunitydatatype,
  upsertcommunitytype
} from "./types/createcommunity";

const CreateCommunity = (createCommunityprops: createCommunityprops) => {
  const { showCreateCommunity, setShowCreateCommunity } = createCommunityprops;

  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth(); 
  const show: string = showCreateCommunity ? "display" : "none";
  const userId: number|null = user && Number(user["id"] || user["user_id"]);
    
  //state
  const [createCommunityData, setCreateCommunityData] = useState<createcommunitydatatype>({
    communityname: "",
    owner: userId!,
    privacy: "",
    description: "",
    category: null
  });
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);

  //mutation
  const [createCommunity] = useMutation(CREATECOMMUNITY);
  const [upsertCommunityPreference] = useMutation(UPSERTCOMMUNITYPREFERENCE);
  const [getCommunitiesNames, { data, loading }] = useLazyQuery(COMMUNITIESNAME);
  const [getCategories, { data: categoryData, loading: categoryLoading }] = useLazyQuery(GETCATEGORIES);
  
  //handler
  const handleChange: (e: any) => void = (e: any) => {
    setCreateCommunityData({
      ...createCommunityData,
      [e.target.name]: e.target.value,
    });   
  }

  const createCommunityProfile: profiletype = {
    title: "Category",
    icn: "color_lens"
  }

  const createCommunityDroppers: droppertype[] = [ 
    ...(showCreateCommunity && !categoryLoading && categoryData) 
      ? categoryData?.listCategories.map((category: categorytype) => (
        { 
          icn: category?.categoryicon, 
          value: category?.categoryname,
          state: "clicked",
          event: () => setCreateCommunityData({ ...createCommunityData, category: category?.categoryname })
        }
      )) : []
  ];  
  
  const handleFocus: () => void = () => {
    if(createCommunityData.communityname.length > 3) {
      let checkcommunityname = !loading && data?.listCommunities?.filter((community: communities ) => (
        community?.communityname.includes(createCommunityData.communityname.toLowerCase())
      ))
          
      if(checkcommunityname?.length >= 1) {
        setError(`Community with name ${ checkcommunityname[0].communityname } already exist, please choose another name.`)
      } else {
        setError("");
      }
    } else {
      setError("Community name should be 4-17 letters")
    }
  }

  const handleDefault: () => void = () => {
    setCreateCommunityData({ 
      communityname: "",
      owner: userId!,
      privacy: "PUBLIC",
      description: "",
      category: null
    });
  }

  const handleClose: () => void = () => {
    handleDefault();
    setShowCreateCommunity(false);
  }
  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if(error.length === 0) {
      setCreateCommunityData({
        ...createCommunityData,
        communityname: createCommunityData.communityname.toLowerCase()
      });
      createCommunity({
        variables: {
          data: createCommunityData
        },
        onCompleted: ({ upsertCommunity }: { upsertCommunity: upsertcommunitytype } ) => {
          upsertCommunityPreference({
            variables: {
              data: {
                community_name: upsertCommunity.communityname
              }
            }
          })
          handleDefault();
          setShowCreateCommunity(false);
          navigate(`c/${ upsertCommunity.communityname }`);
        },
        onError: (err) => {
          setShowError(true);
        }
      })
    }
  }  

  useEffect(() => {
    if(showCreateCommunity) {
      getCommunitiesNames({
        variables: {
          filter: {       
            "status": "ACTIVE"
          }
        }
      });
      getCategories();
    }
  },[showCreateCommunity]);

  return(   
    <div className={ show }>
      <div className="overlay">
        <form className="communityform" onSubmit={ handleSubmit }>
          <div className="communityformtitle">
            <div className="formtitle blue-text"> Create Community </div>
            <i className="material-icons white-text closeicn" onClick={ handleClose }> close </i>
          </div>
          <div className="communityformname">
            <div className="formname"> Name </div>            
          </div>
          <div className="createcommunityusername">
            <Askinput 
              prefix={ "c/" } 
              maxlength={ 17 } 
              required={ true } 
              name={ "communityname" }               
              value={ createCommunityData.communityname } 
              onChange={ handleChange } 
              placeholder={ "communityname" }
              onBlur={ handleFocus }
            />
          </div>
          { error.length !==0 && (
            <div className="errortxt">
              { error }
            </div>
          )}          
          <div className="createcommunitydesc">
            <Askinput 
              maxlength={ 77 } 
              name={ "description" } 
              required={ true } 
              placeholder={ "Describe your community in one line." }
              value={ createCommunityData.description } 
              onChange={ handleChange } 
            />
          </div>
          <div className="createcommunitycategory">
            <Patdrop profile={ createCommunityProfile } droppers={ createCommunityDroppers } />
          </div>
          <div className="formnameinfo">
            Choose category to make your community more visible.
          </div>
          <div className="communityformtype">         
            <div className="formname"> Community Type </div>
            <div className="communitytype">
              <label htmlFor="public">
                <input
                  className="with-gap blue-text"
                  name="privacy"
                  value="PUBLIC"
                  onChange={ handleChange }
                  type="radio"
                  id="public"
                  required
                />
                <span className="communitytypename"> Public </span>
                <span className="formnameinfo">
                  (Anyone can view, post, and comment to this community)
                </span>
              </label>
            </div>
            <div className="communitytype">
              <label htmlFor="private">
                <input
                  className="with-gap"
                  name="privacy"
                  value="PRIVATE"
                  type="radio"
                  onChange={ handleChange }
                  id="private"
                  required
                />
                <span className="communitytypename"> Private </span>
                <span className="formnameinfo">
                  (Only community members can view, post, and comment to this community)
                </span>
              </label>
            </div>
            <div className="communitytype">
              <label htmlFor="restricted">
                <input
                  className="with-gap blue"
                  name="privacy"
                  value="restricted"
                  type="radio"
                  onChange={ handleChange }
                  id="restricted"
                  required
                />
                <span className="communitytypename"> Restricted </span>
                <span className="formnameinfo">
                  (Anyone can view but only members can post to this community)
                </span>
              </label>
            </div>
          </div>
          <div className="communityformbtnwrapper">
            <button className="waves-effect waves-light communityformbtn" type="submit" disabled={ error.length === 0 ? false : true }>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCommunity;
