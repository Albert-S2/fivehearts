import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  path: "/game",
  title: "Choose a Free Party Trivia Game Mode | Five Hearts",
  description:
    "Choose Solo, Duel, or Battle for a free multiplayer trivia game. Gather friends around one screen and compete to protect five hearts.",
});

export { default } from "../game/page";
