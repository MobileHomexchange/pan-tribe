import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Photo {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  uploadDate?: string;
}

interface PhotoGalleryModalProps {
  photos: Photo[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PhotoGalleryModal({ photos, initialIndex, isOpen, onClose }: PhotoGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          goToNext();
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const currentPhoto = photos[currentIndex];

  if (!currentPhoto) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-full max-h-screen p-0 bg-black/95 border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 hover:text-white"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Photo counter */}
          <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} of {photos.length}
          </div>

          {/* Previous button */}
          {photos.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 hover:text-white h-12 w-12"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* Next button */}
          {photos.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 hover:text-white h-12 w-12"
              onClick={goToNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {/* Main image */}
          <div className="relative max-w-full max-h-full flex items-center justify-center p-8">
            <img
              src={currentPhoto.imageUrl}
              alt={currentPhoto.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-elegant"
              loading="lazy"
            />
          </div>

          {/* Photo info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-white text-xl font-semibold mb-2">
                {currentPhoto.title}
              </h3>
              {currentPhoto.description && (
                <p className="text-white/80 text-sm mb-2">
                  {currentPhoto.description}
                </p>
              )}
              {currentPhoto.uploadDate && (
                <p className="text-white/60 text-xs">
                  {currentPhoto.uploadDate}
                </p>
              )}
            </div>
          </div>

          {/* Thumbnail navigation */}
          {photos.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/50 rounded-full p-2">
              {photos.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((photo, index) => {
                const actualIndex = Math.max(0, currentIndex - 2) + index;
                return (
                  <button
                    key={photo.id}
                    onClick={() => setCurrentIndex(actualIndex)}
                    className={cn(
                      "w-12 h-12 rounded-full overflow-hidden border-2 transition-all",
                      actualIndex === currentIndex
                        ? "border-white scale-110"
                        : "border-transparent hover:border-white/50"
                    )}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}