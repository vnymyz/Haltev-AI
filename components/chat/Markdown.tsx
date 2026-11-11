"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Loaded on demand (next/dynamic) so the markdown libraries stay out of the landing page's JavaScript. */
export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: (props) => <a {...props} target="_blank" rel="noreferrer" /> }}>
      {children}
    </ReactMarkdown>
  );
}
