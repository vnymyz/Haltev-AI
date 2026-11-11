// The chat uses the same light look as the landing page (see .theme-light in globals.css).
export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <div className="theme-light font-body">{children}</div>;
}
