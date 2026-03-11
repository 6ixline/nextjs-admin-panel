export interface FileUploadData {
    id: number | undefined;
    file: File
}
  
export interface ExistingFile{
    fileid: string;
    type: string;
    preview: string;
    name?: string;
}