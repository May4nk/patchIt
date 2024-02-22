import React, { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { useAuth } from "../../common/hooks/useAuth";

//queries
import { 
  GETPOSTS,
  GETUSERS,
  GETCOMMUNITIES,
  GETCHATS,
  GETROLES,
  GETCATEGORIES
} from "../queries";

//components
import Suqueryform from "./Suqueryform";
import Supost from "../components/Supost";
import Suuser from "../components/Suuser";
import Sucommunity from "../components/Sucommunity";
import Createprofiles from "../components/Createprofiles";
import Suprofileoverviewtabs from "../components/Suprofileoverviewtabs";
import Loadingpage from "../../components/Loadingpage";

//css
import "./css/superadminprofile.css";
import { allTabs } from "../../constants/const";
import { 
  chatroomtype,
  communitytype,
  ordertype,
  posttype,
  roletype,
  usertype,
  wheretype,
  categorytype
} from "../types";
import { authcontexttype } from "../../context/types";


const Superadminprofile = () => { 
  const navigate = useNavigate();
  const { user }: authcontexttype = useAuth();
  const userRole: number|null = user && (user["role"] ? user["role"]?.id : user["role_id"]);
    
  //states
  const [triggeredTab, setTriggeredTab] = useState("users");  
  const [where, setWhere] = useState<wheretype[]>([]);
  const [limitState, setLimitState] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(0);
  const [orderState, setOrderState] = useState<boolean>(false);
  const [orderby, setOrderBy] = useState<ordertype[]>([]);
  const [showSucreateprofile, setShowsucreateprofile] = useState(false);
  const [updateUsernameCreateprofile, setUpdateusernamecreateprofile] = useState("");

  //queries
  const [getUsers, { data: usersData, loading: usersLoading }] = useLazyQuery(GETUSERS);
  const [getPosts, { data: postsData, loading: postsLoading }] = useLazyQuery(GETPOSTS);
  const [getChats, { data: chatsData, loading: chatsLoading }] = useLazyQuery(GETCHATS);
  const [getRoles, { data: rolesData, loading: rolesLoading }] = useLazyQuery(GETROLES);
  const [getCategories, { data: categoriesData, loading: categoriesLoading }] = useLazyQuery(GETCATEGORIES);
  const [getCommunities, { data: communitiesData, loading: communitiesLoading }] = useLazyQuery(GETCOMMUNITIES);  

  const handleSubmit: (e: any) => void = (e: any) => {
    e.preventDefault();
    let filter = {};
    if(where.length > 0) {
      filter = where.reduce((obj: any, item: wheretype) => Object.assign(obj, { [item.column]: item.value }), {});
    } 
    if(triggeredTab === "posts") {
      getPosts({
        variables: {
          ...(where.length > 0 && { filter: filter }),
          ...(limitState && { limit: limit }),
          ...(orderState && {sort: [...orderby]}),
        }
      });
    } else if(triggeredTab === "users") {
      getUsers({
        variables: {
          ...(where.length > 0 && { filter: filter }),
          ...(limitState && { limit: limit }),
          ...(orderState && {sort: [...orderby]}),
        }
      });
    } else if(triggeredTab === "communities") {
      getCommunities({
        variables: {
          ...(where.length > 0 && { filter: filter }),
          ...(limitState && { limit: limit }),
          ...(orderState && {sort: [...orderby]}),
        }
      });
    } else if(triggeredTab === "chats") {
      getChats({
        variables: {
          ...(where.length > 0 && { filter: filter }),
          ...(limitState && { limit: limit }),
          ...(orderState && {sort: [...orderby]}),
        }
      });
    } else if(triggeredTab === "roles") {
      getRoles({
        variables: {
          ...(where.length > 0 && { filter: filter }),
          ...(limitState && { limit: limit }),
          ...(orderState && {sort: [...orderby]}),
        }
      });
    } else if(triggeredTab === "categories") {
      getCategories({
        variables: {
          ...(where.length > 0 && { filter: filter }),
          ...(limitState && { limit: limit }),
          ...(orderState && {sort: [...orderby]}),
        }
      });
    }
  }
  
  //handlers
  const handleSutabs = (sutabs: string) => {
    document.getElementById(`pat${triggeredTab}`)?.classList?.remove("triggered");
    setTriggeredTab(sutabs);
    document.getElementById(`pat${sutabs}`)?.classList?.add("triggered");
  }

  const handleShowsucreateprofile = () => {
    setShowsucreateprofile(true);
  }
  
  useEffect(() => {
    if(user && userRole === 0){
      handleSutabs("users");     
    } else {
      navigate("/account/login");   
    }
  },[])

  return (
    <>
      <div className="suprofileoverview">
        { allTabs.map((tab: string, idx: number) => (
          <Suprofileoverviewtabs tabname={ tab } handleClick={ handleSutabs } key={ idx } />
        ))}
      </div>
      <div className="sucontent">
        <div className="createpatcherbtnwrapper">
          <div className="waves-effect waves-light createpatcherbtn" onClick={ handleShowsucreateprofile }>
            <i className="material-icons createpatcherbtnicn tiny">add</i>
            { triggeredTab }
          </div>
          <Createprofiles 
            showcreateprofile={ showSucreateprofile } 
            setShowcreateprofile={ setShowsucreateprofile } 
            ttab={ triggeredTab } 
            setProfile={ setUpdateusernamecreateprofile } 
          />
        </div>
        <Suqueryform
          tablename={ triggeredTab }
          handleSubmit={ handleSubmit }          
          where={ where }
          setWhere={ setWhere }
          limitState={ limitState }
          setLimitState={ setLimitState }
          limit={ limit }
          setLimit={ setLimit }
          orderState={ orderState }
          setOrderState={ setOrderState }
          orderby={ orderby }
          setOrderBy={ setOrderBy }
        />        
        <div className="sutab"> 
          { triggeredTab === "users" ? (
            !usersLoading && (
              usersData?.listUsers.map((user: usertype, idx: number) => (
                <Suuser key={ idx } user={ user } />
              ))
            )
          ) : triggeredTab === "communities" ? (
            !communitiesLoading && (
              communitiesData?.listCommunities.map((community: communitytype, idx: number) => (
                <Sucommunity community={ community } key={ idx }/>
              ))
            )
          ) : triggeredTab === "posts" ? (            
            !postsLoading ? (
              postsData?.listPosts?.map((post: posttype, idx: number) => (
                <Supost post={ post } key={ idx }/>
              ))
            ) : (
              <Loadingpage />
            )          
          ) : triggeredTab === "chats" ? (
            !chatsLoading ? (
              chatsData?.listChatrooms.map((chatroom: chatroomtype, idx: number) => (
                <div className="suprofiles" key={ idx }>
                  <div className="actions waves-effect waves-light">
                    <i className="material-icons tiny red-text"> delete </i>
                  </div>
                  <div className="suprofilecontent">
                    <div className="suprofileusername"> { chatroom.room_code } </div>
                  </div>
                </div>
              ))
            ) : (
              <Loadingpage />
            )
          ) : triggeredTab === "categories" ? (
            !categoriesLoading ? (
              categoriesData?.listCategories.map((category: categorytype, idx: number) => (
                <div className="suprofiles" key={ idx }>
                  <div className="actions waves-effect waves-light">
                    <i className="material-icons tiny red-text"> delete </i>
                  </div>
                  <div className="suprofilecontent">
                    <div className="suprofileusername"> { category.categoryname } </div>
                  </div>
                </div>
              ))
            ) : (
              <Loadingpage />
            )
          ) : triggeredTab === "roles" && (
            !rolesLoading ? (
              rolesData?.listRoles.map((role: roletype, idx: number) => (
                <div className="suprofiles" key={ idx }>
                  <div className="actions waves-effect waves-light">
                    <i className="material-icons tiny red-text"> delete </i>
                  </div>
                  <div className="suprofilecontent">
                    <div className="suprofileusername"> { role.role } </div>
                  </div>
                </div>
              ))
            ) : (
              <Loadingpage />
            )
          )}
        </div>  
      </div>
    </>
  )
}

export default Superadminprofile;
