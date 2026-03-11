import axios from '@/utils/axiosInstance';

interface FileUpload{
    ownerType: string;
    ownerid: string | undefined;
    file: File;
    type: string;
}

interface SingleFile{
    id: number;
    url: string;
    owner_id: string;
    owner_type: string;
    type: string;
    status: string;
    updatedAt: string;
    createdAt: string;
}

interface SingleFileResponse{
    success: boolean;
    message: string;
    data: SingleFile;
}

export const uploadSingleFile = async ({ownerType, ownerid, file, type} : FileUpload): Promise<SingleFileResponse> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const url = `/file/upload/single/${ownerType}${ownerid ? `?ownerId=${ownerid}` : ''}`;

        

        const response = await axios.post<SingleFileResponse>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to upload file");
    }
};