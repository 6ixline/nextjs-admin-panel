import React from 'react';
import Label from '@/components/form/Label';
import FileInput from "@/components/form/input/FileInput";
import { ExistingFile } from "@/types/fileTypes";
import { PROPERTY_FORM_CONSTANTS } from '../constants/propertyConstants';

interface PropertyMediaUploadProps {
  displayImages: (File | ExistingFile)[]; 
  displayDocs: (File | ExistingFile)[]; 
  onImageUpload: (files: File[]) => void;
  onDocUpload: (files: File[]) => void;
  onFileRemove: (fileId: string | undefined, fileName: string) => void;
}

export default function PropertyMediaUpload({
  displayImages,
  displayDocs,
  onImageUpload,
  onDocUpload,
  onFileRemove
}: PropertyMediaUploadProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Media Upload</h3>
      
      <div className="space-y-6">
        <div>
          <Label>Property Images</Label>
          <FileInput
            onFilesChange={onImageUpload}
            multiple={true}
            maxFiles={PROPERTY_FORM_CONSTANTS.FILE_LIMITS.MAX_IMAGES}
            fileTypes={[...PROPERTY_FORM_CONSTANTS.FILE_TYPES.IMAGES]}
            initialFiles={displayImages} 
            onFileRemove={onFileRemove}
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload property images (Max: {PROPERTY_FORM_CONSTANTS.FILE_LIMITS.MAX_IMAGES} images)
          </p>
        </div>

        <div>
          <Label>Property Documents</Label>
          <FileInput
            onFilesChange={onDocUpload}
            multiple={true}
            maxFiles={PROPERTY_FORM_CONSTANTS.FILE_LIMITS.MAX_DOCUMENTS}
            fileTypes={[...PROPERTY_FORM_CONSTANTS.FILE_TYPES.DOCUMENTS]}
            initialFiles={displayDocs} 
            onFileRemove={onFileRemove}
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload property documents like agreements, certificates, etc. 
            (Max: {PROPERTY_FORM_CONSTANTS.FILE_LIMITS.MAX_DOCUMENTS} files)
          </p>
        </div>
      </div>
    </div>
  );
}