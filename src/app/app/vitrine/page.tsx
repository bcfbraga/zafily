import { Topbar } from "@/components/zafily/Topbar";

export default function VitrinePage() {
  return (
    <>
      <Topbar title="Minha Vitrine" description="Em construção" />
      <main className="flex-1 overflow-y-auto scrollbar-hidden px-8 py-7" />
    </>
  );
}
