import { Link } from "react-router-dom";

//utils
import { useAuth } from "../../utils/hooks/useAuth";

//component
import Patbtn from "../html/Patbtn";

//css & types
import "./css/infouserscommunity.css";
import { authcontexttype } from "../../context/types";
import { USER_S_N_TYPE } from "../../utils/main/types";
import { infouserscommunityprops, communitypatcherdatatype } from "./types";

const Infouserscommunity = (infouserscommunityprops: infouserscommunityprops) => {
  const { communitypatcherdata } = infouserscommunityprops;

  const { user }: authcontexttype = useAuth();
  const userId: USER_S_N_TYPE = user && user["id"];

  return (
    <div className="infousercommunitycontent">
      <div className="userscommunitytitle"> Handler of patch </div>
      <div className="userscommunitycontent">
        {communitypatcherdata.map((patchdata: communitypatcherdatatype, idx: number) => (
          <Link
            key={idx}
            to={`/c/${patchdata.name}${userId === patchdata.owner.id ? "/settings" : ""}`}
          >
            <Patbtn text={patchdata.name} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Infouserscommunity;
