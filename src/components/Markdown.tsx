import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders content that may be either HTML (from the rich text editor) or
 * Markdown (legacy / imported content). Detected by a leading "<".
 * Content is authored only by authenticated admins.
 */
export default function Markdown({ children }: { children: string }) {
  const content = children || "";
  const isHtml = /^\s*</.test(content);

  if (isHtml) {
    return (
      <div className="prose-studio" dangerouslySetInnerHTML={{ __html: content }} />
    );
  }

  return (
    <div className="prose-studio">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
