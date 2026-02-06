import { useState, useEffect, useCallback } from 'react';
import { ConvertedImage, ConversionHistory } from './types';

const HISTORY_KEY = 'anyfileflow_jpg_to_png_history';
const MAX_HISTORY = 10;

export const useConversionHistory = () => {
  const [history, setHistory] = useState<ConversionHistory>({
    images: [],
    totalConverted: 0,
    lastConvertedAt: 0,
  });

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ConversionHistory;
        // Filter out expired URLs (blob URLs don't persist)
        const validImages = parsed.images.filter(img => 
          img.convertedUrl && !img.convertedUrl.startsWith('blob:')
        );
        setHistory({
          ...parsed,
          images: validImages,
        });
      }
    } catch (error) {
      console.error('Failed to load conversion history:', error);
    }
  }, []);

  // Save to localStorage
  const saveHistory = useCallback((newHistory: ConversionHistory) => {
    try {
      // Don't save blob URLs - they won't work after reload
      const historyToSave = {
        ...newHistory,
        images: newHistory.images.map(img => ({
          ...img,
          // Store base64 for small images, clear for large ones
          convertedUrl: img.convertedSize < 500000 ? img.convertedUrl : '',
          originalUrl: '',
        })),
      };
      localStorage.setItem(HISTORY_KEY, JSON.stringify(historyToSave));
    } catch (error) {
      console.error('Failed to save conversion history:', error);
    }
  }, []);

  const addToHistory = useCallback((image: ConvertedImage) => {
    setHistory(prev => {
      const newImages = [image, ...prev.images].slice(0, MAX_HISTORY);
      const newHistory = {
        images: newImages,
        totalConverted: prev.totalConverted + 1,
        lastConvertedAt: Date.now(),
      };
      saveHistory(newHistory);
      return newHistory;
    });
  }, [saveHistory]);

  const addBulkToHistory = useCallback((images: ConvertedImage[]) => {
    setHistory(prev => {
      const newImages = [...images, ...prev.images].slice(0, MAX_HISTORY);
      const newHistory = {
        images: newImages,
        totalConverted: prev.totalConverted + images.length,
        lastConvertedAt: Date.now(),
      };
      saveHistory(newHistory);
      return newHistory;
    });
  }, [saveHistory]);

  const clearHistory = useCallback(() => {
    const newHistory = {
      images: [],
      totalConverted: history.totalConverted,
      lastConvertedAt: history.lastConvertedAt,
    };
    setHistory(newHistory);
    saveHistory(newHistory);
  }, [history.totalConverted, history.lastConvertedAt, saveHistory]);

  return {
    history,
    addToHistory,
    addBulkToHistory,
    clearHistory,
  };
};
