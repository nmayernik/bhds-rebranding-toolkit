import { Header } from "@/components/chrome/Header";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { CommentsRoot } from "@/components/comments/CommentsRoot";

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col pb-28 sm:pb-28">
      <Header />
      <div
        data-comment-surface
        className="relative bhds-page-intro motion-reduce:animate-none"
      >
        {children}
      </div>
      <ThemeToggle />
      <CommentsRoot />
    </div>
  );
}
