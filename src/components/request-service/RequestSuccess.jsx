import { Check, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function RequestSuccess({ firstName, preferredContact }) {
  return (
    <div className="mx-auto max-w-2xl py-10 text-center md:py-16">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5E9]">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2E7D32]">
          <Check className="h-5 w-5 text-white" />
        </div>
      </div>

      <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
        Request Received
      </p>

      <h2 className="mt-3 font-heading text-3xl leading-tight text-[#1A1A1A] md:text-4xl">
        Thanks
        {firstName ? `, ${firstName}` : ""}!
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#1A1A1A]/60 md:text-base">
        We've received your cleaning request. Our team will review the details
        and get in touch with you soon
        {preferredContact
          ? ` via ${formatContactMethod(preferredContact)}`
          : ""}
        .
      </p>

      <div className="mx-auto mt-7 max-w-lg rounded-2xl border border-[#2E7D32]/10 bg-[#E8F5E9]/50 p-5">
        <p className="text-sm font-semibold text-[#1A1A1A]">
          What happens next?
        </p>

        <p className="mt-2 text-sm leading-relaxed text-[#1A1A1A]/55">
          We'll review your request, confirm availability and discuss any final
          details with you before your cleaning is booked.
        </p>
      </div>

      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-[#2E7D32] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#256b29] hover:shadow-lg hover:shadow-[#2E7D32]/20"
        >
          <Home className="h-4 w-4" />
          Back to MG Cleaning
        </Link>
      </div>

      <p className="mt-5 text-xs text-[#1A1A1A]/40">
        Your request has been sent successfully.
      </p>
    </div>
  );
}

function formatContactMethod(method) {
  const labels = {
    whatsapp: "WhatsApp",
    phone: "phone",
    email: "email",
  };

  return labels[method] || method;
}
