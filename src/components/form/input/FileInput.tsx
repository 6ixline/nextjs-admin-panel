import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDropzone, FileWithPath, Accept } from 'react-dropzone';
import { XCircleIcon, DocumentIcon, DocumentTextIcon, FilmIcon, MusicalNoteIcon } from '@heroicons/react/24/solid';
import { ExistingFile } from '@/types/fileTypes';

const FILE_TYPE_MAPPINGS: Record<string, Accept> = {
  image: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
  pdf: { 'application/pdf': ['.pdf'] },
  video: { 'video/*': ['.mp4', '.mov', '.avi'] },
  audio: { 'audio/*': ['.mp3', '.wav'] },
  doc: {
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
} as const;

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']);
const MIME_TO_ICON_MAP = new Map([
  ['application/pdf', { icon: DocumentIcon, color: 'text-red-500' }],
  ['application/msword', { icon: DocumentTextIcon, color: 'text-blue-500' }],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', { icon: DocumentTextIcon, color: 'text-blue-500' }],
]);

const EXTENSION_TO_ICON_MAP = new Map([
  ['pdf', { icon: DocumentIcon, color: 'text-red-500' }],
  ['doc', { icon: DocumentTextIcon, color: 'text-blue-500' }],
  ['docx', { icon: DocumentTextIcon, color: 'text-blue-500' }],
  ['mp4', { icon: FilmIcon, color: 'text-purple-500' }],
  ['mov', { icon: FilmIcon, color: 'text-purple-500' }],
  ['avi', { icon: FilmIcon, color: 'text-purple-500' }],
  ['mp3', { icon: MusicalNoteIcon, color: 'text-green-500' }],
  ['wav', { icon: MusicalNoteIcon, color: 'text-green-500' }],
]);

// Image compression configuration
const MAX_FILE_SIZE = 500 * 1024; // 500KB in bytes
const MAX_WIDTH = 1920; // Maximum width for compressed images
const MAX_HEIGHT = 1920; // Maximum height for compressed images
const COMPRESSION_QUALITY = 0.85; // Quality for JPEG compression (0-1)

type FileTypeKey = keyof typeof FILE_TYPE_MAPPINGS;

type UploadedFile =
  & Partial<FileWithPath>
  & {
    preview: string;
    id?: string;
    isExisting?: boolean;
  };

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  multiple?: boolean;
  className?: string;
  maxFiles?: number;
  fileTypes?: FileTypeKey[];
  accept?: Accept;
  initialFiles?: (File | ExistingFile)[];
  onFileRemove?: (fileId: string | undefined, fileName: string) => void;
}

const isImageFile = (file: UploadedFile | File | ExistingFile): boolean => {
  if ('type' in file && file.type?.startsWith('image/')) return true;
  const fileName = 'name' in file ? file.name || '' : file.type || '';
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? IMAGE_EXTENSIONS.has(extension) : false;
};

const getFileIcon = (file: UploadedFile): React.ReactNode => {
  if (file.type) {
    const iconConfig = MIME_TO_ICON_MAP.get(file.type);
    if (iconConfig) {
      const { icon: IconComponent, color } = iconConfig;
      return <IconComponent className={`w-12 h-12 ${color}`} />;
    }
    
    if (file.type.startsWith('video/')) {
      return <FilmIcon className="w-12 h-12 text-purple-500" />;
    }
    if (file.type.startsWith('audio/')) {
      return <MusicalNoteIcon className="w-12 h-12 text-green-500" />;
    }
  }

  const extension = (file.name || '').split('.').pop()?.toLowerCase();
  if (extension) {
    const iconConfig = EXTENSION_TO_ICON_MAP.get(extension);
    if (iconConfig) {
      const { icon: IconComponent, color } = iconConfig;
      return <IconComponent className={`w-12 h-12 ${color}`} />;
    }
  }

  return <DocumentIcon className="w-12 h-12 text-gray-500" />;
};

/**
 * Compress image file if it exceeds MAX_FILE_SIZE
 * Maintains aspect ratio while reducing dimensions
 */
const compressImage = async (file: File): Promise<File> => {
  // Only compress if file is larger than MAX_FILE_SIZE and is an image
  if (file.size <= MAX_FILE_SIZE || !file.type.startsWith('image/')) {
    return file;
  }

  // Don't compress GIFs (to preserve animation) or SVGs (vector format)
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        // Only resize if image is larger than max dimensions
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = MAX_WIDTH;
            height = Math.round(width / aspectRatio);
          } else {
            height = MAX_HEIGHT;
            width = Math.round(height * aspectRatio);
          }
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Use high-quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to blob with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            
            // Create new file from compressed blob
            const compressedFile = new File(
              [blob],
              file.name,
              {
                type: file.type === 'image/png' ? 'image/png' : 'image/jpeg',
                lastModified: Date.now(),
              }
            );
            
            // Log compression results
            const originalSizeKB = (file.size / 1024).toFixed(2);
            const compressedSizeKB = (compressedFile.size / 1024).toFixed(2);
            console.log(`Compressed ${file.name}: ${originalSizeKB}KB → ${compressedSizeKB}KB (${width}x${height})`);
            
            resolve(compressedFile);
          },
          file.type === 'image/png' ? 'image/png' : 'image/jpeg',
          COMPRESSION_QUALITY
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

const FileInput: React.FC<FileUploadProps> = ({
  onFilesChange,
  multiple = false,
  className = '',
  maxFiles = 0,
  fileTypes = ['image'],
  accept,
  initialFiles = [],
  onFileRemove,
}) => {
  // Local state for display files derived from initialFiles
  const [filesToDisplay, setFilesToDisplay] = useState<UploadedFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const blobUrlsRef = useRef<string[]>([]);

  // Rebuild display files whenever initialFiles changes,
  // and carefully clean up any blob URLs we created.
  useEffect(() => {
    // cleanup previous blob URLs
    blobUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    });
    blobUrlsRef.current = [];

    const mapped: UploadedFile[] = initialFiles.map((file) => {
      if (file instanceof File) {
        const preview = URL.createObjectURL(file);
        blobUrlsRef.current.push(preview);

        return {
          name: file.name,
          type: file.type,
          preview,
          id: file.name,
          isExisting: false,
        };
      }

      const existingFile = file as ExistingFile;
      return {
        name: existingFile.name || existingFile.fileid || 'Unknown',
        type: existingFile.type,
        preview: existingFile.preview,
        id: existingFile.fileid,
        isExisting: true,
      };
    });

    setFilesToDisplay(mapped);

    return () => {
      // cleanup when unmounting or before next run
      blobUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      });
      blobUrlsRef.current = [];
    };
  }, [initialFiles]);

  const derivedAccept = useMemo(() => {
    if (accept) return accept;
    
    if (fileTypes.length === 0) return undefined;
    
    return fileTypes.reduce((acc, type) => {
      const mapping = FILE_TYPE_MAPPINGS[type];
      return mapping ? { ...acc, ...mapping } : acc;
    }, {} as Accept);
  }, [accept, fileTypes]);

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      if (!acceptedFiles?.length) return;

      const currentFileCount = filesToDisplay.length;
      const availableSlots = maxFiles > 0 ? Math.max(0, maxFiles - currentFileCount) : acceptedFiles.length;
      const filesToUpload = acceptedFiles.slice(0, availableSlots);

      try {
        setIsCompressing(true);
        
        // Compress images if needed
        const processedFiles = await Promise.all(
          filesToUpload.map(async (file) => {
            try {
              return await compressImage(file);
            } catch (error) {
              console.error(`Failed to compress ${file.name}:`, error);
              // Return original file if compression fails
              return file;
            }
          })
        );

        // Pass compressed files to parent
        onFilesChange(processedFiles);
      } catch (error) {
        console.error('Error processing files:', error);
        // Fallback to original files if something goes wrong
        onFilesChange(filesToUpload);
      } finally {
        setIsCompressing(false);
      }
    },
    [maxFiles, filesToDisplay.length, onFilesChange]
  );

  const removeFile = useCallback(
    (fileToRemove: UploadedFile) => {
      // Notify parent about removal; parent owns the real data
      onFileRemove?.(fileToRemove.id, fileToRemove.name || '');
    },
    [onFileRemove]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxFiles: maxFiles > 0 ? Math.max(0, maxFiles - filesToDisplay.length) : undefined,
    accept: derivedAccept,
  });

  const dropzoneClassName = `px-6 py-10 border-2 border-dashed rounded-md text-center cursor-pointer transition-colors ${
    isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
  } ${className}`;

  const isMaxFilesReached = maxFiles > 0 && filesToDisplay.length >= maxFiles;

  return (
    <div>
      {!isMaxFilesReached && (
        <div {...getRootProps({ className: dropzoneClassName })}>
          <input {...getInputProps()} disabled={isCompressing} />
          {isCompressing ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 dark:text-gray-400">Compressing images...</p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              {isDragActive ? 'Drop files here...' : 'Drag & drop, or click to select'}
            </p>
          )}
        </div>
      )}

      {filesToDisplay.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filesToDisplay.map((file, index) => (
            <div key={`${file.id || file.name}-${index}`} className="relative group">
              <a href={file.preview} target="_blank" rel="noreferrer">
                <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-md flex flex-col items-center justify-center p-2 overflow-hidden">
                  {isImageFile(file) ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <>
                      {getFileIcon(file)}
                      <span className="text-xs text-gray-600 dark:text-gray-300 mt-1 text-center truncate w-full px-1">
                        {file.name}
                      </span>
                    </>
                  )}
                </div>
              </a>

              <button
                type="button"
                className="absolute top-1 right-1 bg-white dark:bg-gray-700 rounded-full p-1 text-red-500 hover:text-red-700 transition-opacity opacity-0 group-hover:opacity-100 shadow-sm border border-gray-200 dark:border-gray-600"
                onClick={() => removeFile(file)}
                aria-label={`Remove ${file.name}`}
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileInput;