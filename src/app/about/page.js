import Link from "next/link";
import PublisherPageLayout from "../../components/PublisherPageLayout";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  path: "/about",
  title: "About Five Hearts Games",
  description:
    "Learn about Five Hearts, a browser-based trivia game for solo play, one-on-one duels, and round-based team battles.",
});

export default function AboutPage() {
  return (
    <PublisherPageLayout
      intro="Five Hearts is a browser-based trivia game built for a quick solo challenge or a shared-screen match with friends."
      title="About Five Hearts"
    >
      <section>
        <h2 className="text-xl font-black text-white sm:text-2xl">A trivia game about knowledge and survival</h2>
        <p className="mt-3">
          Every player or team begins with five hearts. Correct answers add points, while incorrect answers and timeouts cost a heart. Players must balance taking risks with keeping enough hearts to stay in the game.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-black text-white sm:text-2xl">Choose how to play</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li><strong className="text-white">Solo:</strong> answer questions for as long as your five hearts last.</li>
          <li><strong className="text-white">Duel:</strong> two teams take equal turns in a dice-locked order.</li>
          <li><strong className="text-white">Team Battle:</strong> multiple teams compete across rounds, with standings between rounds.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-black text-white sm:text-2xl">Questions across a range of subjects</h2>
        <p className="mt-3">
          Five Hearts features trivia across subjects such as science, geography, history, nature, and space. Questions include an answer explanation so players can learn a fact while they play.
        </p>
      </section>
      <p>
        To start playing, visit the <Link className="font-bold text-cyan-200 underline underline-offset-4" href="/game">game mode selection page</Link>. For questions or privacy requests, contact <a className="font-bold text-cyan-200 underline underline-offset-4" href="mailto:fiveheartsgames@gmail.com">fiveheartsgames@gmail.com</a>.
      </p>
    </PublisherPageLayout>
  );
}
