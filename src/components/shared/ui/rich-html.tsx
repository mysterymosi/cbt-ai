import { sanitizeQuestionHtml } from "@/lib/html/sanitize-question-html";
import { cn } from "@/lib/utils";

type RichHtmlProps = {
  html: string;
  className?: string;
  as?: "span" | "p" | "div";
};

export function RichHtml({ html, className, as: Tag = "span" }: RichHtmlProps) {
  return (
    <Tag
      className={cn("[&_i]:italic [&_em]:italic [&_b]:font-semibold [&_strong]:font-semibold [&_u]:underline", className)}
      dangerouslySetInnerHTML={{ __html: sanitizeQuestionHtml(html) }}
    />
  );
}
