import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';
import { transformText, TransformationResult } from './services/geminiService';

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TransformationResult | null>(null);
  const [copiedField, setCopiedField] = useState<'direct' | 'diplomatic' | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleTransform = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setResult(null);
    
    const transformation = await transformText(input);
    setResult(transformation);
    setLoading(false);
  };

  const copyToClipboard = (text: string, field: 'direct' | 'diplomatic') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#f5f5f5] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-100 dark:selection:bg-indigo-900/30 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-600 dark:bg-slate-700 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <h1 className="font-semibold text-lg tracking-tight">Globo Ético - Comunicação Formal</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-indigo-500" /> Relacionamento</span>
              <ArrowRight size={14} />
              <span>Diplomático</span>
              <ArrowRight size={14} />
              <span>Estratégico</span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Sua Mensagem</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Escreva o que você realmente quer dizer. Não se preocupe com o tom, nós cuidamos disso.
              </p>
            </div>

            <div className="relative group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ex: Fala para esse cara que o prazo acabou e ele precisa pagar logo..."
                className="w-full h-64 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-slate-700 dark:text-slate-200 leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => setInput('')}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  title="Limpar"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            <button
              onClick={handleTransform}
              disabled={loading || !input.trim()}
              className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/10 ${
                loading || !input.trim() 
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <RefreshCw size={20} />
                </motion.div>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Transformar Mensagem</span>
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result && !loading ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full min-h-[400px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                    <MessageSquare size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Aguardando entrada</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
                      Insira sua mensagem ao lado e clique em transformar para ver as opções profissionais.
                    </p>
                  </div>
                </motion.div>
              ) : loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center space-y-6"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-indigo-500 rounded-full blur-xl"
                    />
                    <div className="relative bg-white dark:bg-slate-800 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 shadow-sm">
                      <Sparkles className="text-indigo-600 dark:text-indigo-400" size={32} />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Refinando sua comunicação...</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Aplicando filtros de diplomacia e polidez.</p>
                  </div>
                </motion.div>
              ) : result?.error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <AlertCircle className="text-amber-500" size={48} />
                  <p className="text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                    {result.error}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Option 1: Direct */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden group">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                        <h3 className="font-bold text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">Opção Direta</h3>
                      </div>
                      <button
                        onClick={() => copyToClipboard(result!.direct, 'direct')}
                        className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-indigo-600 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        {copiedField === 'direct' ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                      </button>
                    </div>
                    <div className="p-6">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {result?.direct}
                      </p>
                    </div>
                  </div>

                  {/* Option 2: Diplomatic */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden group">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <h3 className="font-bold text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">Opção Diplomática</h3>
                      </div>
                      <button
                        onClick={() => copyToClipboard(result!.diplomatic, 'diplomatic')}
                        className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-emerald-600 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        {copiedField === 'diplomatic' ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                      </button>
                    </div>
                    <div className="p-6">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {result?.diplomatic}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium py-4">
                    <ShieldCheck size={14} />
                    <span>Processado com segurança pelo Globo Ético</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-8 border-t border-slate-200 dark:border-slate-800 mt-12 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 dark:text-slate-500 text-xs">
          <p>© 2026 Globo Ético. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Termos</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
   </div>
  );
}
