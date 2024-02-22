import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

//components
import Askinput from "../html/Askinput"; 
import Searchdrop from "./Searchdrop";

import { COMMUNITIESNAME }  from "./queries"; //queries

import "./searchbox.css"; //css
import { communities, searchboxprops } from "./types";

const Searchbox = (searchboxprops: searchboxprops) => {
  const { showSearchbox, setShowSearchbox } = searchboxprops;

  const thisRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const [searchInput, setSearchInput] = useState<string>("");

  const [getCommunitiesNames, { data, loading }] = useLazyQuery(COMMUNITIESNAME);

  //handlers
  const handleSearchInput: (e: any) => void = (e: any) => {
    setSearchInput(e.target.value);
  }
  
  const searchCommunity: communities[] = !loading ?  data?.listCommunities?.filter((community: communities) => {
    return community.communityname.startsWith(searchInput);
  }): [];

  const suggestCommunity: communities[] = !loading ? data?.listCommunities?.filter((community: communities) => {
    return community.communityname.includes(searchInput) && !searchCommunity.includes(community);
  }): [];

  const handleSearch: (e: any) => void = (e: any)=> {
    e.preventDefault();
    setShowSearchbox(false);
    navigate(`search/${searchInput}`);
  }

  const closeDrop: (e: any) => void = (e: any) => {   
    if(thisRef.current && showSearchbox && !thisRef.current.contains(e.target)){
      setShowSearchbox(false)
    }
  }  
  document.addEventListener('mousedown', closeDrop);
  
  useEffect(() => {
    if(searchInput.length > 1) {      
      getCommunitiesNames({
        variables: {
          filter: {
            "privacy": "PUBLIC",
            "status": "ACTIVE"
          }
        }
      });
      setShowSearchbox(true);
    } else {
      setShowSearchbox(false)
    }   
  }, [searchInput]);

  return (
    <div className="searchdrop" ref={ thisRef }>   
      <form className="searchbar" onSubmit={(e: any) => handleSearch(e)}>
        <Askinput 
          placeholder={ "Search here" } 
          name={ "search" } 
          prefix={ "ICsearch" } 
          onChange={ handleSearchInput } 
        />
      </form>
      { showSearchbox && (
        <div className="searchdropcontent">
          { searchInput.length !== 0 && (
            searchCommunity.length === 0 ? (
              <>
                <Link to={`search/${searchInput}`} className="communitysearchresult waves-effect waves-light" onClick={(e: any) => handleSearch(e)}>
                  <i className="material-icons grey-text text-darken-3"> search </i>
                  <div className="errsearchcomunityname">
                    Search for 
                  </div>
                  <div className="errsearchinput"> "{searchInput}" </div>
                </Link>      
                { data?.listCommunities.map((community: communities, idx: number) => (
                  <Searchdrop community={ community } key={ idx }/>
                ))}    
              </>
            ) : ( 
              <>
                { searchCommunity?.map((community: communities, idx: number) => (
                  <Searchdrop community={ community } key={ idx } search={ true }/>
                ))}
                { suggestCommunity?.map((community: communities, idx: number) => (
                  <Searchdrop community={ community } key={ idx } search={ true }/>
                ))}
                { data?.listCommunities.slice(0,10).map((community: communities, idx: number) => (
                  <Searchdrop community={ community } key={ idx }/>
                ))}    
              </>
            ))}
        </div>
      )}
    </div> 
  )
}

export default Searchbox;
