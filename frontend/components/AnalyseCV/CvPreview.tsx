"use client"

import React, { useState, useEffect } from "react"
import { X, FileText, Image as ImageIcon, File } from "lucide-react"
import { useTranslations } from 'next-intl'

interface CvPreviewProps {
  file: File | null
  onRemove: () => void
}

export default function CvPreview({ file, onRemove }: CvPreviewProps) {
  const t = useTranslations('analysis')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileType, setFileType] = useState<"pdf" | "image" | "other">("other")

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }

    const type = file.type
    if (type === "application/pdf") {
      setFileType("pdf")
    } else if (type.startsWith("image/")) {
      setFileType("image")
    } else {
      setFileType("other")
    }

    if (type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else if (type === "application/pdf") {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  if (!file) return null

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const getFileIcon = () => {
    switch (fileType) {
      case "pdf":
        return <FileText className="icon" size={24} />
      case "image":
        return <ImageIcon className="icon" size={24} />
      default:
        return <File className="icon" size={24} />
    }
  }

  return (
    <div className="cv-preview-container">
      <div className="cv-preview-header">
        <div className="file-info">
          {getFileIcon()}
          <div className="file-details">
            <span className="file-name">{file.name}</span>
            <span className="file-size">{formatFileSize(file.size)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="remove-btn"
          aria-label={t('removeFile')}
        >
          <X size={20} />
        </button>
      </div>

      <div className="cv-preview-content">
        {fileType === "image" && previewUrl && (
          <div className="image-preview">
            <img src={previewUrl} alt={t('previewAlt')} />
          </div>
        )}

        {fileType === "pdf" && previewUrl && (
          <div className="pdf-preview">
            <iframe
              src={previewUrl}
              title={t('previewPdfTitle')}
              width="100%"
              height="100%"
            />
          </div>
        )}

        {fileType === "other" && (
          <div className="no-preview">
            <File size={48} />
            <p>{t('noPreview')}</p>
            <p className="small-text">{t('fileWillBeProcessed')}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .cv-preview-container {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          margin-top: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .cv-preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .file-info :global(.icon) {
          color: #3b82f6;
          flex-shrink: 0;
        }

        .file-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .file-name {
          font-weight: 600;
          font-size: 14px;
          color: #1e293b;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .file-size {
          font-size: 12px;
          color: #64748b;
        }

        .remove-btn {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-btn:hover {
          background: #dc2626;
        }

        .cv-preview-content {
          width: 100%;
          height: 600px;
          overflow: hidden;
          position: relative;
        }

        .image-preview {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          overflow: auto;
          padding: 20px;
        }

        .image-preview img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .pdf-preview {
          width: 100%;
          height: 100%;
        }

        .pdf-preview iframe {
          border: none;
          width: 100%;
          height: 100%;
        }

        .no-preview {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #64748b;
          gap: 12px;
        }

        .no-preview p {
          margin: 0;
          font-size: 14px;
        }

        .small-text {
          font-size: 12px !important;
          color: #94a3b8 !important;
        }

        @media (max-width: 768px) {
          .cv-preview-content {
            height: 400px;
          }

          .file-name {
            font-size: 13px;
          }

          .file-size {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  )
}
