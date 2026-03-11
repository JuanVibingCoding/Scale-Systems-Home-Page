import React, { useRef } from 'react';

const HolographicCard = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !cardRef.current) return;
        const container = containerRef.current;
        const card = cardRef.current;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (centerY - y) / 35;
        const rotateY = (x - centerX) / 35;

        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        card.style.setProperty('--x', `50%`);
        card.style.setProperty('--y', `50%`);
    };

    return (
        <div 
            ref={containerRef}
            className="w-full max-w-sm mx-auto group perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1000 }}
        >
            <div 
                className="component-card holographic-card relative overflow-hidden w-full aspect-[4/5] rounded-2xl bg-[#1c1d16] border border-[#03fa6e]/20 cursor-pointer shadow-[0_0_40px_rgba(3,250,110,0.05)]" 
                ref={cardRef}
                style={{ 
                  transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)', 
                  transformStyle: 'preserve-3d' 
                }}
            >
            {/* Glow background */}
            <div 
                className="holo-glow pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), rgba(3, 250, 110, 0.15), transparent 40%)`
                }}
            />
            {/* Content floating above */}
            <div className="holo-content relative z-10 p-8 text-center h-full flex flex-col items-center justify-center pointer-events-none" style={{ transform: 'translateZ(20px)' }}>
                <h3 className="component-title font-bold text-xl text-white tracking-wide">
                    Holographic Card
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                    Move your mouse over me!
                </p>
            </div>
        </div>
      </div>
    );
};

export default HolographicCard;
