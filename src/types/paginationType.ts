export interface PaginationMeta {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
}

export interface Pagination {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    order: 'asc' | 'desc';
}
export interface PaginationReview extends Pagination {
    status?: string;
}