import {
  singleSiteComment,
  multiSiteComment,
  notABotComment,
} from "./samples/comments";
import {
  getChannelDeploySuccessComment,
  createBotCommentIdentifier,
  toServedUrlPath,
} from "../src/postOrUpdateComment";
import {
  channelSingleSiteSuccess,
  channelMultiSiteSuccess,
} from "./samples/cliOutputs";
import { createDeploySignature } from "../src/hash";

describe("postOrUpdateComment", () => {
  // it("Creates the expected comment for a single site", () => {
  //   const comment = getChannelDeploySuccessComment(
  //     channelSingleSiteSuccess,
  //     "fe211ff",
  //     []
  //   );

  //   expect(comment).toEqual(singleSiteComment);
  // });

  // it("Creates the expected comment for multisite", () => {
  //   const comment = getChannelDeploySuccessComment(
  //     channelMultiSiteSuccess,
  //     "fe211ff",
  //     []
  //   );

  //   expect(comment).toEqual(multiSiteComment);
  // });

  // it("Can tell if a comment has been written by itself", () => {
  //   const signature = createDeploySignature(channelSingleSiteSuccess);
  //   const isCommentByBot = createBotCommentIdentifier(signature);
  //   const testComment = {
  //     user: { type: "Bot" },
  //     body: singleSiteComment,
  //   };
  //   expect(isCommentByBot(testComment)).toEqual(true);
  // });

  it("Can tell if a comment has not been written by itself", () => {
    const signature = createDeploySignature(channelMultiSiteSuccess);
    const isCommentByBot = createBotCommentIdentifier(signature);
    const testComment = {
      user: { type: "Bot" },
      body: notABotComment,
    };
    expect(isCommentByBot(testComment)).toEqual(false);
  });
});

describe("toServedUrlPath", () => {
  it("strips everything up to and including originalPath, prepends replacedPath, rewrites .md → .html", () => {
    expect(
      toServedUrlPath(
        "sites/docs/src/content/packages-and-plugins/developing-packages.md",
        "src/content/",
        "/"
      )
    ).toEqual("/packages-and-plugins/developing-packages.html");
  });

  it("keeps an .html source path's extension, only stripping the prefix", () => {
    expect(
      toServedUrlPath("sites/docs/src/content/index.html", "src/content/", "/")
    ).toEqual("/index.html");
  });

  it("falls back to the raw path when originalPath is absent", () => {
    expect(toServedUrlPath("README.md", "src/content/", "/")).toEqual(
      "/README.html"
    );
  });
});

describe("getChannelDeploySuccessComment detailed URLs", () => {
  it("joins the base preview URL and the served path with exactly one slash", () => {
    const comment = getChannelDeploySuccessComment(
      channelSingleSiteSuccess,
      "fe211ff",
      ["/packages-and-plugins/developing-packages.html"]
    );

    expect(comment).toContain(
      "https://action-hosting-deploy-demo--singlesite-test-jl98rmie.web.app/packages-and-plugins/developing-packages.html"
    );
    // 回归:旧实现会拼成 `.web.apppackages...`(缺斜杠)
    expect(comment).not.toContain(".web.apppackages-and-plugins");
  });
});
