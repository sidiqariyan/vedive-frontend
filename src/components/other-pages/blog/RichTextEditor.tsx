import React, { useRef, useState } from 'react';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Image, Link } from 'lucide-react';

interface RichTextEditorProps {
  initialValue: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [showLinkInput, setShowLinkInput] = useState<boolean>(false);

  // Initialize editor with content
  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialValue || '';
    }
  }, [initialValue]);

  // Track changes and update parent component
  const handleInput = () => {
    const content = editorRef.current?.innerHTML || '';
    onChange(content);
  };

  // Format commands
  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleInput();
    editorRef.current?.focus();
  };

  // Insert link
  const insertLink = () => {
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          execCommand('insertImage', event.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* Text formatting */}
        <button 
          onClick={() => execCommand('bold')}
          className="p-2 rounded hover:bg-gray-200"
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button 
          onClick={() => execCommand('italic')}
          className="p-2 rounded hover:bg-gray-200"
          title="Italic"
        >
          <Italic size={18} />
        </button>
        
        {/* Text alignment */}
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        <button 
          onClick={() => execCommand('justifyLeft')}
          className="p-2 rounded hover:bg-gray-200"
          title="Align Left"
        >
          <AlignLeft size={18} />
        </button>
        <button 
          onClick={() => execCommand('justifyCenter')}
          className="p-2 rounded hover:bg-gray-200"
          title="Align Center"
        >
          <AlignCenter size={18} />
        </button>
        <button 
          onClick={() => execCommand('justifyRight')}
          className="p-2 rounded hover:bg-gray-200"
          title="Align Right"
        >
          <AlignRight size={18} />
        </button>
        
        {/* Lists */}
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        <button 
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 rounded hover:bg-gray-200"
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button 
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 rounded hover:bg-gray-200"
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>
        
        {/* Media */}
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        <label className="p-2 rounded hover:bg-gray-200 cursor-pointer" title="Insert Image">
          <Image size={18} />
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload}
          />
        </label>
        
        <button 
          onClick={() => setShowLinkInput(!showLinkInput)}
          className="p-2 rounded hover:bg-gray-200"
          title="Insert Link"
        >
          <Link size={18} />
        </button>
        
        {/* Heading formatting */}
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        <select 
          onChange={(e) => execCommand('formatBlock', e.target.value)}
          className="p-2 rounded hover:bg-gray-200 outline-none"
        >
          <option value="">Format</option>
          <option value="<h1>">Heading 1</option>
          <option value="<h2>">Heading 2</option>
          <option value="<h3>">Heading 3</option>
          <option value="<h4>">Heading 4</option>
          <option value="<p>">Paragraph</option>
          <option value="<blockquote>">Blockquote</option>
        </select>
      </div>
      
      {/* Link input */}
      {showLinkInput && (
        <div className="flex items-center p-2 bg-gray-50 border-b border-gray-300">
          <input 
            type="url" 
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 p-2 border border-gray-300 rounded-l"
          />
          <button 
            onClick={insertLink}
            className="p-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
          >
            Insert
          </button>
        </div>
      )}
      
      {/* Editable content area */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[300px] focus:outline-none"
        onInput={handleInput}
      />
    </div>
  );
};

export default RichTextEditor;