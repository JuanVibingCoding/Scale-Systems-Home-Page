import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Project } from './data/projects';

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  isDimmed: boolean;
  onHover: (id: string | null) => void;
}

export function ProjectCard({ project, isActive, isDimmed, onHover }: ProjectCardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div
      className="relative flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] h-[60vh] md:h-[70vh] rounded-2xl transition-all duration-500 ease-out bg-[#1f2017] border border-[#2a2c1f] glow-border group cursor-pointer"
      style={{
        opacity: isDimmed ? 0.3 : 1,
        scale: isDimmed ? 0.98 : 1,
        backdropFilter: 'blur(10px)',
      }}
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 m-1 rounded-xl overflow-hidden bg-[#13140e] z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#13140e] z-10 opacity-80" />
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-in-out group-hover:opacity-40"
          draggable={false}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 flex flex-col justify-end">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <p className="text-[#03fa6e] font-mono text-xs tracking-widest uppercase mb-2">
              {project.role}
            </p>
            <h3 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-white uppercase" style={{ fontFamily: 'var(--font-logo)' }}>
              {project.title}
            </h3>
            <p className="text-[#a1a1aa] text-sm md:text-base leading-relaxed max-w-md hidden md:block">
              {project.description}
            </p>
          </div>

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-[#03fa6e] font-medium tracking-wide group-active:scale-95 transition-transform"
          >
            <span>Ver proyecto</span>
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
