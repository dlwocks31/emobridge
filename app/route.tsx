import { redirect } from "next/navigation";

export function GET(request: Request): never {
  redirect("/feedbacker/course");
}
