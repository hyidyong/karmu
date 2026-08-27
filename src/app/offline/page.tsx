import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col justify-center gap-4 bg-white p-6">
      <h1 className="text-2xl font-bold">인터넷 연결을 확인해 주세요</h1>
      <p className="text-muted-foreground leading-7">
        실시간 주차 정보와 도착 시간 추천은 인터넷 연결이 필요해요.
      </p>
      <Link className="bg-primary text-primary-foreground mt-4 min-h-12 rounded-[var(--radius)] px-5 py-3 text-center font-semibold" href="/">
        홈으로 돌아가기
      </Link>
    </main>
  );
}
