type arbitrarycredtype = "username" | "mail" | "password";

export const Randomcred = (credtype: arbitrarycredtype) => {

  const username: (unames: string[]) => string = (unames: string[]) => {
    if(unames.length !== 0) {
      const randomUsername: string = unames[Math.floor(Math.random()*3)]+Math.floor(Math.random()*4);
      return randomUsername;
    } else {
      const anonUsername: string = `anonymous${Math.floor(Math.random()*9999)}`;
      return anonUsername;
    }
  }
  
  const mail: () => string = () => {
    const randomMail: string = `ao${Math.floor(Math.random()*9999)}@anonymous.com`;
    return randomMail;
  }

  const password: () => string = () => {
    const randomPassword: string = Math.random().toString(36).substring(2,19);
    return randomPassword;
  }
  
  const arbitraryCred:  Record<arbitrarycredtype, (unames?: any) => string> = {
    username,
    mail,
    password
  }

  return arbitraryCred[credtype];
}

export const dateFormatter: (datestr: string) => string = (datestr: string) => {
  const postedDate: Date = new Date(Number(datestr));
  const currentDate = new Date();
  if(postedDate.getDate() === currentDate.getDate()) {
    if(postedDate.getHours() === currentDate.getHours()){
      if(currentDate.getMinutes() === postedDate.getMinutes()){
        return "just now"
      } else {
        return `${currentDate.getMinutes() - postedDate.getMinutes()} minute${(currentDate.getMinutes() - postedDate.getMinutes()) === 1 ? "" : "s"} ago`
      }
    } else {
      return `${currentDate.getHours() - postedDate.getHours()} hour${(currentDate.getHours() - postedDate.getHours()) === 1 ? "" : "s"} ago`
    }
  } else if(postedDate.getDate() < currentDate.getDate()){
    if((currentDate.getDate() - postedDate.getDate()) < 30) {
      return `${(currentDate.getDate() - postedDate.getDate())} day${((currentDate.getDate() - postedDate.getDate()) === 1 ) ? "" : "s"} ago`
    } else {
      return `${Math.floor((postedDate.getDate() - currentDate.getDate())/30)} month${Math.floor((postedDate.getDate() - currentDate.getDate())/30) === 1 ? "" : "s"} ago`
    }
  } else {
    return ""
  }
}