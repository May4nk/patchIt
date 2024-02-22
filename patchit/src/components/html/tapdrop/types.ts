interface titletype{
  icnsrc? : string;
  imgsrc? : string;
  title? : string;
}

interface dropperprofile {
  icnsrc? : string;
  imgsrc? : string;
  titles? : titletype[] | string[];
  type? : string;
  name? : string;
  placeholder? : string;
  searchname? : string[];
  state? : string;
}

interface droppers {
  icnsrc? : string;
  imgsrc? : string;
  value? : string;
  last? : boolean;
  btn? : string;
  clickEvent? : string;
  link? : string;
  event? : any;
}

export interface statetype {
  icnsrc? : string;
  imgsrc? : string;
  titles? : string[] | titletype[];
  searchname: string[];
}


export interface tapdropprops {
  dropperprofile : dropperprofile;
  droppers? : droppers[];
  dropperssearch? : any[];
  dropperinput?: any;
}

export interface tapdropdropperprops {
  dropitem: droppers;
  handleclick?: any;
  type?: string;
}
