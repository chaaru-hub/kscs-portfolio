import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, ExternalLink, FileText, Loader2, Minus, Plus, X } from 'lucide-react';
import useScrollLock from '../../hooks/useScrollLock';
import { RESUME } from '../../data/resumeData';
import './ResumeViewer.css';

const ZOOM_STEPS = [0.6, 0.75, 0.9, 1, 1.15, 1.3, 1.5, 1.75, 2];

/* PDF.js is loaded on first open only, so it never slows the home page.
   The legacy build carries polyfills, so older Chrome/Safari/Edge versions work too. */
let pdfjsPromise = null;
function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = Promise.all([
      import('pdfjs-dist/legacy/build/pdf.min.mjs'),
      import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'),
    ]).then(
      ([lib, worker]) => {
        lib.GlobalWorkerOptions.workerSrc = worker.default;
        return lib;
      },
    );
  }
  return pdfjsPromise;
}

function PdfPage({ doc, pageNumber, width, zoom }) {
  const canvasRef = useRef(null);
  const [ratio, setRatio] = useState(792 / 612);

  useEffect(() => {
    if (!doc || !width) return undefined;
    let cancelled = false;
    let task = null;
    doc.getPage(pageNumber).then((page) => {
      if (cancelled) return;
      const base = page.getViewport({ scale: 1 });
      setRatio(base.height / base.width);
      const cssWidth = width * zoom;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const viewport = page.getViewport({ scale: (cssWidth / base.width) * dpr });
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      task = page.render({ canvas, viewport });
      task.promise.catch(() => {});
    });
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [doc, pageNumber, width, zoom]);

  const cssWidth = width * zoom;
  return (
    <div className="rv-page" style={{ width: cssWidth, height: cssWidth * ratio }}>
      <canvas ref={canvasRef} aria-label={`Resume page ${pageNumber}`} />
      <span className="rv-page__num mono">
        {pageNumber} / {doc?.numPages}
      </span>
    </div>
  );
}

export default function ResumeViewer({ open, onClose }) {
  useScrollLock(open, onClose);
  const [doc, setDoc] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [zoomIdx, setZoomIdx] = useState(3);
  const [width, setWidth] = useState(0);
  const bodyRef = useRef(null);
  const closeRef = useRef(null);

  // The viewer mounts on first open, so load the document once on mount.
  useEffect(() => {
    let cancelled = false;
    loadPdfjs()
      .then((lib) => lib.getDocument({ url: RESUME.url }).promise)
      .then((d) => {
        if (cancelled) return;
        setDoc(d);
        setStatus('ready');
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
    };
  }, []);

  // Fit pages to the available width.
  useEffect(() => {
    if (!open) return undefined;
    const el = bodyRef.current;
    if (!el) return undefined;
    const measure = () => setWidth(Math.min(el.clientWidth - 32, 860));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  const zoomIn = useCallback(() => setZoomIdx((i) => Math.min(i + 1, ZOOM_STEPS.length - 1)), []);
  const zoomOut = useCallback(() => setZoomIdx((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === '+' || e.key === '=') zoomIn();
      else if (e.key === '-') zoomOut();
      else if (e.key === '0') setZoomIdx(3);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, zoomIn, zoomOut]);

  if (!open) return null;
  const zoom = ZOOM_STEPS[zoomIdx];

  return createPortal(
    <div className="rv" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="rv__dialog" role="dialog" aria-modal="true" aria-labelledby="rv-title">
        <header className="rv__bar">
          <div className="rv__title">
            <span className="rv__icon">
              <FileText size={18} />
            </span>
            <div>
              <h2 id="rv-title">Resume</h2>
              <p className="mono">
                {RESUME.owner}
                {doc ? ` · ${doc.numPages} pages` : ''}
              </p>
            </div>
          </div>

          <div className="rv__tools">
            <div className="rv__zoom" role="group" aria-label="Zoom">
              <button type="button" onClick={zoomOut} disabled={zoomIdx === 0} aria-label="Zoom out">
                <Minus size={15} />
              </button>
              <button type="button" className="rv__zoom-val mono" onClick={() => setZoomIdx(3)} title="Reset zoom">
                {Math.round(zoom * 100)}%
              </button>
              <button type="button" onClick={zoomIn} disabled={zoomIdx === ZOOM_STEPS.length - 1} aria-label="Zoom in">
                <Plus size={15} />
              </button>
            </div>
            <a
              className="rv__btn rv__btn--ghost"
              href={RESUME.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in a new tab"
            >
              <ExternalLink size={15} />
              <span>Open</span>
            </a>
            <a className="btn btn-primary btn-sm rv__download" href={RESUME.url} download={RESUME.fileName}>
              <Download size={15} />
              <span>Download</span>
            </a>
            <button type="button" className="rv__close" onClick={onClose} aria-label="Close resume" ref={closeRef}>
              <X size={18} />
            </button>
          </div>
        </header>

        <div className="rv__body" ref={bodyRef}>
          {status === 'loading' && (
            <div className="rv__state">
              <Loader2 size={28} className="rv__spin" />
              <p className="mono">Loading resume…</p>
            </div>
          )}
          {status === 'error' && (
            <div className="rv__state">
              <p>The preview couldn&apos;t load here.</p>
              <a className="btn btn-ghost btn-sm" href={RESUME.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={15} /> Open the PDF instead
              </a>
            </div>
          )}
          {status === 'ready' && width > 0 && (
            <div className="rv__pages">
              {Array.from({ length: doc.numPages }, (_, i) => (
                <PdfPage key={i} doc={doc} pageNumber={i + 1} width={width} zoom={zoom} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
