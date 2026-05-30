const ALLOWED_TAGS = new Set([
  "i",
  "em",
  "b",
  "strong",
  "u",
  "sub",
  "sup",
  "br",
  "p",
]);

const BLOCKED_CONTENT =
  /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;

export function sanitizeQuestionHtml(input: string): string {
  if (!input) {
    return "";
  }

  const withoutBlocked = input.replace(BLOCKED_CONTENT, "");

  return withoutBlocked.replace(
    /<\/?([a-z][a-z0-9]*)\b[^>]*\/?>/gi,
    (match, tagName: string) => {
      const tag = tagName.toLowerCase();

      if (!ALLOWED_TAGS.has(tag)) {
        return "";
      }

      if (match.startsWith("</")) {
        return `</${tag}>`;
      }

      if (tag === "br") {
        return "<br />";
      }

      return `<${tag}>`;
    },
  );
}
