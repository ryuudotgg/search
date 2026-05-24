import { describe, expect, it } from "vitest";
import type { Bang } from "./common-bangs";
import { buildBangUrl, parseBangTag } from "./resolve";

const google: Bang = {
  d: "www.google.com",
  u: "https://www.google.com/search?q={{{s}}}",
  t: "g",
};

describe("parseBangTag", () => {
  it("extracts and lowercases the bang tag", () => {
    expect(parseBangTag("!G hello")).toBe("g");
    expect(parseBangTag("hello !yt")).toBe("yt");
  });

  it("returns undefined when there is no bang", () => {
    expect(parseBangTag("hello world")).toBeUndefined();
  });
});

describe("buildBangUrl", () => {
  it("substitutes the url-encoded query", () => {
    expect(buildBangUrl(google, "!g hello world")).toBe(
      "https://www.google.com/search?q=hello%20world",
    );
  });

  it("leaves slashes unescaped", () => {
    expect(buildBangUrl(google, "!g foo/bar")).toBe("https://www.google.com/search?q=foo/bar");
  });

  it("falls back to the domain for a bare bang", () => {
    expect(buildBangUrl(google, "!g")).toBe("https://www.google.com");
  });
});
