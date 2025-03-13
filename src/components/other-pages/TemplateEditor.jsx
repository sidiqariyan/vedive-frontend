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
      const fullHtml = `<html>
        <head>
          <style>${css}</style>
        </head>
        <body>${html}</body>
      </html>`;
      
      // Call the passed-in onDownload function with the edited HTML
      if (onDownload) {
        onDownload(fullHtml);
      }
    }
  };

  
  useEffect(() => {
    // Add custom CSS to fix canvas scrolling and display issues
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `

      .gjs-cv-canvas {
        padding-top: 0 !important;
        height: auto !important;
        min-height: 90vh !important;
        overflow: auto !important;
      }
      .gjs-frame-wrapper {
        padding-top: 0 !important;
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
    
    // Create the editor with fixed height
    localEditorInstance.current = grapesjs.init({
      container: containerRef.current,
      height: 'calc(100vh - 50px)', // Leave room for the header
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
      // Canvas options with autoscroll
      canvas: {
        styles: [],
        scripts: [],
        autoscroll: true,
        // This forces GrapesJS to show the entire canvas
        scrollOffset: 0
      },
      // Disable storage manager
      storageManager: false,
      // Make panels fixed
      panels: { staticTop: true }
    });

    // Make the editor instance available to the parent through the ref
    if (editorRef) {
      editorRef.current = localEditorInstance.current;
    }

    // Load initial content
    localEditorInstance.current.setComponents(htmlContent);
    
    // Setup after editor loads
    localEditorInstance.current.on('load', () => {
      const editor = localEditorInstance.current;
      const canvas = editor.Canvas;
      
      // Get references to key elements
      const frameEl = canvas.getFrameEl();
      const body = canvas.getBody();
      
      // Ensure the canvas body has proper styling
      if (body) {
        body.style.height = 'auto';
        body.style.minHeight = '100%';
        body.style.overflow = 'visible';
        body.style.marginTop = '0';
        body.style.paddingTop = '0';
      }
      
      // Set up a comprehensive height update function
      const updateFrameHeight = () => {
        if (frameEl && body) {
          // Calculate the actual content height
          const contentHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            body.clientHeight
          );
          
          // Give extra padding to avoid cutoff
          frameEl.style.height = `${contentHeight + 100}px`;
          
          // Ensure the canvas is properly positioned
          frameEl.style.marginTop = '0';
          frameEl.style.paddingTop = '0';
          
          // Force a refresh
          canvas.refresh();
        }
      };
      
      // Update immediately and on window resize
      updateFrameHeight();
      window.addEventListener('resize', updateFrameHeight);
      
      // Set up listeners for content changes
      editor.on('component:add', updateFrameHeight);
      editor.on('component:update', updateFrameHeight);
      editor.on('component:remove', updateFrameHeight);
      editor.on('canvas:drop', updateFrameHeight);
      
      // Set up ResizeObserver for modern browsers
      if (window.ResizeObserver && body) {
        const resizeObserver = new ResizeObserver(updateFrameHeight);
        resizeObserver.observe(body);
      }
      
      // Fix the position of the canvas to start from the top
      const canvasView = canvas.getCanvasView();
      if (canvasView && canvasView.el) {
        canvasView.el.style.paddingTop = '0';
        canvasView.el.style.marginTop = '0';
        canvasView.el.style.overflow = 'auto';
      }
      
      // Force canvas to scroll to top to show beginning of content
      setTimeout(() => {
        if (canvasView && canvasView.el) {
          canvasView.el.scrollTop = 0;
        }
      }, 100);
    });

    return () => {
      if (localEditorInstance.current) {
        // Cleanup the editor reference before destroying
        if (editorRef) {
          editorRef.current = null;
        }
        localEditorInstance.current.destroy();
      }
      document.head.removeChild(styleEl);
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
      {/* Fixed header area for the button */}
      
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