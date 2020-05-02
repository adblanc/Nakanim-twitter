import { Episode, Anime } from "@ablanc/nakanim-api";
import { ACCOUNTS } from "./accounts";
import { getRefs } from "../utils/anime";

export function dailyEpisodeTweet(episode: Episode): string {
  return `L'épisode ${episode.number} de ${episode.title} sort aujoud'hui à ${
    episode.hour
  } sur ${episode.ref.map((ref) => (ACCOUNTS as any)[ref]).join(" et ")}.
Lien : ${episode.link}`;
}

export function randomAnimeTweet(anime: Anime) {
  const s = anime.season && anime.season > 1 ? "s" : "";

  const core = `Animé aléatoire du jour : ${
    anime.name
  }. Disponible sur ${getRefs(anime)}.
Note : ${anime.rating}/5.
Episodes : ${anime.episodes}.
${anime.season ? `Saison${s} : ${anime.season}.` : ""}
Genres : ${anime.genres.map((g) => g.name).join(", ")}.`;

  const synopsis = `Synopsis:
${anime.synopsis}`;
  const synoTruncated = truncateSynopsis(synopsis);

  const tweet = [core, ...synoTruncated];
  return tweet;
}

const truncateSynopsis = (synopsis: string) => {
  const chunks = [];

  for (let i = 0; i < synopsis.length; i += 280) {
    chunks.push(synopsis.substring(i, i + 280));
  }
  return chunks;
};
