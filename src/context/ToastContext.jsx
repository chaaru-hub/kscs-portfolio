import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import '../components/common/Toaster.css';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const seq = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 320);
  }, []);

  const toast = useCallback(
    (message, { type = 'success', duration = 2600 } = {}) => {
      seq.current += 1;
      const id = seq.current;
      setToasts((t) => [...t.slice(-2), { id, message, type }]);
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toaster" role="status" aria-live="polite">
        {toasts.map((t) => (
          <button
            type="button"
            key={t.id}
            className={`toast toast--${t.type} ${t.leaving ? 'is-leaving' : ''}`}
            onClick={() => dismiss(t.id)}
          >
            {t.type === 'success' ? <CheckCircle2 size={18} /> : <Info size={18} />}
            <span>{t.message}</span>
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx.toast;
}
