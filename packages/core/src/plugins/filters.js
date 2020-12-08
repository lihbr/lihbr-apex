import Vue from "vue";

Vue.filter("uc_first", str => {
  if (!str) {
    return "";
  }

  str = new String(str);
  return `${str.charAt().toUpperCase()}${str.slice(1)}`;
});

Vue.filter("uppercase", str => {
  if (!str) {
    return "";
  }

  str = new String(str);
  return str.toUppseCase();
});

Vue.filter("lowercase", str => {
  if (!str) {
    return "";
  }

  str = new String(str);
  return str.toLowerCase();
});

Vue.filter("prismicDate", str => {
  if (!str) {
    return "No date specified";
  }

  if (str.split("-").length !== 3) {
    return str;
  }

  const [year, month, date] = str.split("-");

  const months = {
    1: "Jan.",
    2: "Feb.",
    3: "Mar.",
    4: "Apr.",
    5: "May",
    6: "June",
    7: "July",
    8: "Aug.",
    9: "Sept.",
    10: "Oct.",
    11: "Nov.",
    12: "Dec."
  };

  return `${months[`${parseInt(month)}`]} ${date}, ${year}`;
});

Vue.filter("prismicCategory", (categories = []) => {
  return categories[0]?.name || "Unknown";
});
