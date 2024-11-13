export const changeToBase64: (blobVal: Blob) => Promise<string> = (
  blobVal: Blob
) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64: string = reader.result as string;
      resolve(base64);
      console.log(base64);
    };

    reader.onerror = () => {
      reject("Failed to upload pic");
    };

    reader.readAsDataURL(blobVal);
  });
};
