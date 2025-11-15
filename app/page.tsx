"use client";

import React, { useEffect } from "react";
import MediaGallery from "@/app/component/MediaGallery";
import {Download} from "lucide-react";
import FloatingSkills from "@/app/component/FloatingSkills";
interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
}
export default function Home() {
    useEffect(() => {
        // THEME TOGGLE + PERSISTENCE
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);

        const themeBtn = document.getElementById('themeBtn');
        const handleThemeClick = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        };
        if (themeBtn) themeBtn.addEventListener('click', handleThemeClick);

        // About Me static role
        const greeting = document.getElementById('greeting');
        if (greeting) greeting.innerHTML =
            "Software Developer | Mobile App Development | React Native | React.js | Node.js | Full-Stack | 2+ Years Experience";

        // SCROLL PROGRESS
        const progress = document.getElementById('progress');
        const setProgress = () => {
            const doc = document.documentElement;
            const scrollTop = doc.scrollTop;
            const height = doc.scrollHeight - doc.clientHeight;
            if (progress) progress.style.width = (height ? (scrollTop / height) * 100 : 0) + '%';
        };
        window.addEventListener('scroll', setProgress, { passive: true });
        window.addEventListener('resize', setProgress);
        setProgress();

        // INTERSECTION OBSERVER REVEALS
        const io = new window.IntersectionObserver((entries) => {
            entries.forEach(e => e.isIntersecting && e.target.classList.add('in'));
        }, { threshold: 0.12 });
        document.querySelectorAll('.reveal').forEach(el => io.observe(el));

        // 3D CARD TILT + LIGHT
        const calcTilt = (el: any, e: any) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            const rx = (y - 0.5) * -10;
            const ry = (x - 0.5) * 10;
            el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
            el.style.background = `radial-gradient(160px 120px at ${x * 100}% ${y * 100}%, hsl(var(--brand)/.20), transparent 60%), linear-gradient(180deg, hsl(var(--card)/.9), hsl(var(--card)/.85))`;
        };
        const resetTilt = (el: any) => {
            el.style.transform = '';
            el.style.background = '';
        };
        document.querySelectorAll('.tilt').forEach(card => {
            card.addEventListener('mousemove', (e) => calcTilt(card, e));
            card.addEventListener('mouseleave', () => resetTilt(card));
        });

        // MAGNETIC BUTTONS
        document.querySelectorAll('.magnet').forEach(m => {
            const el = m as HTMLElement; // assert as HTMLElement
            const strength = 20;
            el.addEventListener('mousemove', (e: MouseEvent) => {
                const r = el.getBoundingClientRect();
                const x = e.clientX - (r.left + r.width / 2);
                const y = e.clientY - (r.top + r.height / 2);
                el.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
            });
            el.addEventListener('mouseleave', () => { el.style.transform = ''; });
        });

        // CUSTOM CURSOR
        const dot = document.getElementById('cursorDot');
        const ring = document.getElementById('cursorRing');
        let mx = innerWidth / 2, my = innerHeight / 2;
        let dx = mx, dy = my;
        let rx = mx, ry = my;
        const moveCursor = (e: any) => { mx = e.clientX; my = e.clientY; };
        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', () => ring && (ring.style.transform = 'scale(0.9)'));
        window.addEventListener('mouseup', () => ring && (ring.style.transform = ''));
        function animateCursor() {
            dx += (mx - dx) * 0.35;
            dy += (my - dy) * 0.35;
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            if (dot) dot.style.transform = `translate(${dx - 3}px, ${dy - 3}px)`;
            if (ring) {
                ring.style.left = (rx - 18) + 'px';
                ring.style.top = (ry - 18) + 'px';
            }
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
        if (isTouch && dot && ring) { dot.style.display = ring.style.display = 'none'; }

        // CANVAS PARTICLE FIELD
        const canvas: any = document.getElementById('bg-canvas') as HTMLCanvasElement | null;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let particles: Particle[]  = [];
            let parallax = { x: 0, y: 0 };
            function resize() {
                let dpr = Math.min(2, window.devicePixelRatio || 1);
                canvas.width = innerWidth * dpr;
                canvas.height = innerHeight * dpr;
                canvas.style.width = innerWidth + 'px';
                canvas.style.height = innerHeight + 'px';
                if (ctx) {
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.scale(dpr, dpr);
                }
            }
            function makeParticles(count = 120) {
                particles = Array.from({ length: count }, () => ({
                    x: Math.random() * innerWidth,
                    y: Math.random() * innerHeight,
                    vx: (Math.random() - 0.5) * 0.6,
                    vy: (Math.random() - 0.5) * 0.6,
                    r: Math.random() * 1.6 + 0.4
                }));
            }
            function step() {
                if (!ctx) return;
                ctx.clearRect(0, 0, innerWidth, innerHeight);
                ctx.save();
                ctx.globalAlpha = 0.9;
                const g = ctx.createRadialGradient(innerWidth * 0.8, innerHeight * 0.2, 20, innerWidth * 0.5, innerHeight * 0.8, Math.max(innerWidth, innerHeight));
                g.addColorStop(0, 'hsla(200,100%,60%,.06)');
                g.addColorStop(1, 'hsla(200,100%,60%,0)');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, innerWidth, innerHeight);
                ctx.globalCompositeOperation = 'lighter';
                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    p.x += p.vx + parallax.x * 0.02;
                    p.y += p.vy + parallax.y * 0.02;
                    if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
                    if (p.y < 0 || p.y > innerHeight) p.vy *= -1;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = 'hsla(200,100%,60%,.15)';
                    ctx.fill();
                }
                ctx.lineWidth = 1;
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const a = particles[i], b = particles[j];
                        const dx = a.x - b.x; const dy = a.y - b.y; const dist = Math.hypot(dx, dy);
                        if (dist < 100) {
                            ctx.strokeStyle = `hsla(${200 + (dist / 100) * 80}, 100%, 60%, ${0.08 * (1 - dist / 100)})`;
                            ctx.beginPath();
                            ctx.moveTo(a.x, a.y);
                            ctx.lineTo(b.x, b.y);
                            ctx.stroke();
                        }
                    }
                }
                ctx.restore();
                requestAnimationFrame(step);
            }
            window.addEventListener('resize', resize);
            window.addEventListener('mousemove', (e) => {
                const x = (e.clientX / innerWidth) - 0.5;
                const y = (e.clientY / innerHeight) - 0.5;
                parallax.x = x * 10; parallax.y = y * 10;
            });
            resize();
            makeParticles(matchMedia('(prefers-reduced-motion: reduce)').matches ? 40 : 120);
            step();
        }

        // BTN ANIMATION: scroll to Projects, burst
        const projectsBtn = document.querySelector('a[href="#projects"]');
        if (projectsBtn) {
            projectsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const burst = document.createElement('div');
                burst.style.position = 'fixed';
                burst.style.inset = '0';
                burst.style.pointerEvents = 'none';
                burst.style.background = 'radial-gradient(400px 400px at 50% 50%, hsla(292,84%,56%,.25), transparent 60%)';
                burst.style.animation = 'fade .8s ease-out';
                document.body.appendChild(burst);
                setTimeout(() => burst.remove(), 800);
                const style = document.createElement('style');
                style.textContent = `@keyframes fade{from{opacity:1}to{opacity:0}}`;
                document.head.appendChild(style);
                const projects = document.getElementById('projects');
                if (projects) projects.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        // Cleanup
        return () => {
            if (themeBtn) themeBtn.removeEventListener('click', handleThemeClick);
            window.removeEventListener('scroll', setProgress);
            window.removeEventListener('resize', setProgress);
        };
    }, []);
return (
    <>
      <head>
        <title>Nirmal Ranpariya ✦ Full-Stack Software Developer Portfolio</title>
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="description" content="Nirmal Ranpariya | Full-Stack Software Developer (React Native, React.js, Node.js). 2+ years of crafting high-performance, scalable applications." />
        {/* No need for charset or viewport, Next.js injects automatically */}
      </head>
      <div className="bg-gradient" aria-hidden="true"></div>
      <canvas id="bg-canvas" aria-hidden="true"></canvas>
      {/* SVG noise overlay */}
      <svg className="noise" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"></feTurbulence>
          <feColorMatrix type="saturate" values="0"></feColorMatrix>
        </filter>
        <rect width="100" height="100" filter="url(#noiseFilter)" opacity="1"></rect>
      </svg>
      <div className="progress" id="progress"></div>

      {/* Gooey SVG filter */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -12" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Custom Cursor */}
      <div className="cursor-dot" id="cursorDot"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      <header className="wrap"
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px",
          paddingBlock: "12px", position: "sticky", top: 8, zIndex: 10,
          backdropFilter: "blur(10px)", borderRadius: "9999px", background: "hsl(var(--bg)/.45)",
          border: "1px solid hsl(var(--text)/.06)"
        }}>
        <div style={{
          fontWeight: 800, letterSpacing: "-.02em", display: "flex",
          alignItems: "center", gap: 12
        }}>
          <img src="/profile.jpeg"
            alt="Nirmal Ranpariya Headshot"
            style={{
              width: 32, height: 32, borderRadius: "50%", objectFit: "cover",
              border: "2px solid hsl(var(--brand))"
            }} />
          ⚡ Nirmal Ranpariya
        </div>
        <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="btn" id="themeBtn" aria-label="Toggle theme">Toggle Theme</button>
          <a className="btn primary magnet" href="#contact">Get in Touch</a>
        </nav>
      </header>

      <main>
        <section className="hero section wrap">
          <div className="hero-image reveal in">
            <img src="/profile.jpeg"
              alt="Nirmal Ranpariya Profile Photo" />
          </div>
          <div className="hero-content reveal in">
            <h1>Nirmal <span
              style={{
                background: "linear-gradient(90deg,hsl(var(--brand)),hsl(var(--brand-2)))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent"
              }}>Ranpariya</span>
            </h1>
            <p className="muted" id="greeting"></p>
            <div className="cta goo">
              <a className="btn primary magnet" href="#projects">View Projects ✦</a>
              <a className="btn magnet" href="#skills">My Core Skills</a>
            </div>
          </div>
        </section>

        <section id="skills" className="section wrap">
          <div className="marquee muted" aria-hidden="true">
            <span>
              <b>React Native</b> <b>React.js</b> <b>Node.js</b> <b>MongoDB</b> <b>Firebase</b> <b>Full-Stack</b>
              <b>CI/CD</b> <b>Tailwind CSS</b> <b>Performance</b> <b>AWS</b> <b>React Native</b> <b>React.js</b>
              <b>Node.js</b> <b>MongoDB</b> <b>Firebase</b> <b>Full-Stack</b> <b>CI/CD</b> <b>Tailwind CSS</b>
              <b>Performance</b> <b>AWS</b>
            </span>
          </div>
          <h2 className="reveal" style={{ textAlign: "center", fontSize: "var(--subtitle)", marginBottom: "var(--gap)" }}>
            Core Skills & Expertise
          </h2>
            <FloatingSkills/>
          <div className="grid" style={{ marginTop: "var(--gap)" }}>
            <article className="card tilt reveal">
                <img
                    alt={'Mobile App Development'}
                    src="https://static.tildacdn.com/tild3730-3836-4333-b738-333762396635/1709507970_smartphon.jpg"
                    className='card-img'
                />
                <h3>Mobile App Development</h3>
              <p>React Native, performance optimization, and seamless deployment on both Android & iOS platforms.</p>
            </article>
            <article className="card tilt reveal">
                <img
                    alt={'Web Development (Frontend)'}
                    src="https://www.simplilearn.com/ice9/free_resources_article_thumb/full_front_back.jpg"
                    className='card-img'
                />
              <h3>Web Development (Frontend)</h3>
              <p>React.js, crafting responsive, animated UIs with a focus on exceptional UX design using Tailwind CSS.</p>
            </article>
            <article className="card tilt reveal">
                <img
                    alt={'Backend & API Services'}
                    src="https://miro.medium.com/v2/resize:fit:1200/1*ee5Xp-vKG6kcMCO_JDZmmQ.png"
                    className='card-img'
                />
              <h3>Backend & API Services</h3>
              <p>Node.js, building robust REST APIs with Express.js , foundational knowledge in AWS and cloud architecture.</p>
            </article>
            <article className="card tilt reveal">
                <img
                    alt={'Cloud & Databases'}
                    src="https://cdn.dribbble.com/users/3859449/screenshots/9191591/sql_query_optimization.jpg"
                    className='card-img'
                />
              <h3>Cloud & Databases</h3>
              <p>Specialist in Firebase (Realtime DB, Firestore, Auth), and skilled in MongoDB and SQL/NoSQL fundamentals.</p>
            </article>
            <article className="card tilt reveal">
                <img
                    alt={'Version Control & DevOps'}
                    src="https://miro.medium.com/v2/resize:fit:1200/1*lp8r5b4o-zryHxdKHynlyw.png"
                    className='card-img'
                />
              <h3>Version Control & DevOps</h3>
              <p>Proficient with Git , GitHub , and GitLab . Basic understanding and implementation of CI/CD pipelines.</p>
            </article>
            <article className="card tilt reveal">
                <img
                    alt={'Design & Multimedia'}
                    src="https://prezibase.com/wp-content/uploads/2018/08/creative-abstract-3d-design-agency-multimedia-presentation-template-for-prezi-and-powerpoint-Slide1-4.jpg"
                    className='card-img'
                />
              <h3>Design & Multimedia</h3>
              <p>Creating compelling promotional content using Photoshop, After Effects, and Canva to enhance product visibility.</p>
            </article>
          </div>
        </section>

        <section id="projects" className="section wrap">
          <h2 className="reveal" style={{ textAlign: "center", fontSize: "var(--subtitle)", marginBottom: "var(--gap)" }}>
            Selected Projects
          </h2>
          <div className="gallery">
            <a className="tile reveal" href="https://opigo.in" target="_blank" rel="noopener">
              <div className="shine"></div>
              <div className="tile-content">
                <h3 className="pb-3 font-serif font-bold text-blue-400">OPIGO 📈</h3>
                  <img
                      alt={'Version Control & DevOps'}
                      src="/opiGo/opigo-starter.jpeg"
                      className='card-img'
                  />
                <p className="tech mt-5">React Native, Node.js, Realtime Data Access, Stocks Charts, Firebase.</p>
                <p className="role">OpiGo is a Mumbai-based, social stock trading platform that allows users to get investment advice from SEBI-registered experts. Founded in 2021, the company offers a gamified community, polls, expert advisory, and reward systems to help traders and investors with their decisions. The company plans to use its funding to improve user experience, grow its user base, and add a new advisory vertical. The founder also intends to raise additional funds in the first quarter of FY26.</p>
              </div>
            </a>
            <a className="tile reveal" href="https://byu.id" target="_blank" rel="noopener">
              <div className="shine"></div>
              <div className="tile-content">
                <h3 className="pb-3 font-serif font-bold text-sky-400" >by.U App (Telkomsel) 📶</h3>
                  <img
                      alt={'Version Control & DevOps'}
                      src="/by.U/byU-starter.png"
                      className='card-img'
                  />
                <p className="tech mt-5">React Native, Firebase, Node.js, Realtime Location, Best Ui.</p>
                <p className="role">The name "by.U" signifies "by you," emphasizing user choice and personalization of services. By.u is an all-digital mobile network provider in Indonesia, owned by Telkomsel. It is an MVNO (Mobile Virtual Network Operator) which means it uses the network infrastructure of its parent company, Telkomsel, but manages its own services, branding, and customer experience through a dedicated mobile application. The service offers various exciting promos and loyalty gifts for its users.</p>
              </div>
            </a>
            <a className="tile reveal" href="https://github.com/NirmalTechDev/catChat" target="_blank" rel="noopener">
              <div className="shine"></div>
              <div className="tile-content">
                <h3 className='pb-3 font-serif font-bold text-orange-400' >catChat (In Dev) 🐈‍⬛</h3>
                  <img
                      alt={'Version Control & DevOps'}
                      src="/catChat.png"
                      className='card-img'
                  />
                <p className="tech mt-5">React Native, Node.js, AWS, Firebase, Sockets, Camera features.</p>
                <p className="role">Catchat is the all-in-one platform where you can Connect, Chat, Shop, and Create. From scrolling your social feed and chatting with friends to discovering marketplace deals and filming quick reels—everything you need is right here.</p>
              </div>
            </a>
            <div className="tile reveal" style={{ gridColumn: "span 3" }}>
              <div className="shine"></div>
              <div className="tile-content">
                <h3>Project Video Showcase</h3>
                <p className="muted">Add a captivating project video or animated demo here to impress clients.</p>
              </div>
            </div>
            <div className="tile reveal">
              <div className="shine"></div>
                <div className="flex grid-cols-2 md:grid-cols-3 gap-4">
                    <img
                        alt={'Version Control & DevOps'}
                        src="https://icon-library.com/images/software-icon-png/software-icon-png-10.jpg"
                        className='card-img'
                        style={{ height:150, width:150 }}
                    />
                  <div className="tile-content flex items-center">
                      <p className="text-4xl font-extrabold">2+ Years</p>
                  </div>
                </div>
                <p className="muted flex px-10 pb-5">Professional experience in delivering scalable software solutions.</p>
            </div>
          </div>
        </section>

          {/*<MediaGallery/>*/}

        {/*<section id="media-gallery" className="section wrap">*/}
        {/*  <h2 className="reveal" style={{ textAlign: "center", fontSize: "var(--subtitle)", marginBottom: "var(--gap)" }}>*/}
        {/*    Media Gallery*/}
        {/*  </h2>*/}
        {/*  <div className="gallery">*/}
        {/*    <a className="tile reveal" href="https://via.placeholder.com/400x300.png?text=Screenshot+1" target="_blank"*/}
        {/*      rel="noopener" style={{ position: "relative", overflow: "hidden" }}>*/}
        {/*      <div className="shine"></div>*/}
        {/*      <div className="tile-content">*/}
        {/*        <h3>Screenshot 1</h3>*/}
        {/*        <p className="tech">App UI Design</p>*/}
        {/*      </div>*/}
        {/*      <img src="https://via.placeholder.com/400x300.png?text=Screenshot+1" alt="Screenshot 1"*/}
        {/*        style={{*/}
        {/*          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",*/}
        {/*          borderRadius: "calc(var(--radius) * 1.6)", opacity: 0.85*/}
        {/*        }} />*/}
        {/*    </a>*/}
        {/*    <a className="tile reveal" href="https://via.placeholder.com/400x300.png?text=Screenshot+2" target="_blank"*/}
        {/*      rel="noopener" style={{ position: "relative", overflow: "hidden" }}>*/}
        {/*      <div className="shine"></div>*/}
        {/*      <div className="tile-content">*/}
        {/*        <h3>Screenshot 2</h3>*/}
        {/*        <p className="tech">Landing Page</p>*/}
        {/*      </div>*/}
        {/*      <img src="https://via.placeholder.com/400x300.png?text=Screenshot+2" alt="Screenshot 2"*/}
        {/*        style={{*/}
        {/*          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",*/}
        {/*          borderRadius: "calc(var(--radius) * 1.6)", opacity: 0.85*/}
        {/*        }} />*/}
        {/*    </a>*/}
        {/*    <div className="tile reveal" style={{ gridColumn: "span 2", position: "relative", overflow: "hidden" }}>*/}
        {/*      <div className="shine"></div>*/}
        {/*      <div className="tile-content" style={{ zIndex: 3, position: "relative" }}>*/}
        {/*        <h3>Project Demo Video</h3>*/}
        {/*        <p className="tech">App walkthrough</p>*/}
        {/*      </div>*/}
        {/*      <video controls*/}
        {/*        style={{*/}
        {/*          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",*/}
        {/*          borderRadius: "calc(var(--radius) * 1.6)"*/}
        {/*        }}>*/}
        {/*        <source src="https://interactive-examples.mdn.mozilla.net/media/examples/flower.webm" type="video/webm" />*/}
        {/*        Your browser does not support the video tag.*/}
        {/*      </video>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</section>*/}

        <section className="section wrap" style={{ display: "grid", gap: "var(--gap)" }}>
          <blockquote className="quote reveal">
            “Fueled by a deep passion for full-stack development , I specialize in
            crafting seamless, high-performance apps using React Native, React.js, and Node.js. I don't just
            build apps—I solve real-world problems with clean, scalable code.”
            <small>— Nirmal Ranpariya | Mission Statement</small>
          </blockquote>
          <div className="grid">
            <div className="tile reveal" style={{ gridColumn: "span 4" }}>
              <div className="shine"></div>
              <div className="tile-content">
                  <img
                      alt={'Version Control & DevOps'}
                      src="/trofy.jpg"
                      className='card-img'
                  />
                <h3 style={{ margin: "0 0 8px" }}>Achievements</h3>
                <p className="muted">Consistent delivery of performant, scalable mobile/web apps. Strong full-stack coding and problem-solving skills.Crafting smooth, fast, and scalable digital experiences—driven by solid full-stack engineering, clean architecture, and a passion for solving complex problems.</p>
              </div>
            </div>
            <div className="tile reveal" style={{ gridColumn: "span 4" }}>
              <div className="shine"></div>
              <div className="tile-content">
                  <img
                      alt={'Version Control & DevOps'}
                      src="/blog-post.jpeg"
                      className='card-img'
                  />
                <h3 className="mt-2" style={{ margin: "0 0 8px", }}>Blog & Articles</h3>
                <p className="muted">Planning to publish technical tutorials and deep dives on React Native, React.js, and backend development. On a mission to publish insightful tutorials and deep dives covering React Native, React.js, and backend development—breaking down complex topics into accessible, real-world, developer-friendly content.</p>
              </div>
            </div>
            <a className="tile reveal" href="#resume-link-here" style={{ gridColumn: "span 4" }}>
              <div className="shine"></div>
              <div className="tile-content">
                  <img
                      alt={'Version Control & DevOps'}
                      src="/CVPlaceholder.jpg"
                      className='card-img'
                  />
                  <div className="flex flex-row items-center mt-2">
                    <a style={{ margin: "0 0 8px", fontSize: 23, fontWeight:'500'}} href="/Nirmal_Ranpariya_Resume.pdf" download="Nirmal_Ranpariya_Resume.pdf" >Download Resume</a>
                    <Download className="ml-3 mb-2"/>
                  </div>
                <p className="muted">Access my full CV and professional history as a PDF (link placeholder).</p>
              </div>
            </a>
          </div>
        </section>

        <section id="contact" className="section wrap">
          <div className="grid">
            <div className="card reveal" style={{ gridColumn: "span 7" }}>
              <h3>Let's Build Your Masterpiece</h3>
              <p className="muted">
                I am open to exciting projects and collaborations worldwide. Tell me about your
                vision, and let's discuss how my full-stack expertise can bring it to life.
              </p>
              <form style={{ marginTop: 12, display: "grid", gap: 12 }} >
                <input placeholder="Your Name or Company" aria-label="Name"
                  style={{
                    padding: "14px 16px", borderRadius: 12, background: "hsl(var(--bg)/.6)",
                    border: "1px solid hsl(var(--text)/.1)", color: "inherit", outline: "none"
                  }} />
                <input placeholder="Your Email" aria-label="Email" type="email"
                  style={{
                    padding: "14px 16px", borderRadius: 12, background: "hsl(var(--bg)/.6)",
                    border: "1px solid hsl(var(--text)/.1)", color: "inherit", outline: "none"
                  }} />
                <textarea placeholder="Tell me what masterpiece you want to build (or ask a question)" rows={4}
                  aria-label="Message"
                  style={{
                    padding: "14px 16px", borderRadius: 12, background: "hsl(var(--bg)/.6)",
                    border: "1px solid hsl(var(--text)/.1)", color: "inherit", outline: "none"
                  }}></textarea>
                <div className="goo">
                  <button type="submit" className="btn primary magnet">Send Message ✦</button>
                  <button type="reset" className="btn magnet">Reset</button>
                </div>
              </form>
            </div>
              <div className="card reveal" style={{ gridColumn: "span 5" }}>
                  <h3 style={{ marginBottom: 12 }}>Contact & Links</h3>

                  <ul
                      className="muted"
                      style={{
                          margin: 0,
                          padding: 0,
                          listStyle: "none",
                          display: "grid",
                          gap: 10,
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                      }}
                  >
                      <li>
                          📧 <strong>Email:</strong>{" "}
                          <a
                              href="mailto:nirmatech.dev@gmail.com"
                              className="muted"
                              style={{ color: "inherit", textDecoration: "underline" }}
                          >
                              nirmatech.dev@gmail.com
                          </a>
                      </li>

                      <li>
                          📱 <strong>Phone:</strong>{" "}
                          <a
                              href="tel:+919664648614"
                              className="muted"
                              style={{ color: "inherit", textDecoration: "underline" }}
                          >
                              +91 9664648614
                          </a>
                      </li>

                      <li>
                          💻 <strong>GitHub:</strong>{" "}
                          <a
                              href="https://github.com/NirmalTechDev"
                              target="_blank"
                              className="muted"
                              style={{ color: "inherit", textDecoration: "underline" }}
                          >
                              NirmalTechDev
                          </a>
                      </li>

                      <li>
                          🔗 <strong>LinkedIn:</strong>{" "}
                          <a
                              href="https://www.linkedin.com/in/nirmal-ranpariya-625766266"
                              target="_blank"
                              className="muted"
                              style={{ color: "inherit", textDecoration: "underline" }}
                          >
                              Nirmal Ranpariya
                          </a>
                      </li>

                      <li>
                          💼 <strong>Upwork:</strong>{" "}
                          <a
                              href="https://www.upwork.com/freelancers/~0139b1b97fb2cf2377"
                              target="_blank"
                              className="muted"
                              style={{ color: "inherit", textDecoration: "underline" }}
                          >
                              Upwork Profile
                          </a>
                      </li>

                      <li>
                          🧠 <strong>Stack Overflow:</strong>{" "}
                          <a
                              href="https://stackoverflow.com/users/27369682/nirmal-patel"
                              target="_blank"
                              className="muted"
                              style={{ color: "inherit", textDecoration: "underline" }}
                          >
                              Nirmal Patel
                          </a>
                      </li>
                  </ul>
              </div>

          </div>
        </section>
      </main>

      <footer className="wrap"
        style={{
          padding: "40px 0", borderTop: "1px dashed hsl(var(--text)/.1)",
          textAlign: "center", fontSize: 14, color: "hsl(var(--muted))"
        }}>
        Built by Nirmal Ranpariya with love, math, and a sprinkle of thinks ✨
      </footer>
    </>
  );
}
