import type { Metadata } from "next";
import { ShopPageContent } from "@/components/shop/ShopPageContent";

export const metadata: Metadata = {
    title: "Shop | Bodega Sound",
    description: "Official Bodega Sound merchandise. Limited drops. Global shipping. Represent the collective.",
    openGraph: {
        title: "Shop | Bodega Sound",
        description: "Official merchandise. Limited drops. Global shipping.",
    },
};

export default function ShopPage() {
    return <ShopPageContent />;
}
