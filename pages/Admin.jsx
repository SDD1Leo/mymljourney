import { Settings, Lock, Plus, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

function Admin({ isAuthenticated, handleLogin, adminPassword, setAdminPassword, epochs = [], setEpochs, models = [], setModels, logout }) {
  
  const [newEpoch, setNewEpoch] = useState({ title: '', date: '', description: '', metric: '' });
  const [newModel, setNewModel] = useState({ name: '', type: '', description: '', stats: '', tech: '', link: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, id: null });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isAddingEpoch, setIsAddingEpoch] = useState(false);
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show, toast.message]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const addEpoch = async (e) => {
    e.preventDefault();
    if(!newEpoch.title || !newEpoch.date) return;
    setIsAddingEpoch(true);
    
    try {
      const res = await fetch('/api/epochs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEpoch),
      });
      if (!res.ok) throw new Error('Failed to add epoch');
      const info = await res.json();
      setEpochs([...epochs, info.data]);
      setNewEpoch({ title: '', date: '', description: '', metric: '' });
      showToast('Epoch added successfully!');
    } catch (error) {
      console.error(error);
      showToast('Error adding epoch to database.', 'error');
    } finally {
      setIsAddingEpoch(false);
    }
  };

  const addModel = async (e) => {
    e.preventDefault();
    if(!newModel.name || !newModel.type) return;
    setIsAddingModel(true);
    
    // Format the tech string into an array before sending to the database
    const formattedTech = newModel.tech.split(',').map(t => t.trim()).filter(Boolean);
    const modelPayload = { ...newModel, tech: formattedTech };

    try {
      const res = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelPayload),
      });

      if(!res.ok) throw new Error('Failed to add model');
      const info = await res.json();
      
      // Update state with the newly created database record
      setModels([...models, info.data || { ...modelPayload, id: Date.now() }]);
      setNewModel({ name: '', type: '', description: '', stats: '', tech: '', link: '' });
      showToast('Model registered successfully!');
    } catch (error) {
      console.error(error);
      showToast('Error adding model to database.', 'error');
    } finally {
      setIsAddingModel(false);
    }
  };

  // These functions now just open the modal instead of calling window.confirm
  const deleteEpoch = (id) => setDeleteModal({ isOpen: true, type: 'epoch', id });
  const deleteModel = (id) => setDeleteModal({ isOpen: true, type: 'model', id });

  // Centralized function to execute the deletion once confirmed
  const confirmDelete = async () => {
    const { type, id } = deleteModal;
    if (!id) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/${type}s?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Failed to delete ${type}`);
      
      if (type === 'epoch') setEpochs(epochs.filter(e => e.id !== id));
      if (type === 'model') setModels(models.filter(m => m.id !== id));
      showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
    } catch (error) {
      console.error(error);
      showToast(`Error deleting ${type} from database.`, 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, type: null, id: null });
    }
  };

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
            <button type="submit" disabled={isAddingEpoch} className="w-full bg-cyan-900/50 hover:bg-cyan-800 border border-cyan-700 text-cyan-100 p-2.5 rounded flex justify-center items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isAddingEpoch ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} 
              {isAddingEpoch ? 'Logging...' : 'Log Epoch'}
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
            <input placeholder="Project Link (Optional)" value={newModel.link} onChange={e => setNewModel({...newModel, link: e.target.value})} className="w-full bg-slate-950 border border-slate-800 text-sm p-2.5 rounded focus:border-emerald-500 outline-none text-slate-200" />
            
            <button type="submit" disabled={isAddingModel} className="w-full bg-emerald-900/50 hover:bg-emerald-800 border border-emerald-700 text-emerald-100 p-2.5 rounded flex justify-center items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isAddingModel ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} 
              {isAddingModel ? 'Deploying...' : 'Deploy Registry'}
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

      {/* CUSTOM CONFIRMATION MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-lg shadow-xl max-w-sm w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-2">Confirm Deletion</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to delete this {deleteModal.type}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModal({ isOpen: false, type: null, id: null })} className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={isDeleting} className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 hover:bg-red-500 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isDeleting && <Loader2 size={14} className="animate-spin" />}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-md shadow-2xl animate-in slide-in-from-bottom-5 duration-300 ${
          toast.type === 'success' 
            ? 'bg-emerald-950 border border-emerald-800 text-emerald-100' 
            : 'bg-red-950 border border-red-800 text-red-100'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} className="text-emerald-500" /> : <AlertCircle size={18} className="text-red-500" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

    </div>
  );
}

export default Admin;