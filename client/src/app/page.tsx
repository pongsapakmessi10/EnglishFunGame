import { Suspense } from "react";
import { MenuView } from "@/components/views/MenuView";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <MenuView />
    </Suspense>
  );
}
