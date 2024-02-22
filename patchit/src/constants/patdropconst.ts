import { droppertype, profiletype } from "../components/html/patdrop/types";

export const sortprofile: profiletype = { title: "Sort", icn: "sort" };

// navbar ------------------------------------------------
export const navigationDropperprofile: profiletype = { 
  state: "current" 
};

//newpost  ------------------------------------------
export const communityDropperprofile: profiletype = { 
  icn: "people_outline", 
  title: "choose community", 
  state: "input", 
  placeholder: "Search community" 
}; 

export const privacyDropperprofile: profiletype = { 
  icn: "lock", 
  title: "Privacy", 
  state: "clicked",
};

// su ---------------------------------------------------
export const defaultprofile: profiletype = {  title: "select", };

export const columnprofile: profiletype = { title: "column", };

export const orderprofile: profiletype = { title: "order", };

export const rolefiltercolumns: droppertype[] = [
  { value: "id", state: "clicked" },
  { value: "role", state: "clicked"},
]

export const chatfiltercolumns: droppertype[] = [
  { value: "id", state: "clicked" },
  { value: "room_code", state: "clicked"},
]

export const categoryfiltercolumns: droppertype[] = [
  { value: "id", state: "clicked" },
  { value: "categoryname", state: "clicked"},
]

export const postfiltercolumns: droppertype[] = [
  { value: "id", state: "clicked" },
  { value: "owner", state: "clicked" },
  { value: "type", state: "clicked" },
  { value: "status", state: "clicked" },
  { value: "tag", state: "clicked" },
  { value: "likes", state: "clicked" },
  { value: "community_id", state: "clicked" },
]

export const userfiltercolumns: droppertype[] = [
  { value: "id", state: "clicked" },
  { value: "username", state: "clicked" },
  { value: "email", state: "clicked" },
  { value: "role", state: "clicked" },
  { value: "status", state: "clicked" },
  { value: "country", state: "clicked" },
  { value: "dob", state: "clicked" },
  { value: "new_user", state: "clicked" },
  { value: "created_at", state: "clicked" },
]

export const communityfiltercolumns: droppertype[] = [
  { value: "id", state: "clicked" },
  { value: "communityname", state: "clicked" },
  { value: "owner", state: "clicked" },
  { value: "privacy", state: "clicked" },
  { value: "status", state: "clicked" },
  { value: "theme", state: "clicked" },
]