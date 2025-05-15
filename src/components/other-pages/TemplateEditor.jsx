import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import newsletterPreset from 'grapesjs-preset-newsletter';
import basicBlocks from 'grapesjs-blocks-basic';

const TemplateEditor = ({ htmlContent, onSave, onDownload, editorRef }) => {
  const containerRef = useRef(null);
  const localEditorInstance = useRef(null);

  // Download handler
  const handleDownload = () => {
    if (localEditorInstance.current) {
      const html = localEditorInstance.current.getHtml();
      const css = localEditorInstance.current.getCss();
      const fullHtml = `
        <html>
          <head><style>${css}</style></head>
          <body>${html}</body>
        </html>
      `;
      
      if (onDownload) {
        onDownload(fullHtml);
      }
    }
  };

  useEffect(() => {
    // Add custom CSS
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      .gjs-cv-canvas {
        min-height: 100vh !important;
        height: auto !important;
        overflow: auto !important;
        padding-top: 0 !important;
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .gjs-cv-canvas::-webkit-scrollbar {
        display: none;
      }
      .gjs-frame-wrapper {
        overflow: visible !important;
      }
      .gjs-frame {
        margin-top: 0 !important;
      }
      .gjs-toolbar {
        top: 0 !important;
      }
      .gjs-pn-views-container {
        height: calc(100% - 40px) !important;
        overflow: auto !important;
      }
    `;
    document.head.appendChild(styleEl);

    // Initialize GrapesJS
    localEditorInstance.current = grapesjs.init({
      container: containerRef.current,
      height: '100vh',
      width: '100%',
      plugins: [newsletterPreset, basicBlocks],
      pluginsOpts: {
        [newsletterPreset]: {},
        [basicBlocks]: {}
      },
      deviceManager: {
        devices: [
          { name: 'Desktop', width: '' },
          { name: 'Mobile', width: '320px' }
        ]
      },
      storageManager: false,
      panels: { staticTop: true },
      canvas: {
        autoscroll: true,
        styles: [],
        scripts: [],
        scrollOffset: 0
      }
    });

    // Load content
    localEditorInstance.current.setComponents(htmlContent);

    // Set up editor resize logic
    const updateCanvasHeight = () => {
      const editor = localEditorInstance.current;
      const canvas = editor.Canvas;
      const frameEl = canvas.getFrameEl();
      const body = canvas.getBody();

      if (!body || !frameEl) return;

      const contentHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        body.clientHeight
      );

      frameEl.style.height = `${contentHeight + 100}px`;
      canvas.refresh();
    };

    localEditorInstance.current.on('load', () => {
      updateCanvasHeight();
      
      // Set up resize listeners
      window.addEventListener('resize', updateCanvasHeight);
      
      // Set up component change listeners
      ['component:add', 'component:remove', 'component:update', 'canvas:drop']
        .forEach(event => localEditorInstance.current.on(event, updateCanvasHeight));
    });

    // Make editor instance available to parent
    if (editorRef) {
      editorRef.current = localEditorInstance.current;
    }

    return () => {
      // Cleanup event listeners
      ['component:add', 'component:remove', 'component:update', 'canvas:drop']
        .forEach(event => localEditorInstance.current.off(event, updateCanvasHeight));
      
      window.removeEventListener('resize', updateCanvasHeight);
      
      // Destroy editor instance
      if (localEditorInstance.current) {
        localEditorInstance.current.destroy();
      }
      
      // Cleanup DOM
      if (document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    };
  }, [htmlContent, editorRef]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* Editor container */}
      <div 
        ref={containerRef} 
        style={{ 
          flex: 1,
          width: '100%',
          overflow: 'hidden',
          position: 'relative'
        }} 
      />
    </div>
  );
};

export default TemplateEditor;