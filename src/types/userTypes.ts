import { ExistingFile } from "./fileTypes";
import { PaginationMeta } from "./paginationType";


export interface User {
    id: number;
    name: string;
    email: string;
    password: string,
    mobile: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    fileData: ExistingFile[]
}

export interface PaginatedUsersResponse {
    data: User[];
    pagination: PaginationMeta;
}

export interface GetAllUsersParams {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    order: 'asc' | 'desc';
    role: string;
}

export interface UserResponse {
    success: boolean;
    message: string;
    data: User;
}
export interface UserUpdate{
    name: string;
    email: string;
    mobile: string;
    status: string;
    fileid: string | number | undefined;
    filesToDelete: string[];
}
export interface CreateUser{
    name: string,
    email: string;
    mobile: string;
    password: string;
    status: string;
    fileid: string | number | undefined;
    role: string | undefined;

}