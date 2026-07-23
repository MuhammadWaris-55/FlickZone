import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileVideo, X } from "lucide-react";

export default function DropZone({
  label,
  accept,
  onFileSelect,
  previewType = "video",
  shape = "rect",
  aspect = "video",
}) {
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

  const shapeClasses =
    shape === "circle" ? "w-20 h-20 rounded-full" : "rounded-xl";
  const aspectClass =
    shape === "circle"
      ? ""
      : aspect === "banner"
        ? "aspect-[4/1]"
        : "aspect-video";

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      className={`relative border-2 border-dashed cursor-pointer overflow-hidden transition-colors ${shapeClasses} ${aspectClass} ${
        dragActive
          ? "border-accent bg-accent/5"
          : "border-border hover:border-accent/40"
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
        <div
          className={`flex flex-col items-center justify-center gap-1.5 text-center px-2 h-full ${shape === "circle" ? "" : "py-8"}`}
        >
          <UploadCloud
            size={shape === "circle" ? 18 : 28}
            className="text-accent"
          />
          {shape !== "circle" && (
            <>
              <p className="text-xs font-medium">{label}</p>
              <p className="text-[10px] text-muted-foreground">
                Drag & drop or click
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="relative w-full h-full">
          {previewType === "video" ? (
            <video src={preview} className="w-full h-full object-cover" muted />
          ) : (
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          )}
          {shape !== "circle" && (
            <div className="absolute inset-0 bg-background/40 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
              <FileVideo size={16} />
              <span className="text-xs">{file.name}</span>
            </div>
          )}
          <button
            onClick={clearFile}
            className={`absolute bg-background/80 rounded-full p-1 hover:bg-destructive/80 transition-colors ${
              shape === "circle" ? "top-0 right-0" : "top-2 right-2 p-1.5"
            }`}
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
