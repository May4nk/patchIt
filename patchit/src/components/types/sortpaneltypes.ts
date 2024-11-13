export interface sortpanelprops {
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
}

export interface savedposttype {
  post_id: { id: number; title: string };
}
