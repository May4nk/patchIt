import { droppertype, profiletype } from "../components/html/patdrop/types";

export const sortprofile: profiletype = { title: "Sort", icn: "sort" };

// navbar ------------------------------------------------
export const navigationDropperprofile: profiletype = {
  state: "CURRENT",
};

//newpost  ------------------------------------------
export const communityDropperprofile: profiletype = {
  state: "INPUT",
  icn: "people_outline",
  title: "select community",
  placeholder: "Search community",
};

export const privacyDropperprofile: profiletype = {
  icn: "lock",
  title: "Privacy",
};

// su ---------------------------------------------------
export const defaultprofile: profiletype = { title: "select" };

export const columnprofile: profiletype = { title: "column" };

export const orderprofile: profiletype = { title: "order" };

export const rolefiltercolumns: droppertype[] = [
  { title: "id", state: "CLICKED" },
  { title: "role", state: "CLICKED" },
];

export const chatfiltercolumns: droppertype[] = [
  { title: "id", state: "CLICKED" },
  { title: "room_code", state: "CLICKED" },
];

export const categoryfiltercolumns: droppertype[] = [
  { title: "id", state: "CLICKED" },
  { title: "categoryname", state: "CLICKED" },
];

export const postfiltercolumns: droppertype[] = [
  { title: "id", state: "CLICKED" },
  { title: "owner", state: "CLICKED" },
  { title: "type", state: "CLICKED" },
  { title: "status", state: "CLICKED" },
  { title: "tag", state: "CLICKED" },
  { title: "likes", state: "CLICKED" },
  { title: "community_id", state: "CLICKED" },
];

export const userfiltercolumns: droppertype[] = [
  { title: "id", state: "CLICKED" },
  { title: "username", state: "CLICKED" },
  { title: "email", state: "CLICKED" },
  { title: "role", state: "CLICKED" },
  { title: "status", state: "CLICKED" },
  { title: "country", state: "CLICKED" },
  { title: "dob", state: "CLICKED" },
  { title: "new_user", state: "CLICKED" },
  { title: "created_at", state: "CLICKED" },
];

export const communityfiltercolumns: droppertype[] = [
  { title: "id", state: "CLICKED" },
  { title: "communityname", state: "CLICKED" },
  { title: "owner", state: "CLICKED" },
  { title: "privacy", state: "CLICKED" },
  { title: "status", state: "CLICKED" },
  { title: "theme", state: "CLICKED" },
];
