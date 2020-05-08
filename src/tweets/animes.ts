import { Episode, Anime } from "@ablanc/nakanim-api";
import { ACCOUNTS } from "../constants/accounts";
import { getRefs } from "../utils/anime";
import { DailyEpisode } from "../interfaces";

export function dailyEpisodeTweet({
  number,
  title,
  ref,
  link,
}: Episode): string {
  return `L'épisode ${number} de ${title} vient de sortir sur ${ref
    .map((ref) => (ACCOUNTS as any)[ref])
    .join(" et ")}.
Lien : ${link}`;
}

export function episodeRangeTweet({
  number,
  upperNumber,
  title,
  ref,
  link,
}: DailyEpisode): string {
  return `Les épisodes ${number} à ${upperNumber} de ${title} viennent de sortir sur ${ref
    .map((ref) => (ACCOUNTS as any)[ref])
    .join(" et ")}.
Lien : ${link}`;
}

export function randomAnimeTweet(anime: Anime) {
  const s = anime.season && anime.season > 1 ? "s" : "";

  const core = `Animé aléatoire du jour : ${
    anime.name
  }. Disponible sur ${getRefs(anime)}.
Note : ${anime.rating}/5.
Episodes : ${anime.episodes}.${
    anime.season ? `\nSaison${s} : ${anime.season}.` : ""
  }
Genres : ${anime.genres.map((g) => g.name).join(", ")}.`;

  const synopsis = `Synopsis:
${anime.synopsis}`;

  return core + "\n" + synopsis;
}
