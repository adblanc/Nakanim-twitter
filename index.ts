import Nakanim from "./src/modules/Nakanim";
import config from "./src/config";
import Twit from "twit";

(async () => {
  const nakanim = new Nakanim(config as Twit.Options);

  await nakanim.tweetRandomAnime();
})();
