// ── ENUMS ────────────────────────────────────────────────────
export type Role = "ADMIN" | "LIBRARIAN" | "READER";
export type BorrowStatus = "BORROWING" | "RETURNED" | "OVERDUE";
export type PaymentStatus = "PENDING" | "PAID";

// ── MODELS ───────────────────────────────────────────────────
export interface User {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
}

export interface Author {
    id: number;
    name: string;
    email?: string;
    birthDate?: string;
    location?: string;
    bio?: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
    _count?: { books: number };
}

export interface CreateCategoryFormValues {
    name: string;
    description?: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    _count?: { books: number };
}

export interface Book {
    id: number;
    title: string;
    isbn: string;
    description?: string;
    imageUrl?: string;
    quantity: number;
    available: number;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    authorId?: number;
    categoryId?: number;
    author?: Author;
    category?: Category;
}

export interface BorrowItem {
    id: number;
    borrowId: number;
    bookId: number;
    quantity: number;
    book?: Book;
}

export interface Borrow {
    id: number;
    userId: number;
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    status: BorrowStatus;
    totalFine: number;
    createdAt: string;
    user?: User;
    items?: BorrowItem[];
    fine?: Fine;
}

export interface Fine {
    id: number;
    borrowId: number;
    amount: number;
    reason?: string;
    status: PaymentStatus;
    createdAt: string;
    borrow?: Borrow;
}

export interface DashboardOverview {
    totalBooks: number;
    totalBorrows: number;
    overdueBorrows: number;
    fineRevenue: number;
}

// ── API RESPONSES ────────────────────────────────────────────
export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}