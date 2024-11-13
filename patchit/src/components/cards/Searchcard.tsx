import React from 'react';
import { Link } from 'react-router-dom';

import { defaultCPic, defaultUPic } from '../../utils/helpers';

//css, constants & types
import { searchcardpropstype } from '../../containers/Search/types';

function Searchcard(searchcardprops: searchcardpropstype) {
  const { usertype, user, community } = searchcardprops;

  return (
    <Link to={usertype ? `/u/${user?.username}` : `/c/${community?.communityname}`} className="searchbycard">
      <div className="searchbycardpicwrapper">
        <img
          alt={"search_card_profile_pic"}
          className="searchbycardpic"
          src={usertype ? user?.profile_pic : community?.profile_pic}
          onError={usertype ? () => defaultUPic : () => defaultCPic}
        />
      </div>
      <div className="searchbycardcontent">
        <div className="searchbycardcontentheader">
          {usertype ? user?.username : `c/${community?.communityname}`}
        </div>
        <div className="searchbycardcontentabout">
          {usertype
            ? `${user?.posts?.length} post . 1 patcoin`
            : `${community?.posts.length} post. ${community?.users?.length} member`
          }
        </div>
        {usertype ?
          user?.about && (
            <div className="searchbycardcontentinfo">
              {user?.about}
            </div>
          ) :
          community?.about && (
            <div className="searchbycardcontentinfo">
              {community?.about}
            </div>
          )
        }

      </div>
    </Link>
  )
}

export default Searchcard;
