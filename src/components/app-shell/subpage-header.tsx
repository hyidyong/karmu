import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type SubpageHeaderProps = {
  title: string;
  backHref?: string;
  eyebrow?: string;
};

export function SubpageHeader({ title, backHref = "/", eyebrow }: SubpageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center gap-3 bg-white/92 px-3 py-2 backdrop-blur-xl">
      <Link
        aria-label="뒤로 가기"
        className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius)] transition-colors hover:bg-muted"
        href={backHref}
      >
        <ArrowLeft aria-hidden="true" className="size-5" />
      </Link>
      <div className="min-w-0">
        {eyebrow ? <p className="text-xs font-semibold text-primary">{eyebrow}</p> : null}
        <p className="truncate text-lg font-bold tracking-[-0.02em]">{title}</p>
      </div>
    </header>
  );
}
