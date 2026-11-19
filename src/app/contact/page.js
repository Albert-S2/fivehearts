import PublisherPageLayout from "../../components/PublisherPageLayout";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  path: "/contact",
  title: "Contact Five Hearts Games",
  description:
    "Contact Five Hearts Games with questions, feedback, or requests about your leaderboard information.",
});

export default function ContactPage() {
  return (
    <PublisherPageLayout
      intro="We welcome questions, feedback, and reports about the Five Hearts trivia game."
      title="Contact"
    >
      <section>
        <h2 className="text-xl font-black text-white sm:text-2xl">Email Five Hearts Games</h2>
        <p className="mt-3">
          For game support, content feedback, privacy questions, or a request to remove a leaderboard entry, email us at:
        </p>
        <p className="mt-4">
          <a className="break-all rounded-lg border border-cyan-400/30 bg-cyan-400/5 px-4 py-3 font-bold text-cyan-200 underline underline-offset-4" href="mailto:fiveheartsgames@gmail.com">
            fiveheartsgames@gmail.com
          </a>
        </p>
        <p className="mt-4">
          If you are asking about a leaderboard entry, include the player name and score shown on the board so we can identify it.
        </p>
      </section>
    </PublisherPageLayout>
  );
}
