import { Network, Cpu, ExternalLink, Code } from 'lucide-react';

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
                    <div key={model.id} className="bg-slate-900/40 border border-slate-800 rounded-lg p-6 flex flex-col h-full hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                                {model.name}
                            </h3>
                            <ExternalLink size={18} className="text-slate-600 group-hover:text-emerald-400 cursor-pointer" />
                        </div>

                        <div className="text-xs font-mono text-emerald-500 mb-3 flex items-center gap-1.5">
                            <Cpu size={14} /> {model.type}
                        </div>

                        <p className="text-sm text-slate-400 mb-6 flex-grow">
                            {model.description}
                        </p>

                        <div className="space-y-4">
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
                ))}
            </div>
        </div>
    );
}

export default Models;