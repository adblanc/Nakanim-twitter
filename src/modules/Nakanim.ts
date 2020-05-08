import Twit from "twit";
import schedule from "node-schedule";
import moment from "moment";
import { TwitThread } from "twit-thread";
import { getRandomAnime, Episode, getCalendar, Day } from "@ablanc/nakanim-api";
import { createImage, readImage, deleteImage } from "../utils";
import {
  randomAnimeTweet,
  dailyEpisodeTweet,
  episodeRangeTweet,
} from "../tweets";
import { RANDOM_ANIME_CRONJOB, DAILY_EPISODES_CRONJOB } from "../constants";
import { DailyEpisode } from "../interfaces";

export default class Nakanim extends TwitThread {
  constructor(config: Twit.Options) {
    super(config);

    this.scheduleRandomAnimeJob();
    this.scheduleDailyAnimeJob();
    this.scheduleDailyEpisodesJob();
  }

  scheduleRandomAnimeJob = () => {
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

  scheduleDailyAnimeJob = () => {
    schedule.scheduleJob(DAILY_EPISODES_CRONJOB, this.scheduleDailyEpisodesJob);
  };

  scheduleDailyEpisodesJob = async () => {
    const { days } = await getCalendar();
    const day = days[moment().isoWeekday() - 2];

    const episodes = this.handleEpisodesRange(day.episodes);

    episodes.forEach((episode) => {
      const cronJob = this.getEpisodeCronJob(episode, day);

      schedule.scheduleJob(cronJob, () => {
        this.tweetEpisode(episode);
      });
    });
  };

  handleEpisodesRange = (episodes: Episode[]): DailyEpisode[] => {
    const seen: any = {};

    episodes.forEach((ep) => {
      if (seen[ep.title]) seen[ep.title] = [...seen[ep.title], ep];
      else seen[ep.title] = [ep];
    });

    return Object.keys(seen).map((key) => {
      if (seen[key].length > 1)
        return {
          ...seen[key][0],
          upperNumber: seen[key][seen[key].length - 1].number,
        };
      else return seen[key][0];
    });
  };

  getEpisodeCronJob = (episode: Episode, day: Day) => {
    const [hours, minutes] = episode.hour.split("h");
    const [, month, dayOfMonth] = day.date.split("-");

    return `${minutes} ${hours} ${dayOfMonth} ${month} *`;
  };

  tweetEpisode = async (episode: DailyEpisode) => {
    try {
      const tweet = episode.upperNumber
        ? episodeRangeTweet(episode)
        : dailyEpisodeTweet(episode);

      await createImage(episode);

      await this.tweetThread([
        { text: tweet, options: { media_data: readImage(episode) } },
      ]);

      deleteImage(episode);
    } catch (ex) {
      console.error("Error while tweeting episode: ", ex);
    }
  };
}
