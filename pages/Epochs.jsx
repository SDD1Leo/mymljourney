import { Activity, GitCommit, Database } from 'lucide-react';

function Epochs({epochs}) {
    const sortedEpochs = [...epochs].sort((a, b) => b.id - a.id);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Activity className="text-cyan-400" /> Training Log
                </h2>
                <p className="text-sm text-slate-500 mt-2">A chronological sequence of my learning checkpoints.</p>
            </div>

            <div className="relative border-l border-slate-800 ml-4 md:ml-6 space-y-8 pb-8">
                {sortedEpochs.map((epoch, idx) => (
                    <div key={epoch.id} className="relative pl-8 md:pl-10 group">
                        {/* Timeline Dot */}
                        <div className="absolute w-3 h-3 bg-slate-900 border-2 border-cyan-500 rounded-full -left-[1.5px] top-2 transition-transform duration-300 group-hover:scale-150 group-hover:bg-cyan-400 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>

                        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 hover:border-cyan-500/50 transition-colors duration-300 backdrop-blur-sm">
                            <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                                    <GitCommit size={16} className="text-cyan-500" />
                                    {epoch.title}
                                </h3>
                                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono">
                                    {epoch.date}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 mb-4">{epoch.description}</p>
                            <div className="inline-flex items-center text-xs font-mono bg-cyan-950/30 text-cyan-400 px-3 py-1.5 rounded-full border border-cyan-900/50">
                                <Database size={12} className="mr-2" /> {epoch.metric}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Epochs;