import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileVideo, X } from "lucide-react";

export default function DropZone({ label, accept, onFileSelect, previewType = "video" }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    onFileSelect(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      className={`relative rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition-colors ${
        dragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/40"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {!file ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center px-4">
          <motion.div
            animate={dragActive ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
            className="text-accent"
          >
            <UploadCloud size={32} />
          </motion.div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">Drag & drop or click to browse</p>
        </div>
      ) : (
        <div className="relative">
          {previewType === "video" ? (
            <video src={preview} className="w-full aspect-video object-cover" muted />
          ) : (
            <img src={preview} alt="preview" className="w-full aspect-video object-cover" />
          )}
          <div className="absolute inset-0 bg-background/40 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
            <FileVideo size={16} />
            <span className="text-xs">{file.name}</span>
          </div>
          <button
            onClick={clearFile}
            className="absolute top-2 right-2 bg-background/80 rounded-full p-1.5 hover:bg-destructive/80 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}