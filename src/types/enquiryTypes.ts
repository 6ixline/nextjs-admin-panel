import { PaginationMeta } from "./paginationType";

type Make = {
    id: number;
    title: string;
    slug: string;
}

type Category = {
    id: number;
    title: string;
    slug: string;
}

type Product = {
    id: number;
    name: string;
    product_code: string;
    ref_code: string;
    make: Make;
    category: Category
}

type User = {
    id: number;
    name: string;
    email: string;
    mobile: string;
}

export interface Enquiry {
    id: number;
    user_id: number;
    product_id: number;
    subject: string;
    message: string;
    status: string;
    priority: string;
    remarks: string;
    admin_reply: string | null | undefined;
    assigned_to: string | null;
    resolved_at: string | null;
    resolved_by: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    user: User,
    product: Product,
    assignedAdmin: string | null;
    resolvedByAdmin: string | null;
}

export interface PaginatedEnquiryResponse {
    data: Enquiry[];
    pagination: PaginationMeta;
}

export interface EnquiryResponse {
    success: boolean;
    message: string;
    data: Enquiry;
}
export interface EnquiryUpdate{
    status: string
    priority: string
    admin_reply: string
    remarks: string
    assigned_to: number | null
}
export interface CreateEnquiry{
    name: string,
    code: string;
    state: string;
    status: string;
}