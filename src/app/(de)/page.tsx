import { de } from "@/content/de";
import { HomePage } from "@/components/site/HomePage";

export default function Page() {
  return <HomePage dict={de} alternateHref="/en/" />;
}
