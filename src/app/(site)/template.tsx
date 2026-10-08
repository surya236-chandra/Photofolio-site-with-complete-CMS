// A template re-mounts on every navigation, so this fade/slide animation
// replays each time a new page opens.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
