import { en } from "@/content/en";
import { HomePage } from "@/components/site/HomePage";

export default function Page() {
  return <HomePage dict={en} alternateHref="/" />;
}
