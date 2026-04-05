import { Network, Cpu, ExternalLink, Code } from 'lucide-react';
import { useState } from 'react';

function Models({models}) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Network className="text-emerald-400" /> Model Registry
                </h2>
                <p className="text-sm text-slate-500 mt-2">Projects, experiments, and deployed applications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {models.map(model => (
                    <ModelCard key={model.id} model={model} />
                ))}
            </div>
        </div>
    );
}

function ModelCard({ model }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div onMouseMove={handleMouseMove} className="relative bg-slate-900/40 border border-slate-800 rounded-lg p-6 flex flex-col h-full hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)] backdrop-blur-sm group overflow-hidden">
            {/* Mouse-tracking Spotlight */}
            <div
                className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16,185,129,0.15), transparent 40%)`
                }}
            />

            {/* Cyberpunk corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {model.name}
                </h3>
                {model.link ? (
                    <a href={model.link} target="_blank" rel="noopener noreferrer" title="View Project" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink size={18} className="text-slate-600 group-hover:text-emerald-400 hover:!text-emerald-300 cursor-pointer transition-colors" />
                    </a>
                ) : (
                    <ExternalLink size={18} className="text-slate-700" />
                )}
            </div>

            <div className="text-xs font-mono text-emerald-500 mb-3 flex items-center gap-1.5 relative z-10">
                <Cpu size={14} className="group-hover:animate-pulse" /> {model.type}
            </div>

            <p className="text-sm text-slate-400 mb-6 flex-grow relative z-10">
                {model.description}
            </p>

            <div className="space-y-4 relative z-10">
                <div className="text-xs bg-slate-950/50 p-2 rounded border border-slate-800/50 text-amber-400 font-mono">
                    {'>'} Result: {model.stats}
                </div>

                <div className="flex flex-wrap gap-2">
                    {model.tech.map((t, i) => (
                        <span key={i} className="text-[10px] uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-1 rounded-sm flex items-center gap-1">
                            <Code size={10} /> {t}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Models;