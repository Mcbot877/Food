import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export type ToastType = 'success' | 'deal' | 'info' | 'error';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (title: string, description?: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, description?: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastMessage = { id, title, description, type };

    setToasts((prev) => [...prev.slice(-3), newToast]); // limit to 4 active

    setTimeout(() => {
      removeToast(id);
    }, 4200);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast container with high z-index and GPU acceleration */}
      <div 
        id="toast-container" 
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.9, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 450, damping: 28, mass: 0.8 }}
              className="pointer-events-auto relative overflow-hidden rounded-xl border border-white/15 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl gpu-layer text-slate-100"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {toast.type === 'success' && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                  {toast.type === 'deal' && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5722]/20 text-[#FF5722] border border-[#FF5722]/30">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}
                  {toast.type === 'info' && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      <Info className="h-4 w-4" />
                    </div>
                  )}
                  {toast.type === 'error' && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-sm font-semibold text-white tracking-tight">{toast.title}</h4>
                  {toast.description && (
                    <p className="mt-0.5 text-xs text-slate-300 leading-relaxed line-clamp-2">{toast.description}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 text-slate-400 hover:text-white transition-colors p-1"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Subtle glowing bottom bar */}
              <div 
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                  toast.type === 'deal' 
                    ? 'bg-gradient-to-r from-[#FF5722] to-amber-400' 
                    : toast.type === 'success' 
                    ? 'bg-gradient-to-r from-[#4CAF50] to-emerald-300' 
                    : 'bg-gradient-to-r from-sky-400 to-indigo-400'
                }`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
