import { redirect } from "next/navigation";

export default function RootHomePage(): never {
  redirect("/login");
}
