import type { FC } from "react";
import { colors } from "@/common/color";
import GsapHeader from "@/components/gsap/GsapHeader.js";
import GsapPopup from "@/components/gsap/GsapPopup.js";
import GithubMarkdown from "@/components/mdx/GithubMarkdown.js";
import { mdxComponents } from "@/components/mdx/MdxComponents.js";
import CenterContent from "@/components/UI/CenterContent.js";
import RoundedContent from "@/components/UI/RoundedContent.js";
import ArticleList from "@/pages/root/ArticleList.js";
import ProfileMD from "@/pages/root/profile.mdx";

/** ===================
      Internal
==================== */

type ArticleTopics = "typescript" | "clojure";

type ArticlesContentProps = {
  topic: ArticleTopics;
};

const ArticlesContent: FC<ArticlesContentProps> = ({ topic }) => {
  return (
    <RoundedContent title={topic}>
      <ArticleList topic={topic} />
    </RoundedContent>
  );
};

const profileStyle = {
  backgroundColor: colors.transparent,
  color: colors.profileText,
} as const;

/** ===================
      Main
==================== */

const Profile: FC = () => {
  return (
    <CenterContent>
      <RoundedContent title={"profile"}>
        <GithubMarkdown>
          <GsapHeader>
            <GsapPopup>
              <article className="markdown-body" style={profileStyle}>
                <ProfileMD components={mdxComponents} />
              </article>
            </GsapPopup>
          </GsapHeader>
        </GithubMarkdown>
      </RoundedContent>

      <ArticlesContent topic={"typescript"} />
    </CenterContent>
  );
};

export default Profile;
