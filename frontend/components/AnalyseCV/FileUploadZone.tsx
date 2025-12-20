"use client"

import React, { useRef } from "react"
import { Upload, FileText } from "lucide-react"
import { useTranslations } from 'next-intl'

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  accept: string
  disabled?: boolean
}

export default function FileUploadZone({ onFileSelect, accept, disabled = false }: FileUploadZoneProps) {
  const t = useTranslations('analysis')
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      const acceptedTypes = accept.split(",").map(t => t.trim())
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()

      if (acceptedTypes.includes(fileExtension) || acceptedTypes.includes(file.type)) {
        onFileSelect(file)
      } else {
        alert(t('fileTypeNotAccepted', { formats: accept }))
      }
    }
  }

  return (
    <div
      className={`upload-zone ${isDragging ? "dragging" : ""} ${disabled ? "disabled" : ""}`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        style={{ display: "none" }}
        id="cv-file-input"
      />

      <div className="upload-icon-container">
        <Upload className="upload-icon" size={48} />
      </div>

      <div className="upload-text">
        <p className="upload-title">
          <strong>{t('clickToChoose')}</strong>
        </p>
        <p className="upload-subtitle">{t('fileFormats')}</p>
        <p className="upload-ai-info">
          <FileText size={14} style={{ display: "inline", marginRight: "4px" }} />
          {t('extractionInfo')}
        </p>
      </div>

      <style jsx>{`
        .upload-zone {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 48px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f8fafc;
          position: relative;
          overflow: hidden;
        }

        .upload-zone:hover:not(.disabled) {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .upload-zone.dragging {
          border-color: #3b82f6;
          background: #dbeafe;
          transform: scale(1.02);
        }

        .upload-zone.disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .upload-icon-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .upload-zone:hover:not(.disabled) .upload-icon-container {
          background: #eff6ff;
        }

        .upload-zone.dragging .upload-icon-container {
          background: #dbeafe;
          transform: scale(1.1);
        }

        .upload-zone :global(.upload-icon) {
          color: #3b82f6;
        }

        .upload-text {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .upload-title {
          font-size: 16px;
          color: #1e293b;
          margin: 0;
        }

        .upload-title strong {
          color: #3b82f6;
        }

        .upload-subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .upload-ai-info {
          font-size: 12px;
          color: #10b981;
          margin: 8px 0 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        @media (max-width: 768px) {
          .upload-zone {
            padding: 32px 16px;
          }

          .upload-icon-container {
            width: 64px;
            height: 64px;
            margin-bottom: 16px;
          }

          .upload-zone :global(.upload-icon) {
            width: 36px;
            height: 36px;
          }

          .upload-title {
            font-size: 14px;
          }

          .upload-subtitle {
            font-size: 12px;
          }

          .upload-ai-info {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  )
}
