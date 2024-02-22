import { useState } from "react";

//components
import Askinput from "../../components/html/Askinput";

//css
import "./css/createprofile.css";

interface createprofileprops {
  showcreateprofile : boolean;
  setShowcreateprofile: any;
  ttab: string;
  setProfile?: any;
}

const Createprofiles = (createprofileprops: createprofileprops) => {
  //props
  const { showcreateprofile, setShowcreateprofile, ttab, setProfile } = createprofileprops;
  const show = showcreateprofile ? "block" : "none";
  
  const [userProfile, setUserProfile] = useState({ email: "", dob: "", username: "", status: "", password: "" });

  const statusData = [
    { label: "ACTIVE", value:"ACTIVE" },
    { label: "INACTIVE", value:"INACTIVE" }
  ]

  //handlers
  const handleClose = () => {
    setShowcreateprofile(false);
    setProfile("");
  }
  
  const handleChangesucreateprofile = (e: any) => {
    setUserProfile({
      ...userProfile,
      [e.target.name]: e.target.value
    })
  }

  return(
    <div className={ show }> 
      <div className="overlay">
        <div className="sucreateprofileform">
          <div className="sucreateprofiletitle blue-text">
             add { ttab }
            <i className="material-icons handlecloseicn" onClick={ handleClose }> close </i>
          </div>
          <div className="sucreateprofilecontent">            
            {[ ...Array(Math.ceil(Object.keys(userProfile).length/2)) ].map((d: any ,i: number) => (
              <div className="sucreateprofileinputs" key={ i }>
                { Object.keys(userProfile).slice(i+i, (i*2)+2).map((obj: any, idx: number) => (
                  <div className={ idx % 2 === 0 ? "sucreateprofilehalflinput" : "sucreateprofilehalfrinput"} key={idx}>
                    <Askinput name={"username"} placeholder={`${obj}`} maxlength={30} prefix={"u/"} onChange={ handleChangesucreateprofile } />
                  </div>
                ))}
              </div>                          
            ))}
          </div>
          <div className="sucreateprofilefooter">
            <button className="btn waves-effect waves-light lighten-blue-1 black-text sucreateprofilebtn" type="submit" >
              Add
              <i className="material-icons right tiny">send</i>
            </button>
          </div>
       </div>
      </div>
    </div>
  )
}

export default Createprofiles;
