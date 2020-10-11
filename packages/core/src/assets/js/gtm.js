export const PROGRAMMATIC = "programmatic";

export const CATEGORIES = {
  ART_FORM: "Art Form",
  CONTACT_FORM: "Contact Form",
  BLOG_POST: "Blog Post"
};

export const ACTIONS = {
  DISCUSS_TWITTER: "Discuss Twitter",
  SHARE_TWITTER: "Share Twitter",
  SHARE_FACEBOOK: "Share Facebook",
  SHARE_LINKEDIN: "Share LinkedIn",
  SHARE_NATIVE: "Share Native",

  INPUT_FOCUS: "Input Focus",

  FORM_SUBMIT: "Form Submit"
};

const getEvent = (eventCategory, eventAction, eventLabel, eventValue) => {
  const errors = [];
  if (!eventCategory) {
    errors.push("`eventCategory` is required");
  }
  if (!eventAction) {
    errors.push("`eventAction` is required");
  }
  if (errors.length) {
    throw new Error(errors.join(", "));
  }

  return {
    event: PROGRAMMATIC,
    eventCategory,
    eventAction,
    eventLabel,
    eventValue
  };
};

export default getEvent;
