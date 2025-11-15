"use client";
import { useState } from "react";
import Image from "next/image";

const galleryRows = [
    [
        "/opiGo/opiGo1.png",
        "/opiGo/opiGo2.png",
        "/opiGo/opiGo3.png",
        "/opiGo/opiGo4.png",
        "/opiGo/opiGo5.png",
    ],
    [
        "/by.U/byU1.png",
        "/by.U/byU2.png",
        "/by.U/byU3.png",
        "/by.U/byU4.png",
        "/by.U/byU5.png",
    ],
    [
        "/images/app1.png",
        "/images/app2.png",
        "/images/app3.png",
        "/images/app4.png",
    ],
];

export default function MediaGallery() {
    const [selected, setSelected] = useState(null);

    return (
        <section className="py-16  text-white overflow-hidden">
            <h2 className="text-center text-4xl font-extrabold mb-10 tracking-wide">
                ✦ Media Gallery ✦
            </h2>

            <div className="flex flex-col gap-12 items-center">
                {galleryRows.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className={`flex gap-6 overflow-x-auto scrollbar-hide py-2 px-4 animate-scroll-${
                            rowIndex + 1
                        }`}
                    >
                        {row.map((src:any, i) => (
                            <div
                                key={i}
                                className="relative min-w-[180px] h-[180px]  md:h-[240px] rounded-2xl overflow-hidden cursor-pointer group"
                                onClick={() => setSelected(src)}
                            >
                                <Image
                                    src={src}
                                    alt={`Media ${i}`}
                                    fill
                                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center text-center p-3 text-sm font-semibold">
                                    {/*Click to Preview*/}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selected && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelected(null)}
                >
                    <div className="relative w-full max-w-4xl">
                        <Image
                            src={selected}
                            alt="Preview"
                            width={1200}
                            height={800}
                            className="rounded-2xl w-full h-auto object-contain"
                        />
                        <button
                            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white text-lg px-3 py-1 rounded-full"
                            onClick={() => setSelected(null)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Auto-scroll animations */}
            <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        //.animate-scroll-1 {
        //  animation: scroll-left 60s linear infinite;
        //}
        //.animate-scroll-2 {
        //  animation: scroll-left 80s linear infinite reverse;
        //}
        //.animate-scroll-3 {
        //  animation: scroll-left 70s linear infinite;
        //}

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </section>
    );
}
