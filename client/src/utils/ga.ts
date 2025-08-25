import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-RM33WJLWN3");
};

export const logPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
