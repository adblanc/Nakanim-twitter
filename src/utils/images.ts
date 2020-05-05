import stream from "stream";
import { promisify } from "util";
import got from "got";
import fs from "fs";
import { IMAGES_PATH } from "../constants";

const pipeline = promisify(stream.pipeline);

const getImagePath = (obj: any): string => {
  const image = obj.img || obj.image2x || obj.image;
  const extension = image.split(".").pop();
  return `${IMAGES_PATH}/${obj._id}.${extension}`;
};

export function createImage(obj: any): Promise<void> {
  const image = obj.img || obj.image2x || obj.image;
  const url = encodeURI(image);

  return pipeline(got.stream(url), fs.createWriteStream(getImagePath(obj)));
}

export function deleteImage(obj: any) {
  return fs.unlinkSync(getImagePath(obj));
}

export function readImage(obj: any): string {
  return fs.readFileSync(getImagePath(obj), { encoding: "base64" });
}
