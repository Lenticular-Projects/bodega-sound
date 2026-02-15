import type { Metadata } from "next";
import { ArchivePageContent } from "@/components/archive/ArchivePageContent";

export const metadata: Metadata = {
    title: "Archive | Bodega Sound",
    description: "A visual history of our gatherings. Relive the nights that defined Manila's underground dance music scene.",
    openGraph: {
        title: "Archive | Bodega Sound",
        description: "A visual history of our gatherings.",
    },
};

export default function ArchivePage() {
    return <ArchivePageContent />;
}
