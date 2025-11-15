"use client";

import React, { useRef, useEffect, useState } from "react";

const skills = [
    { name: "React", logo: "/logos/react-js.png" },
    { name: "React Native", logo: "/logos/React-native.png" },
    { name: "Next.js", logo: "/logos/next-js.png" },
    { name: "Node.js", logo: "/logos/node.js.png" },
    { name: "TypeScript", logo: "/logos/TypeScript.png" },
    { name: "JavaScript", logo: "/logos/JavaScript.png" },
    { name: "TailwindCSS", logo: "/logos/tailwind.png" },
    { name: "MongoDB", logo: "/logos/mongodb.png" },
    { name: "Firebase", logo: "/logos/firebase.png" },
];

export default function FloatingSkills() {
    const containerRef = useRef(null);
    const [positions, setPositions] = useState<any>([]);

    useEffect(() => {
        const container:any = containerRef.current;
        if (!container) return;

        const w = container.clientWidth;
        const h = container.clientHeight;

        // Initial positions + random velocity
        const initial = skills.map(() => ({
            x: Math.random() * (w - 80),
            y: Math.random() * (h - 80),
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            paused: false,
        }));

        setPositions(initial);

        let id:any;
        const animate = () => {
            setPositions((prev:any) =>
                prev.map((p:any) => {
                    if (p.paused) return p;

                    let nx = p.x + p.vx;
                    let ny = p.y + p.vy;

                    if (nx <= 0 || nx >= w - 80) p.vx *= -1;
                    if (ny <= 0 || ny >= h - 80) p.vy *= -1;

                    return {
                        ...p,
                        x: Math.min(Math.max(nx, 0), w - 80),
                        y: Math.min(Math.max(ny, 0), h - 80),
                    };
                })
            );

            id = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(id);
    }, []);

    const togglePause = (i:any, pause:any) => {
        setPositions((prev: any) => {
            const arr = [...prev];
            arr[i].paused = pause;
            return arr;
        });
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[420px] rounded-xl bg-yellow-950/10 overflow-hidden border border-white/10 shadow-xl"
        >
            {positions.length > 0 &&
                skills.map((skill, i) => (
                    <div
                        key={i}
                        onMouseEnter={() => togglePause(i, true)}
                        onMouseLeave={() => togglePause(i, false)}
                        className="absolute transition-transform duration-300"
                        style={{
                            left: positions[i]?.x,
                            top: positions[i]?.y,
                            width: 80,
                            height: 80,
                        }}
                    >
                        <div
                            className="w-full h-full rounded-full flex items-center justify-center
              bg-white/10 backdrop-blur-md border border-white/20
              shadow-[0_0_20px_rgba(255,255,255,0.25)]
              hover:scale-125 hover:shadow-[0_0_35px_rgba(255,255,255,0.6)]
              transition-all cursor-pointer"
                        >
                            <img
                                src={skill.logo}
                                alt={skill.name}
                                className="w-10 h-10 object-contain pointer-events-none"
                            />
                        </div>
                    </div>
                ))}
        </div>
    );
}
