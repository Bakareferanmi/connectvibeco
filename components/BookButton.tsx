"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useBooking } from "@/lib/useBooking";
import { useToast } from "@/lib/toast-context";
import BookModal from "@/components/BookModal";

interface BookButtonProps {
  id: string;
  title: string;
  meta: string;
  price: string;
  maxQty?: number;
  label?: string;
}

export default function BookButton({ id, title, meta, price, maxQty, label = "Book spot" }: BookButtonProps) {
  const { user } = useAuth();
  const { booked, book } = useBooking(id);
  const { showToast } = useToast();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  function handleClick() {
    if (!user) {
      showToast("Sign in to book your spot");
      router.push("/login");
      return;
    }
    if (booked) return;
    setModalOpen(true);
  }

  function handleConfirmed() {
    book();
    showToast("You're booked! Check your email for details.");
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={booked}
        className={`flex items-center gap-2 text-[14px] font-medium px-6 py-3 rounded-full transition-colors ${
          booked ? "bg-white/10 text-white/50 cursor-default" : "bg-white text-black hover:bg-white/90"
        }`}
      >
        {booked && <Check className="w-4 h-4" />}
        {booked ? "Booked" : label}
      </button>

      {modalOpen && (
        <BookModal
          title={title}
          meta={meta}
          price={price}
          maxQty={maxQty}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmed}
        />
      )}
    </>
  );
}
