export const ACTION: Record<"CURRENT"|"CLICKED"|"INPUT"|"DEFAULT", string> = {
  CURRENT: "current",
  CLICKED: "clicked",
  INPUT: "input",
  DEFAULT: "default"
};

export const tagnames: string[] = ["spoilers", "weird", "nsfw", "gore", "new" ];

export const newpostrules: string[] = [ 
  "1. Dont forget basic moral values.",
  "2. It's good untill no harm to specific one.",
  "3. Give a thought before hitting POST!",
  "4. Follow community guidlines.",
  "5. Most Importantly! Behave."
]

export const pollrules: string[] = [
  "Keep your choices short and straight.",
  "More options more choices.",
  "Follow community guidelines.",
  "Options can't be edited after post."
]

export const postgenres: Record<"tabname" | "tabicn", string>[] = [
  { tabname: "BLOG", tabicn: "assignment"},
  { tabname: "IMAGE", tabicn: "image"},
  { tabname: "LINK", tabicn: "insert_link"},
  { tabname: "POLL", tabicn: "poll"},
]
  
export const allNames: string[] = ["inquisitiveTom", "interestedTom", "analyticalTom", "disquisitiveTom"];

export const searchCategories: Record<"name" | "icn", string>[] = [
  { name: "Posts", icn: "collections" }, 
  { name: "Communities", icn: "people_outline" }, 
  { name: "Comments", icn: "forum" }, 
  { name: "Peoples", icn: "perm_identity" }
];

export const settingTabs:string[] = ["account", "profile", "privacy", "notifications", "feeds", "chat"];
export const communitySettingTabs:string[] = ["profile", "privacy", "notifications"];

export const allTabs: string[] = [ "users", "posts", "categories", "communities", "roles", "chats", "comments", "patcoins"];
