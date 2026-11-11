import { LoadingBlock } from "@/components/ui/HexLoader";

// Shown inside the admin shell while a page's data loads
export default function Loading() {
  return <LoadingBlock caption="Memuat data" className="min-h-[50dvh]" />;
}
