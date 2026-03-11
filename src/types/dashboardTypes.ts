export interface DashboardStats{
    dealerCount: string,
    internalCount: string,
    productCount: string,
    enquiryCount: string,
}

export interface DashBoardStatsResponse {
    success: string,
    message: string,
    data: DashboardStats
}

export interface AccountDetails {
    id: number;
    username: string;
    displayName: string;
    password: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface AccountDetailsResponse {
    success: string,
    message: string,
    data : AccountDetails
}