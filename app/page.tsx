"use client";

import React, { useState, useEffect, use } from 'react';
import Epochs from '../pages/Epochs';
import Models from '../pages/Models';
import Admin from '../pages/Admin';
import { 
  Terminal, 
  BrainCircuit, 
  Network, 
  Settings, 
  Activity,
} from 'lucide-react';

// --- MOCK INITIAL DATA ---

const initialModels = [
  { id: 1, name: 'OptiDigit', type: 'CNN Vision Model', description: 'A custom Convolutional Neural Network trained on MNIST and extended datasets to recognize handwritten digits with high accuracy.', stats: '98.5% Accuracy', tech: ['PyTorch', 'OpenCV'] },
  { id: 2, name: 'Sentiment-X', type: 'NLP Classifier', description: 'Fine-tuned BERT model for analyzing product review sentiments in real-time.', stats: 'F1-Score: 0.91', tech: ['HuggingFace', 'FastAPI'] },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('journey');
  const [epochs, setEpochs] = useState([]);
  const [models, setModels] = useState([]);
  const [isLoadingEpochs, setIsLoadingEpochs] = useState(true);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  
  // Mouse Parallax State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typing Animation State
  const fullTitle = "myMLjourney";
  const [displayedTitle, setDisplayedTitle] = useState(fullTitle);

  useEffect(() => {
    setDisplayedTitle(''); // Clear the title on client mount to start the animation
    
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullTitle.length) {
        setDisplayedTitle(fullTitle.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 120); // 120ms per character
    return () => clearInterval(typingInterval);
  }, []);
  
  // Admin State
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  
  // Handle Admin Login
  const handleLogin = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simple mock password for the prototype
    if (adminPassword === process.env.NEXT_PUBLIC_ROOT_PASSWORD) {
      setIsAdminAuth(true);
      setAdminPassword('');
    } else {
      alert('Access Denied: Incorrect passphrase.');
    }
  };

  // Handle fetch epoch
    useEffect(() => {
    async function fetchEpochs() {
      try {
        const res = await fetch('/api/epochs');
        const info = await res.json();
        console.log(info);
        setEpochs(info.data);
      } catch (error) {
        console.error('Error fetching epochs:', error);
      } finally {
        setIsLoadingEpochs(false);
      }
    }

    fetchEpochs();
  }, []);

  //handle fetch models
    useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch('/api/models');
        const info = await res.json();
        console.log(info);
        setModels(info.data);
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setIsLoadingModels(false);
      }
    }

    fetchModels();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-mono selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient Glowing Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[120px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite] delay-1000"></div>
      </div>

      {/* Background grid effect with mouse parallax */}
      <div 
        className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"
        style={{ backgroundPosition: `${mousePos.x * 0.05}px ${mousePos.y * 0.05}px` }}
      ></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
          <div className="p-4 border border-cyan-500/30 hover:border-cyan-400/60 bg-slate-900/50 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all duration-500 backdrop-blur-sm group">
            <h1 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
              <BrainCircuit className="text-cyan-400 group-hover:animate-pulse" />
              <span>
                {displayedTitle}
                <span className={displayedTitle.length < fullTitle.length ? "animate-pulse text-cyan-400" : "hidden"}>_</span>
              </span>
            </h1>
            <p className="text-xs text-cyan-500/70 font-mono">v_2.0.4 [Status: Training]<span className="animate-pulse text-cyan-300 font-bold ml-0.5">_</span></p>
            
            <nav className="mt-8 flex flex-col gap-2">
              <NavButton 
                active={activeTab === 'journey'} 
                onClick={() => setActiveTab('journey')} 
                icon={<Activity size={18} />} 
                label="Training Epochs" 
              />
              <NavButton 
                active={activeTab === 'models'} 
                onClick={() => setActiveTab('models')} 
                icon={<Network size={18} />} 
                label="Deployed Models" 
              />
              <NavButton 
                active={activeTab === 'admin'} 
                onClick={() => setActiveTab('admin')} 
                icon={<Settings size={18} />} 
                label="Root Access" 
              />
            </nav>
          </div>

          {/* Quick Stats Widget */}
          <div className="hidden md:block p-4 border border-slate-800 hover:border-slate-700 bg-slate-900/50 rounded-lg text-xs backdrop-blur-sm text-slate-400 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-3 text-slate-300 border-b border-slate-800 pb-2 font-semibold tracking-wider">
              <Terminal size={14} /> System Status
            </div>
            <div className="flex justify-between mb-1"><span>Epochs Logged:</span> <span className="text-cyan-400">{isLoadingEpochs ? '...' : epochs.length}</span></div>
            <div className="flex justify-between mb-1"><span>Models Active:</span> <span className="text-emerald-400">{isLoadingModels ? '...' : models.length}</span></div>
            <div className="flex justify-between"><span>Compute:</span> <span className="text-amber-400">Optimal</span></div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
          {activeTab === 'journey' && (
            isLoadingEpochs ? <EpochsSkeleton /> : <Epochs epochs={epochs} />
          )}

          {activeTab === 'models' && (
            isLoadingModels ? <ModelsSkeleton /> : <Models models={models} />
          )}

          {activeTab === 'admin' && (
            <Admin
              isAuthenticated={isAdminAuth}
              handleLogin={handleLogin}
              adminPassword={adminPassword}
              setAdminPassword={setAdminPassword}
              epochs={epochs}
              setEpochs={setEpochs}
              models={models}
              setModels={setModels}
              logout={() => setIsAdminAuth(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// --- COMPONENTS ---

type NavButtonProps = {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
};

function NavButton({ active, onClick, icon, label }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded text-sm transition-all duration-200 border-l-2
        ${active 
          ? 'bg-cyan-950/40 text-cyan-300 border-cyan-400 shadow-[inset_4px_0_0_rgba(6,182,212,0.8)]' 
          : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'}`}
    >
      {icon}
      {label}
    </button>
  );
}

function EpochsSkeleton() {
  return (
    <div className="animate-pulse animate-in fade-in duration-500">
      <div className="mb-8 border-b border-slate-800 pb-4">
        <div className="h-8 w-48 bg-slate-800 rounded mb-3"></div>
        <div className="h-4 w-64 bg-slate-800/50 rounded"></div>
      </div>
      <div className="relative border-l border-slate-800 ml-4 md:ml-6 space-y-8 pb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative pl-8 md:pl-10">
            <div className="absolute w-3 h-3 bg-slate-800 rounded-full -left-[1.5px] top-2"></div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 h-32"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModelsSkeleton() {
  return (
    <div className="animate-pulse animate-in fade-in duration-500">
      <div className="mb-8 border-b border-slate-800 pb-4">
        <div className="h-8 w-48 bg-slate-800 rounded mb-3"></div>
        <div className="h-4 w-64 bg-slate-800/50 rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-lg p-6 h-48"></div>
        ))}
      </div>
    </div>
  );
}