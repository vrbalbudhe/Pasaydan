"use client";
import Image from "next/image";
import com from "@/assets/Community/11.jpg";

export default function Community() {
  return (
    <div className="w-full min-h-screen relative">
      <div className="w-full h-screen relative">
        <Image
          className="object-contain"
          src={com}
          alt="Community event"
          layout="fill"
        />
        {/* Text appearing on top */}
        <p className="absolute top-20 left-10 text-slate-800 text-5xl font-bold opacity-0 animate-fadeIn z-10">
          Join our Community
        </p>
        <p className="absolute top-2 left-10 text-slate-800 text-xl font-bold opacity-0 animate-fadeIn z-10">
          Pasaydan
        </p>
      </div>
      <p className="text-slate-800">This is the community page</p>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
