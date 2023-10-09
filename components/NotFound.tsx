import Link from "next/link";

export default function NotFoundComponent() {
  return (
    <>
      <h2 className="text-3xl font-bold mb-4">404 Not Found</h2>
      <p className="text-xl mb-4">
        요청한 리소스가 존재하지 않거나, 해당 리소스에 접근할 권한이 없습니다.
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        메인 페이지로 돌아가기
      </Link>
    </>
  );
}
