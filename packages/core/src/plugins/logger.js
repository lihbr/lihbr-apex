import logger from "~/assets/js/logger";

export default (context, inject) => {
  inject("logger", logger);
};
