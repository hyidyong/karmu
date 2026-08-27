"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { getActiveNavHref, navItems } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();
  const activeHref = getActiveNavHref(pathname);

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgb(35_31_32/0.06)] backdrop-blur-xl"
    >
      <ul className="grid grid-cols-4 gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = activeHref === href;

          return (
            <li key={href}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-[var(--radius)] text-[11px] font-semibold transition-colors",
                  isActive
                    ? "bg-accent text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                href={href}
              >
                <Icon aria-hidden="true" className="size-5" strokeWidth={isActive ? 2.4 : 2} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
