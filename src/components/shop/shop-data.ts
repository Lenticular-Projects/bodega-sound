export interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    description: string;
    orderLink: string;
}

export const products: Product[] = [
    {
        id: "tshirt-bodega",
        name: "BODEGA T-SHIRT",
        price: "₱695",
        image: "/images/merch/tshirt-bodega.png",
        description:
            "Official Bodega Sound tee. 100% cotton. Black with yellow logo.",
        orderLink: "https://docs.google.com/forms/d/e/1FAIpQLSc2_2cFW-ez1vLFV6QJi7Z-RPTxYzeHltWE1BxZyFAtRoOCWQ/viewform",
    },
    {
        id: "tshirt-miles",
        name: "MILES MEDINA TEE",
        price: "₱895",
        image: "/images/merch/tshirt-miles.png",
        description: "Limited edition Miles Medina Live in Manila tee. 2026 Official Merch.",
        orderLink: "https://docs.google.com/forms/d/e/1FAIpQLSeDm_1NaY6prQv3Qe7KMbBLk7yxy9cJTqcILSdXeUfSw1Gqdg/viewform",
    },
    {
        id: "keychain",
        name: "BODEGA KEYCHAIN",
        price: "₱250",
        image: "/images/merch/keychain.png",
        description: "Premium metal keychain with enamel fill. Yellow on black.",
        orderLink: "https://docs.google.com/forms/d/e/1FAIpQLSc2_2cFW-ez1vLFV6QJi7Z-RPTxYzeHltWE1BxZyFAtRoOCWQ/viewform",
    },
    {
        id: "tote-bag",
        name: "TOTE BAG",
        price: "₱495",
        image: "/images/merch/tote-bag.png",
        description: "Canvas tote bag. Perfect for records and essentials.",
        orderLink: "https://docs.google.com/forms/d/e/1FAIpQLSc2_2cFW-ez1vLFV6QJi7Z-RPTxYzeHltWE1BxZyFAtRoOCWQ/viewform",
    },
];
