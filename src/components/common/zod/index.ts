import { z } from "zod";

// ── AUTH SCHEMAS ──────────────────────────────────────────────
export const loginSchema = z.object({
    email: z.string().email("Email không đúng định dạng"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const registerSchema = z
    .object({
        fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
        email: z.string().email("Email không đúng định dạng"),
        password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

// ── BOOK SCHEMAS ──────────────────────────────────────────────
export const createBookSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được để trống"),
    isbn: z.string().min(1, "ISBN không được để trống"),
    description: z.string().optional(),
    quantity: z.coerce.number().min(0, "Số lượng không được nhỏ hơn 0"),
    imageUrl: z.string().url("URL ảnh không hợp lệ").optional().or(z.literal("")),
    authorId: z.coerce.number().optional(),
    categoryId: z.coerce.number().optional(),
});

// ── AUTHOR SCHEMAS ────────────────────────────────────────────
export const createAuthorSchema = z.object({
    name: z.string().min(1, "Tên tác giả không được để trống"),
    email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
    birthDate: z.string().optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
    imageUrl: z.string().url("URL ảnh không hợp lệ").optional().or(z.literal("")),
});

// ── CATEGORY SCHEMAS ──────────────────────────────────────────
export const createCategorySchema = z.object({
    name: z.string().min(1, "Tên danh mục không được để trống"),
    description: z.string().optional(),
});

// ── BORROW SCHEMAS ────────────────────────────────────────────
export const createBorrowSchema = z.object({
    userId: z.coerce.number().min(1, "Vui lòng chọn người dùng"),
    dueDate: z.string().min(1, "Vui lòng chọn ngày hạn trả"),
    items: z
        .array(
            z.object({
                bookId: z.coerce.number(),
                quantity: z.coerce.number().min(1),
            })
        )
        .min(1, "Phải có ít nhất 1 cuốn sách"),
});

// ── FINE SCHEMAS ──────────────────────────────────────────────
export const createFineSchema = z.object({
    borrowId: z.coerce.number().min(1, "Vui lòng chọn phiếu mượn"),
    amount: z.coerce.number().min(0, "Số tiền không hợp lệ"),
    reason: z.string().optional(),
});

// ── TYPES FROM SCHEMAS ────────────────────────────────────────
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type CreateBookFormValues = z.infer<typeof createBookSchema>;
export type CreateAuthorFormValues = z.infer<typeof createAuthorSchema>;
export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;
export type CreateBorrowFormValues = z.infer<typeof createBorrowSchema>;
export type CreateFineFormValues = z.infer<typeof createFineSchema>;