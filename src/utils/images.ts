import stream from "stream";
import { promisify } from "util";
import got from "got";
import fs from "fs";

const pipeline = promisify(stream.pipeline);

const basePath = "./static";

const getImagePath = (obj: any): string => {
  const image = obj.img || obj.image2x || obj.image;
  const extension = image.split(".").pop();
  return `${basePath}/${obj._id}.${extension}`;
};

export function createImage(obj: any): Promise<void> | undefined {
  const image = obj.img || obj.image2x || obj.image;
  const url = encodeURI(image);
  try {
    return pipeline(got.stream(url), fs.createWriteStream(getImagePath(obj)));
  } catch (ex) {
    console.error("Error while creating image : ", ex);
  }
}

export function deleteImage(obj: any) {
  return fs.unlinkSync(getImagePath(obj));
}

export function readImage(obj: any): string {
  return fs.readFileSync(getImagePath(obj), { encoding: "base64" });
}
