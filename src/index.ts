import Nakanim from "./modules/Nakanim";
import config from "./config";
import Twit from "twit";

(async () => {
  new Nakanim(config as Twit.Options);
})();
