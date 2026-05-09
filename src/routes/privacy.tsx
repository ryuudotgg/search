import { createFileRoute } from "@tanstack/react-router";
import Article from "../components/article";
import { components } from "../components/article/components";
import PrivacyMDX from "../content/privacy.mdx";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPolicy,
  head: () => ({ meta: [{ title: "Privacy Policy" }] }),
});

const lastUpdatedAt = new Date();

function PrivacyPolicy() {
  return (
    <div className="relative min-h-screen">
      <Article title="Privacy Policy" lastUpdatedAt={lastUpdatedAt}>
        <PrivacyMDX components={components} />
      </Article>
    </div>
  );
}
