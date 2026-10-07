export const languages = ["hu", "en"];
export function locale(lang = "hu") {
  const l = languages.includes(lang) ? lang : "hu";
  return {
    lang: l,
    t: (hu, en) => (l === "en" ? en : hu),
    url: (path = "") =>
      `/${l}/${path ? path.replace(/^\/+|\/+$/g, "") + "/" : ""}`,
    money: (n) =>
      new Intl.NumberFormat(l === "hu" ? "hu-HU" : "en-GB").format(n) +
      (l === "hu" ? " Ft" : " HUF"),
  };
}
export function escape(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
export const modes = {
  cool: ["Hűtés", "Cooling"],
  both: ["Hűtés + fűtés", "Cooling + heating"],
  heat: ["Elsősorban fűtés", "Primarily heating"],
};
