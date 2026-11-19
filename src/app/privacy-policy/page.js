import PublisherPageLayout from "../../components/PublisherPageLayout";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  path: "/privacy-policy",
  title: "Privacy Policy | Five Hearts Games",
  description:
    "Read how Five Hearts Games handles leaderboard submissions, analytics, cookies, and advertising technologies.",
});

export default function PrivacyPolicyPage() {
  return (
    <PublisherPageLayout
      intro="This policy explains what information may be processed when you use Five Hearts, play a game, or choose to submit a score."
      title="Privacy Policy"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Last updated: November 19, 2026
      </p>

      <section>
        <h2 className="text-xl font-black text-white sm:text-2xl">Information you provide</h2>
        <p className="mt-3">
          You can play without creating an account. If you choose to submit a Solo score, we process the player name you enter, the score, the game mode, and the submission time so the result can appear on the leaderboard. Leaderboard entries may be visible to other visitors.
        </p>
        <p className="mt-3">
          If you do not submit a score, Five Hearts does not send your in-game answers or score to the leaderboard.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-black text-white sm:text-2xl">Service providers and analytics</h2>
        <p className="mt-3">
          Five Hearts uses Supabase to provide trivia questions and store leaderboard entries. The site is hosted using Vercel and uses Vercel Analytics to understand site usage and performance. These providers may process technical information needed to deliver and maintain their services, as described in their own privacy policies.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-black text-white sm:text-2xl">Cookies and Google advertising</h2>
        <p className="mt-3">
          Google AdSense may display ads on this site. Google and its partners may use cookies or similar technologies to serve, measure, and personalize ads, subject to your settings and applicable law. These technologies may use information about your visits to this and other websites.
        </p>
        <p className="mt-3">
          You can review or change Google ad personalization settings at{" "}
          <a className="font-bold text-cyan-200 underline underline-offset-4" href="https://adssettings.google.com/" rel="noreferrer" target="_blank">
            Google Ads Settings
          </a>
          . Learn more about how Google uses information from sites and apps that use its services in{" "}
          <a className="font-bold text-cyan-200 underline underline-offset-4" href="https://policies.google.com/technologies/partner-sites" rel="noreferrer" target="_blank">
            Google&apos;s partner-site disclosure
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-xl font-black text-white sm:text-2xl">Your choices and data requests</h2>
        <p className="mt-3">
          Submitting a leaderboard score is optional. To request removal of a leaderboard entry or ask a privacy question, contact{" "}
          <a className="font-bold text-cyan-200 underline underline-offset-4" href="mailto:fiveheartsgames@gmail.com">
            fiveheartsgames@gmail.com
          </a>
          . You can also manage cookies through your browser settings and Google ad controls.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-black text-white sm:text-2xl">Changes to this policy</h2>
        <p className="mt-3">
          We may update this policy when the site or its services change. The latest version will be posted on this page with its updated date.
        </p>
      </section>
    </PublisherPageLayout>
  );
}
