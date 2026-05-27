import { createFileRoute } from "@tanstack/react-router";
import Article from "../components/article";
import { components } from "../components/article/components";
import { TopBar } from "../components/top-bar";
import PrivacyMDX, { toc } from "../content/privacy.mdx";

export const Route = createFileRoute("/privacy")({
  component: () => <PrivacyPolicy />,
  head: () => ({ meta: [{ title: "Privacy Policy — Ryuu's Search" }] }),
});

const lastUpdatedAt = new Date("2026-05-25");

function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      <TopBar />

      <Article title="Privacy Policy" lastUpdatedAt={lastUpdatedAt} toc={toc}>
        <PrivacyMDX components={components} />
      </Article>
    </div>
  );
}
