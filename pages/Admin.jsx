import { Settings, Lock, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

function Admin({ isAuthenticated, handleLogin, adminPassword, setAdminPassword, epochs, setEpochs, models, setModels, logout }) {
  
  const [newEpoch, setNewEpoch] = useState({ title: '', date: '', description: '', metric: '' });
  const [newModel, setNewModel] = useState({ name: '', type: '', description: '', stats: '', tech: '' });

  const addEpoch = (e) => {
    e.preventDefault();
    if(!newEpoch.title || !newEpoch.date) return;
    const epochObj = { ...newEpoch, id: Date.now() };
    setEpochs([...epochs, epochObj]);
    setNewEpoch({ title: '', date: '', description: '', metric: '' });
  };

  const addModel = (e) => {
    e.preventDefault();
    if(!newModel.name || !newModel.type) return;
    const modelObj = { 
      ...newModel, 
      id: Date.now(),
      tech: newModel.tech.split(',').map(t => t.trim()).filter(Boolean)
    };
    setModels([...models, modelObj]);
    setNewModel({ name: '', type: '', description: '', stats: '', tech: '' });
  };

  const deleteEpoch = (id) => setEpochs(epochs.filter(e => e.id !== id));
  const deleteModel = (id) => setModels(models.filter(m => m.id !== id));

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] animate-in fade-in zoom-in-95">
        <Lock className="text-slate-600 mb-4 h-12 w-12" />
        <h2 className="text-xl text-slate-300 mb-6 font-mono">Enter Root Passphrase</h2>
        <form onSubmit={handleLogin} className="flex gap-2 w-full max-w-sm">
          <input 
            type="password" 
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:border-cyan-500 font-mono"
            placeholder="try 'sudo' or 'admin123'"
          />
          <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded font-semibold transition-colors">
            Init
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-red-400 flex items-center gap-2">
            <Settings className="text-red-400" /> Root Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-2">Add new logs to your journey locally.</p>
        </div>
        <button onClick={logout} className="text-xs border border-slate-700 text-slate-400 px-3 py-1 rounded hover:bg-slate-800 transition-colors">
          Exit Root
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ADD EPOCH FORM */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-5">
          <h3 className="text-lg text-cyan-400 font-semibold border-b border-slate-800 pb-2 mb-4">Add Training Epoch</h3>
          <form onSubmit={addEpoch} className="space-y-3">
            <input required placeholder="Epoch Title (e.g., Learned GANs)" value={newEpoch.title} onChange={e => setNewEpoch({...newEpoch, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-sm p-2.5 rounded focus:border-cyan-500 outline-none text-slate-200" />
            <input required type="date" value={newEpoch.date} onChange={e => setNewEpoch({...newEpoch, date: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-sm p-2.5 rounded focus:border-cyan-500 outline-none text-slate-200" />
            <textarea required placeholder="Description of your learning..." value={newEpoch.description} onChange={e => setNewEpoch({...newEpoch, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-sm p-2.5 rounded focus:border-cyan-500 outline-none text-slate-200 h-24 resize-none" />
            <input placeholder="Key Metric (e.g., Loss: 0.1, Cert Earned)" value={newEpoch.metric} onChange={e => setNewEpoch({...newEpoch, metric: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-sm p-2.5 rounded focus:border-cyan-500 outline-none text-slate-200" />
            <button type="submit" className="w-full bg-cyan-900/50 hover:bg-cyan-800 border border-cyan-700 text-cyan-100 p-2.5 rounded flex justify-center items-center gap-2 transition-colors">
              <Plus size={16} /> Log Epoch
            </button>
          </form>

          {/* Quick Epoch List for Deletion */}
          <div className="mt-6 space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {epochs.map(ep => (
              <div key={ep.id} className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800 text-xs text-slate-400">
                <span className="truncate w-3/4">{ep.title}</span>
                <button onClick={() => deleteEpoch(ep.id)} className="text-red-500 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* ADD MODEL FORM */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-5">
          <h3 className="text-lg text-emerald-400 font-semibold border-b border-slate-800 pb-2 mb-4">Register Model</h3>
          <form onSubmit={addModel} className="space-y-3">
            <input required placeholder="Model Name (e.g., VisionPro)" value={newModel.name} onChange={e => setNewModel({...newModel, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-sm p-2.5 rounded focus:border-emerald-500 outline-none text-slate-200" />
            <input required placeholder="Model Type (e.g., LLM, CNN)" value={newModel.type} onChange={e => setNewModel({...newModel, type: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-sm p-2.5 rounded focus:border-emerald-500 outline-none text-slate-200" />
            <textarea required placeholder="What does this model do?" value={newModel.description} onChange={e => setNewModel({...newModel, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-sm p-2.5 rounded focus:border-emerald-500 outline-none text-slate-200 h-20 resize-none" />
            <input placeholder="Stats (e.g., 99% Accuracy)" value={newModel.stats} onChange={e => setNewModel({...newModel, stats: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-sm p-2.5 rounded focus:border-emerald-500 outline-none text-slate-200" />
            <input placeholder="Tech Stack (comma separated: Python, PyTorch)" value={newModel.tech} onChange={e => setNewModel({...newModel, tech: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-sm p-2.5 rounded focus:border-emerald-500 outline-none text-slate-200" />
            
            <button type="submit" className="w-full bg-emerald-900/50 hover:bg-emerald-800 border border-emerald-700 text-emerald-100 p-2.5 rounded flex justify-center items-center gap-2 transition-colors">
              <Plus size={16} /> Deploy Registry
            </button>
          </form>

           {/* Quick Model List for Deletion */}
           <div className="mt-6 space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {models.map(m => (
              <div key={m.id} className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800 text-xs text-slate-400">
                <span className="truncate w-3/4">{m.name}</span>
                <button onClick={() => deleteModel(m.id)} className="text-red-500 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Admin;