import { WifiOff } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col items-center justify-center gap-5 bg-white p-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-[var(--radius)] bg-accent text-primary">
        <WifiOff aria-hidden="true" className="size-8" />
      </span>
      <div>
        <h1 className="text-2xl font-bold">인터넷 연결을 확인해 주세요</h1>
        <p className="mt-2 leading-7 text-muted-foreground">
          실시간 잔여면과 도착 시간 추천은 인터넷 연결이 필요해요. 연결 후 다시 확인해 주세요.
        </p>
      </div>
      <Link className={cn(buttonVariants({ size: "lg" }), "mt-2 w-full")} href="/">
        홈으로 돌아가기
      </Link>
    </main>
  );
}
