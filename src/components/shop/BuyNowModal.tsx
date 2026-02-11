"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Drawer } from "vaul";
import { Product } from "./shop-data";
import {
    CloseIcon,
    ShoppingCartIcon,
    SuccessIcon,
    LocationIcon,
    EmailIcon,
    UserIcon,
    ArrowRightIcon,
    PlusIcon,
} from "@/components/icons";
import { submitOrder } from "@/server/actions/orders";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface BuyNowModalProps {
    product: Product;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BuyNowModal({ product, open, onOpenChange }: BuyNowModalProps) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        shipping: "MANILA",
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) {
                toast.error("File size must be less than 10MB");
                return;
            }
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const calculateTotal = () => {
        const base = parseInt(product.price.replace(/[^0-9]/g, ""));
        const shipping = formData.shipping === "JRS" ? 200 : 0;
        return base + shipping;
    };

    const handleSubmit = async () => {
        if (!file) {
            toast.error("Please upload proof of payment");
            return;
        }

        setIsSubmitting(true);
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("address", formData.address);
        data.append("shipping", formData.shipping === "MANILA" ? "Grab Express / Lalamove" : "JRS Express");
        data.append("productName", product.name);
        data.append("totalPrice", `₱${calculateTotal()}`);
        data.append("proof", file);

        try {
            const result = await submitOrder(data);
            if (result.success) {
                setStep(4);
                toast.success("Order submitted!");
                if (result.warning) {
                    console.warn(result.warning);
                }
            } else {
                toast.error(result.error || "Submission failed");
            }
        } catch (err) {
            toast.error("A server error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.name || !formData.email || !formData.phone || !formData.address) {
                toast.error("Please fill in all details");
                return;
            }
        }
        setStep(step + 1);
    };

    const reset = () => {
        setStep(1);
        setFile(null);
        setPreview(null);
        setFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
            shipping: "MANILA",
        });
        onOpenChange(false);
    };

    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[101] bg-[#0A0A08] border-t border-zinc-800 rounded-t-[2rem] outline-none max-h-[96vh] flex flex-col">
                    <div className="w-full max-w-2xl mx-auto flex flex-col h-full overflow-hidden">
                        {/* Drag Handle */}
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-800 mt-4 mb-2" />

                        <div className="px-6 pb-10 overflow-y-auto">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-8 pt-4">
                                <div>
                                    <h2 className="font-['Bebas_Neue'] text-4xl text-white tracking-tight">
                                        {step === 4 ? "ORDER CONFIRMED" : "SECURE YOUR DROP"}
                                    </h2>
                                    <p className="text-bodega-yellow font-mono text-xs uppercase tracking-widest mt-1">
                                        {step === 1 && "Step 1: Contact & Shipping"}
                                        {step === 2 && "Step 2: Payment Details"}
                                        {step === 3 && "Step 3: Verify Payment"}
                                        {step === 4 && "Receipt #BS-" + Math.random().toString(36).substr(2, 9).toUpperCase()}
                                    </p>
                                </div>
                                {step < 4 && (
                                    <button
                                        onClick={() => onOpenChange(false)}
                                        className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors"
                                    >
                                        <CloseIcon className="w-5 h-5 text-zinc-400" />
                                    </button>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Full Name</label>
                                                <div className="relative">
                                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                                    <input
                                                        type="text"
                                                        placeholder="Juan Dela Cruz"
                                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm py-3 pl-10 pr-4 text-white placeholder:text-zinc-700 focus:border-bodega-yellow outline-none transition-colors"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Email Address</label>
                                                <div className="relative">
                                                    <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                                    <input
                                                        type="email"
                                                        placeholder="juan@example.com"
                                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm py-3 pl-10 pr-4 text-white placeholder:text-zinc-700 focus:border-bodega-yellow outline-none transition-colors"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Contact Number</label>
                                            <input
                                                type="tel"
                                                placeholder="0917 XXX XXXX"
                                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm py-3 px-4 text-white placeholder:text-zinc-700 focus:border-bodega-yellow outline-none transition-colors"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Shipping Address</label>
                                            <textarea
                                                placeholder="House No, Street, Barangay, City, Province, Zip Code"
                                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm py-3 px-4 text-white placeholder:text-zinc-700 focus:border-bodega-yellow outline-none transition-colors min-h-[100px] resize-none"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Shipping Method</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                <label className={`flex items-start gap-4 p-4 border rounded-sm cursor-pointer transition-all ${formData.shipping === 'MANILA' ? 'bg-bodega-yellow/10 border-bodega-yellow' : 'bg-zinc-900/40 border-zinc-800'}`}>
                                                    <input
                                                        type="radio"
                                                        className="mt-1 accent-bodega-yellow"
                                                        checked={formData.shipping === 'MANILA'}
                                                        onChange={() => setFormData({ ...formData, shipping: 'MANILA' })}
                                                    />
                                                    <div>
                                                        <p className="text-sm font-bold text-white uppercase tracking-tight">Metro Manila</p>
                                                        <p className="text-xs text-zinc-500 mt-1">Grab Express / Lalamove (Fee shouldered by buyer)</p>
                                                    </div>
                                                </label>
                                                <label className={`flex items-start gap-4 p-4 border rounded-sm cursor-pointer transition-all ${formData.shipping === 'JRS' ? 'bg-bodega-yellow/10 border-bodega-yellow' : 'bg-zinc-900/40 border-zinc-800'}`}>
                                                    <input
                                                        type="radio"
                                                        className="mt-1 accent-bodega-yellow"
                                                        checked={formData.shipping === 'JRS'}
                                                        onChange={() => setFormData({ ...formData, shipping: 'JRS' })}
                                                    />
                                                    <div>
                                                        <p className="text-sm font-bold text-white uppercase tracking-tight">Outside Metro Manila (+₱200)</p>
                                                        <p className="text-xs text-zinc-500 mt-1">JRS Express / LBC</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <button
                                            onClick={nextStep}
                                            className="w-full py-4 bg-bodega-yellow text-black font-bold flex items-center justify-center gap-2 hover:bg-bodega-yellow-light transition-all rounded-sm group mt-4 px-6 uppercase tracking-widest"
                                        >
                                            Continue to Payment
                                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-sm text-center">
                                            <p className="text-zinc-400 text-sm mb-4">Scan the QR code below using your GCash app</p>
                                            <div className="relative w-64 h-64 mx-auto mb-6 bg-white p-2 rounded-lg">
                                                <Image
                                                    src="/images/qr-code/qr-code.jpg"
                                                    alt="GCash QR Code"
                                                    fill
                                                    className="object-contain p-2"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-white font-bold text-lg">BDG SOUND</p>
                                                <p className="text-zinc-500 font-mono text-sm">0917 557 ####</p>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-bodega-yellow/5 border border-bodega-yellow/20 rounded-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-zinc-500 text-xs uppercase font-bold tracking-widest">Order Total</span>
                                                <span className="text-bodega-yellow font-['Bebas_Neue'] text-2xl uppercase tracking-tighter">
                                                    {product.name} ({formData.shipping === 'JRS' ? 'Incl. Shipping' : 'Excl. Shipping'})
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <p className="text-zinc-400 text-xs max-w-[200px]">Please ensure the exact amount is paid to avoid delays.</p>
                                                <span className="text-white font-['Bebas_Neue'] text-5xl tracking-tighter">
                                                    ₱{calculateTotal()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setStep(1)}
                                                className="flex-1 py-4 border border-zinc-800 text-zinc-400 font-bold hover:bg-zinc-900 transition-all rounded-sm uppercase tracking-widest"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={nextStep}
                                                className="flex-[2] py-4 bg-bodega-yellow text-black font-bold flex items-center justify-center gap-2 hover:bg-bodega-yellow-light transition-all rounded-sm uppercase tracking-widest"
                                            >
                                                I've Prepared My Payment
                                                <ArrowRightIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Upload Screenshot of GCash Receipt</label>

                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`relative aspect-video rounded-sm border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-4 ${preview ? 'border-bodega-yellow bg-bodega-yellow/5' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'}`}
                                            >
                                                {preview ? (
                                                    <>
                                                        <Image src={preview} alt="Preview" fill className="object-contain p-4" />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <p className="text-white text-xs font-bold uppercase tracking-widest">Change Image</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="p-4 bg-zinc-800 rounded-full">
                                                            <PlusIcon className="w-8 h-8 text-zinc-500" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-white font-bold text-sm">CLICK TO UPLOAD RECEIPT</p>
                                                            <p className="text-zinc-500 text-[10px] mt-1 uppercase tracking-widest">PNG, JPG up to 10MB</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4 p-4 border border-zinc-800 bg-zinc-900/40 rounded-sm">
                                                <ShoppingCartIcon className="w-5 h-5 text-bodega-yellow mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-none mb-2">Order Review</p>
                                                    <p className="text-sm text-white font-medium">{product.name} (Qty: 1)</p>
                                                    <p className="text-xs text-zinc-400 mt-1">{formData.name} • {formData.email}</p>
                                                    <p className="text-xs text-zinc-500 mt-2 italic">Total to be confirmed: ₱{calculateTotal()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setStep(2)}
                                                disabled={isSubmitting}
                                                className="flex-1 py-4 border border-zinc-800 text-zinc-400 font-bold hover:bg-zinc-900 transition-all rounded-sm uppercase tracking-widest disabled:opacity-50"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={isSubmitting || !file}
                                                className="flex-[2] py-4 bg-bodega-yellow text-black font-bold flex items-center justify-center gap-2 hover:bg-bodega-yellow-light transition-all rounded-sm uppercase tracking-widest disabled:opacity-50"
                                            >
                                                {isSubmitting ? "Processing..." : "Submit Order"}
                                                {!isSubmitting && <ShoppingCartIcon className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12 space-y-6"
                                    >
                                        <div className="w-24 h-24 bg-bodega-yellow rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(229,255,0,0.2)]">
                                            <SuccessIcon className="w-12 h-12 text-black" />
                                        </div>

                                        <div>
                                            <h3 className="font-['Bebas_Neue'] text-5xl text-white tracking-tight mb-2 uppercase">Order Received!</h3>
                                            <p className="text-zinc-400 max-w-sm mx-auto">
                                                We've logged your request. Our team will verify the payment and reach out via email for shipping updates.
                                            </p>
                                        </div>

                                        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-sm max-w-sm mx-auto text-left space-y-3">
                                            <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                                                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Customer</span>
                                                <span className="text-white text-xs font-medium">{formData.name}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                                                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Item</span>
                                                <span className="text-white text-xs font-medium">{product.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-bodega-yellow text-[10px] font-bold uppercase tracking-widest">Amount Paid</span>
                                                <span className="text-bodega-yellow text-xs font-bold">₱{calculateTotal()}</span>
                                            </div>
                                        </div>

                                        <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.2em] pt-8">
                                            Thank you for being part of the collective.
                                        </p>

                                        <button
                                            onClick={reset}
                                            className="w-full py-4 border border-zinc-800 text-white font-bold hover:bg-zinc-900 transition-all rounded-sm uppercase tracking-widest mt-8"
                                        >
                                            Close and return to shop
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
