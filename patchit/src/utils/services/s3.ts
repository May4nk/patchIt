import client from "../../client";
import { FetchResult } from "@apollo/client";

//queries
import { GETSIGNEDURLS } from "../../containers/newpost/queries";

//types
import {
  filetype,
  getsignedurlfiletype,
  getsignedurltype,
  signedurlrestype,
  signedurltype,
} from "../types";

export const getSignedUrls: getsignedurltype = async (
  file: getsignedurlfiletype
) => {
  try {
    const { data }: FetchResult<signedurlrestype> = await client.mutate({
      mutation: GETSIGNEDURLS,
      variables: {
        data: { ...file },
      },
    });

    if (data) {
      const signedUrls: signedurltype[] = data?.getSignedUrl;
      return signedUrls;
    } else {
      throw new Error("No data received from the server");
    }
  } catch (err) {
    throw new Error("Unable to fetch signedUrls");
  }
};

export function uploadToS3(file: filetype) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("PUT", file.url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && file.progress) {
        const onProgress = (event.loaded / event.total) * 100;
        file.progress(onProgress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(file.url);
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Upload failed due to a network error"));
    };

    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.setRequestHeader("Content-Type", file.file.type);
    xhr.send(file.file);
  });
}
