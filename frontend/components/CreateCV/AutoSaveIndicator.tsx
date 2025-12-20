"use client"

import React from 'react';
import { Cloud, CloudOff, Loader2, Check } from 'lucide-react';
import type { SaveStatus } from '@/lib/hooks/useAutoSave';

interface AutoSaveIndicatorProps {
  status: SaveStatus;
  lastSaved: Date | null;
  className?: string;
}

export default function AutoSaveIndicator({ 
  status, 
  lastSaved,
  className = '' 
}: AutoSaveIndicatorProps) {
  
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: 'Sauvegarde en cours...',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        };
      case 'saved':
        return {
          icon: <Check className="w-4 h-4" />,
          text: lastSaved ? `Sauvegardé à ${formatTime(lastSaved)}` : 'Sauvegardé',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
        };
      case 'error':
        return {
          icon: <CloudOff className="w-4 h-4" />,
          text: 'Erreur de sauvegarde',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
        };
      default:
        return {
          icon: <Cloud className="w-4 h-4" />,
          text: lastSaved ? `Dernière sauvegarde: ${formatTime(lastSaved)}` : 'En attente',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
        };
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const config = getStatusConfig();

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${config.bgColor} ${config.color} transition-all duration-200 ${className}`}
    >
      {config.icon}
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  );
}
