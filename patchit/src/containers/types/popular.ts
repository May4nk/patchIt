type TYPE = "BLOG" | "IMAGE" | "LINK" | "POLL";

export interface popularcardtype {
  id: string;
  title: string;
  type: TYPE;
  content: string;
  status: string; 
}

