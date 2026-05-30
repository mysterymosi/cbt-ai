import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={cn("text-sm leading-6 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => (
            <ul className="mb-2 ml-4 list-disc last:mb-0 [&_ul]:mt-1 [&_ol]:mt-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-2 ml-4 list-decimal last:mb-0 [&_ul]:mt-1 [&_ol]:mt-1">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="mb-1 last:mb-0">{children}</li>,
          h1: ({ children }) => (
            <p className="mb-2 font-semibold last:mb-0">{children}</p>
          ),
          h2: ({ children }) => (
            <p className="mb-2 font-semibold last:mb-0">{children}</p>
          ),
          h3: ({ children }) => (
            <p className="mb-2 font-semibold last:mb-0">{children}</p>
          ),
          code: ({ children }) => (
            <code className="rounded bg-background/60 px-1 py-0.5 font-mono text-xs">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
