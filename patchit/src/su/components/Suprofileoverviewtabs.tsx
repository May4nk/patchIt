import "./css/suprofileoverviewtabs.css";

const Suprofileoverviewtabs = ({ tabname, handleClick }: { tabname: string, handleClick: any }) => {
  return (
    <div className="suprofileoverviewtabs" id={`pat${tabname}`} onClick={() => handleClick(tabname) }> 
     <div className="suprofileoverviewtabname"> { tabname } </div>
    </div>
  )
}

export default Suprofileoverviewtabs;
