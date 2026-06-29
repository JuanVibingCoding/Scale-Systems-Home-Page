'use client';

import { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { projectsData } from './data/projects';
import { ProjectCard } from './ProjectCard';
import { ParticlesBackground } from './ParticlesBackground';

export function PortfolioSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ contentWidth: 0, viewportWidth: 0 });

  const measure = useCallback(() => {
    const content = document.getElementById('portfolio-track');
    if (content) {
      setDimensions({
        contentWidth: content.scrollWidth,
        viewportWidth: window.innerWidth
      });
    }
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    const timer = setTimeout(measure, 300);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(timer);
    };
  }, [measure]);

  const horizontalScrollDistance = Math.max(0, dimensions.contentWidth - dimensions.viewportWidth);

  const containerHeight = dimensions.viewportWidth > 0
    ? `${(1 + horizontalScrollDistance / dimensions.viewportWidth) * 100}vh`
    : '300vh';

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -horizontalScrollDistance]
  );

  const progressWidth = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '100%']
  );

  return (
    <section
      id="portafolio"
      ref={sectionRef}
      style={{ height: containerHeight }}
      className="relative"
    >
      <ParticlesBackground />

      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden bg-[#171810]">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2a2c1f] to-transparent z-20"></div>

        <div className="container mx-auto px-6 md:px-12 z-20 pt-24 sm:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-[#03fa6e] font-mono text-sm tracking-widest uppercase mb-4">
              Selected Works // 2026
            </h2>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white uppercase" style={{ fontFamily: 'var(--font-logo)' }}>
              Digital <br className="md:hidden" /><span className="text-[#a1a1aa]">Frontiers</span>
            </h1>
          </motion.div>
        </div>

        <div
          className="flex-grow flex items-center z-20 relative pb-16"
          onMouseEnter={() => setHoveredProjectId(null)}
        >
          <motion.div
            id="portfolio-track"
            style={{ x }}
            className="flex gap-6 md:gap-12 px-6 md:px-12 w-max"
          >
            {projectsData.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isActive={hoveredProjectId === project.id}
                isDimmed={hoveredProjectId !== null && hoveredProjectId !== project.id}
                onHover={setHoveredProjectId}
              />
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
          <div className="w-48 sm:w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              style={{ width: progressWidth }}
              className="h-full bg-[#03fa6e] rounded-full"
            />
          </div>
          <span className="text-[#a1a1aa] text-xs font-mono">
            SCROLL TO EXPLORE
          </span>
        </div>
      </div>
    </section>
  );
}
