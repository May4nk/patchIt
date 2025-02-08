import React, { useRef, useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

//components
import Searchdrop from "./Searchdrop";
import Askinput from "../html/Askinput";

//queries
import { COMMUNITIESNAME } from "../queries/searchbox";

//css & types
import "./searchbox.css";
import { askinputprefixestype } from "../html/types";
import { communitytype, searchboxprops } from "./types";

const Searchbox = (searchboxprops: searchboxprops) => {
  const { showSearchbox, setShowSearchbox } = searchboxprops;

  const { cname } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const thisRef = useRef<HTMLDivElement>(null);

  //states
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchPrefixes, setSearchPrefixes] = useState<askinputprefixestype>(["ICsearch"]);

  //queries
  const [getCommunitiesNames, { data, loading }] = useLazyQuery(COMMUNITIESNAME);

  //handlers
  const searchCommunity: communitytype[] = useMemo(() => {
    if (searchPrefixes.length === 1 && !loading) {
      return data?.listCommunities?.filter((community: communitytype) => (
        community.name.startsWith(searchInput)
      ));
    }

    return [];
  }, [searchPrefixes, searchInput, data, loading]);

  const suggestCommunity: communitytype[] = useMemo(() => {
    if (!loading && searchPrefixes.length === 1) {
      return data?.listCommunities?.filter((community: communitytype) => (
        (community?.name?.includes(searchInput) && !searchCommunity.includes(community))
      ))
    }
  }, [searchInput, data, loading, searchCommunity]);

  const handleSearch: (e: any) => void = (e: any) => {
    e.preventDefault();
    setShowSearchbox(false);
    navigate(searchPrefixes.length === 1 ? `/search/${searchInput}` : `/c/${cname}/search/${searchInput}`);
  }

  const closeDrop: (e: any) => void = (e: any) => {
    if (thisRef.current && showSearchbox && !thisRef.current.contains(e.target)) {
      setShowSearchbox(false);
    }
  }

  document.addEventListener('mousedown', closeDrop);

  useEffect(() => {
    if (searchInput.length > 1) {
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

  useEffect(() => {
    if (location.pathname.includes("/c/")
      && !location.pathname.includes(`/c/${cname}/settings`)
      && !location.pathname.includes("/c/popular")
    ) {
      setSearchPrefixes(prev => [prev[0], `TAB${cname}`]);
    } else {
      setSearchPrefixes(["ICsearch"]);
    }
  }, [location.pathname]);

  return (
    <div className="searchdrop" ref={thisRef}>
      <form className="searchbar" onSubmit={handleSearch}>
        <Askinput
          name={"search"}
          prefixes={searchPrefixes}
          value={searchInput}
          placeholder={`Search ${searchPrefixes.length > 1 ? `in c/${cname}` : "here"}`}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </form>
      {showSearchbox && (
        <div className="searchdropcontent">
          {searchInput?.length > 0 && (
            searchCommunity?.length === 0 || searchPrefixes.length > 1 ? (
              <>
                <Link
                  onClick={(e: any) => handleSearch(e)}
                  to={searchPrefixes.length === 1 ? `/search/${searchInput}` : `/c/${cname}/search/${searchInput}`}
                  className="communitysearchresult waves-effect waves-light"
                >
                  <i className="material-icons grey-text text-darken-3 communitysearchicn"> search </i>
                  <div className="errsearchcomunityname"> Search for </div>
                  <div className="errsearchinput"> "{searchInput}" </div>
                  {searchPrefixes.length > 1 && (
                    <div className="errsearchcomunityname"> in c/{cname} </div>
                  )}
                </Link>
                {searchPrefixes.length === 1 && (
                  data?.listCommunities.map((community: communitytype, idx: number) => (
                    <Searchdrop
                      key={idx}
                      community={community}
                    />
                  ))
                )}
              </>
            ) : (
              <>
                {searchCommunity?.map((community: communitytype, idx: number) => (
                  <Searchdrop
                    key={idx}
                    search={true}
                    community={community}
                  />
                ))}
                {searchPrefixes?.length === 1 && (
                  suggestCommunity?.map((community: communitytype, idx: number) => (
                    <Searchdrop
                      key={idx}
                      search={true}
                      community={community}
                    />
                  ))
                )}
              </>
            ))}
        </div>
      )}
    </div>
  )
}

export default Searchbox;
