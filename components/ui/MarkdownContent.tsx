import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/github-dark.css";

export default function MarkdownContent({
  content,
}: {
  content: string;
}) {
  return (
    <div className="prose prose-slate max-w-none prose-pre:bg-zinc-950 prose-pre:text-white">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm text-white">
              {children}
            </pre>
          ),
          code: ({ children, className }) => (
            <code className={className ?? "rounded bg-zinc-200 px-1 py-0.5 text-sm"}>
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