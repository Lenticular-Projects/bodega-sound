import type { Metadata } from "next";
import { LinksPageContent } from "@/components/links/LinksPageContent";

export const metadata: Metadata = {
    title: "Links | Bodega Sound",
    description: "All Bodega Sound links in one place. YouTube sets, merch, socials, and more.",
    openGraph: {
        title: "Links | Bodega Sound",
        description: "All Bodega Sound links in one place.",
    },
};

export default function LinksPage() {
    return <LinksPageContent />;
}
