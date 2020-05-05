import Twit from "twit";
import schedule from "node-schedule";
import { TwitThread } from "twit-thread";
import { getRandomAnime } from "@ablanc/nakanim-api";
import { createImage, readImage } from "../utils";
import { randomAnimeTweet } from "../tweets";
import { RANDOM_ANIME_CRONJOB } from "../constants";

export default class Nakanim extends TwitThread {
  constructor(config: Twit.Options) {
    super(config);

    this.startRandomAnimeJob();
  }

  startRandomAnimeJob = () => {
    schedule.scheduleJob(RANDOM_ANIME_CRONJOB, this.tweetRandomAnime);
  };

  tweetRandomAnime = async () => {
    try {
      const { anime } = await getRandomAnime();
      const tweet = randomAnimeTweet(anime);

      await createImage(anime);

      const tweets = await this.tweetThread([
        { text: tweet, options: { media_data: readImage(anime) } },
      ]);

      await this.post("/favorites/create", { id: tweets[0].id_str });
    } catch (ex) {
      console.error("Error while tweeting : ", ex);
    }
  };
}
