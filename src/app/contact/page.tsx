import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
    title: "Contact | Bodega Sound",
    description: "Reach out for bookings, collaborations, or general inquiries. Manila's underground dance music collective.",
    openGraph: {
        title: "Contact | Bodega Sound",
        description: "Reach out for bookings, collaborations, or general inquiries.",
    },
};

export default function ContactPage() {
    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <h1 className="font-display text-5xl sm:text-7xl md:text-9xl text-zinc-900 dark:text-white tracking-tight mb-8 transition-colors duration-300">
                CONTACT
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start mt-16">
                <div className="space-y-8">
                    <p className="text-2xl text-zinc-800 dark:text-warm-200 leading-relaxed font-light transition-colors duration-300">
                        Reach out for bookings, collaborations, or general inquiries. We are always listening.
                    </p>
                    <div className="space-y-4">
                        <div className="block">
                            <span className="text-sm font-mono tracking-widest text-zinc-500 dark:text-warm-500 uppercase block mb-1">Location</span>
                            <span className="text-xl text-zinc-900 dark:text-warm-100">Manila, Philippines</span>
                        </div>
                        <div className="block">
                            <span className="text-sm font-mono tracking-widest text-zinc-500 dark:text-warm-500 uppercase block mb-1">Email</span>
                            <span className="text-xl text-zinc-900 dark:text-warm-100">hello@bodegasound.ph</span>
                        </div>
                        <div className="block">
                            <span className="text-sm font-mono tracking-widest text-zinc-500 dark:text-warm-500 uppercase block mb-1">Socials</span>
                            <div className="flex gap-4 text-zinc-900 dark:text-warm-100">
                                <a href="#" className="hover:text-bodega-yellow transition-colors">Instagram</a>
                                <a href="#" className="hover:text-bodega-yellow transition-colors">Facebook</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-50 dark:bg-warm-900/10 p-4 md:p-8 rounded-sm border border-zinc-200 dark:border-warm-800/50">
                    <ContactForm />
                </div>
            </div>
        </div>
    );
}
