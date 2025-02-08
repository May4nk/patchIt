import { defaultCommunityPic, defaultUserPic } from "../../constants/const";

//types
type arbitrarycredtype = "username" | "mail" | "password";

export const Randomcred = (credtype: arbitrarycredtype) => {
  const username: (unames: string[]) => string = (unames: string[]) => {
    if (unames.length !== 0) {
      const randomUsername: string =
        unames[Math.floor(Math.random() * 3)] + Math.floor(Math.random() * 9);

      return randomUsername;
    } else {
      const anonUsername: string = `anonymous${Math.floor(
        Math.random() * 9999
      )}`;

      return anonUsername;
    }
  };

  const mail: () => string = () => {
    const randomMail: string = `ao${Math.floor(
      Math.random() * 9999
    )}@anonymous.com`;

    return randomMail;
  };

  const password: () => string = () => {
    const randomPassword: string = Math.random().toString(36).substring(2, 19);
    return randomPassword;
  };

  const arbitraryCred: Record<arbitrarycredtype, (unames?: any) => string> = {
    username,
    mail,
    password,
  };

  return arbitraryCred[credtype];
};

export const dateFormatter: (datestr: string) => string = (datestr: string) => {
  const currentDate = new Date();
  const postedDate = new Date(Number(datestr));
  const postedDateMS: number = postedDate.getTime();
  const currentDateMS: number = currentDate.getTime();

  const postedMS: number = currentDateMS - postedDateMS;
  const postedDays = Math.floor(postedMS / 86400000);
  const postedHrs = Math.floor(postedMS / 3600000);
  const postedMins = Math.floor(postedMS / 60000);

  if (postedHrs < 23) {
    if (postedMins < 59) {
      if (postedMins < 1) {
        return "just now";
      } else {
        return `${postedMins} minutes ago`;
      }
    } else {
      return `${postedHrs} hours ago`;
    }
  } else if (postedHrs > 23) {
    if (postedDays < 30) {
      return `${postedDays} days ago`;
    } else {
      return `${Math.floor(postedDays / 30)} month${
        Math.floor(postedDays / 30) === 1 ? "" : "s"
      } ago`;
    }
  } else {
    return "";
  }
};

export const defaultUPic = (e) => {
  e.target.src = defaultUserPic;
};

export const defaultCPic = (e) => {
  e.target.src = defaultCommunityPic;
};
