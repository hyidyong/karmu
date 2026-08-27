import type { ReactNode } from "react";

type PageFrameProps = {
  children: ReactNode;
};

export function PageFrame({ children }: PageFrameProps) {
  return (
    <main className="flex flex-col gap-8 px-5 pb-32 pt-5">
      {children}
    </main>
  );
}
