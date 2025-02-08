import dotenv from "dotenv";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

//types
import {
  generatepresignedfilestype,
  generatepresignedurlstype,
  REQTYPE,
  signedfiletype,
  signedurltype,
} from "./types";
import { fromCache } from "./redis";

dotenv.config({ path: `${process.env.INIT_CWD}/.env.${process.env.NODE_ENV}` });
const BUCKET = process.env.AWS_BUCKET;

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SCERET_ACCESS_KEY!,
});

export const generatePresignedUrls: generatepresignedurlstype = async (
  data: generatepresignedfilestype
) => {
  const { files, req, postId, userId } = data;

  try {
    const getRequest: boolean = req === "GET";

    // if(getRequest) {
    //   const cachedUserPics: any = await fromCache("HGET", `usersPics:${userId}`, );

    //   if(files) {
    //     const userPics = JSON.parse(cachedUserPics);
    //     return { [""], "", req }
    //   }
    // }

    const presignedData: Promise<signedurltype>[] = files.map(
      async (file: signedfiletype) => {
        let key: string = `${userId}/${postId}/${file.name}`;

        const putCommand = new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          ContentType: file.type,
        });

        const getCommand = new GetObjectCommand({
          Bucket: BUCKET,
          Key: file.name,
        });

        const signedUrl = await getSignedUrl(
          s3,
          getRequest ? getCommand : putCommand,
          {
            expiresIn: getRequest ? 7800 : 60,
          }
        );

        const fileUrl: string = key;
        return { signedUrl, fileUrl, req };
      }
    );

    const signedUrls: signedurltype[] = await Promise.all(presignedData).then(
      (value) => value
    );

    return signedUrls;
  } catch (err) {
    throw Error("Error generating pre signed url");
  }
};
