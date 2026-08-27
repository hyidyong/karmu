import { MapPinOff } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col items-center justify-center gap-5 bg-white px-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-[var(--radius)] bg-accent text-primary">
        <MapPinOff aria-hidden="true" className="size-8" />
      </span>
      <div>
        <h1 className="text-2xl font-bold">주차장을 찾지 못했어요</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          주소가 바뀌었거나 더 이상 제공하지 않는 정보일 수 있어요.
        </p>
      </div>
      <Link className={cn(buttonVariants(), "mt-2")} href="/">
        홈으로 돌아가기
      </Link>
    </main>
  );
}
