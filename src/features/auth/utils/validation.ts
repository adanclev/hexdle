import * as yup from "yup";
import { VIEWS } from '@/constants';

export const registerSchema = yup.object({
    name: yup.string()
        .min(2, "Enter your full name")
        .required("Name is required"),
    email: yup.string()
        .email('Please enter a valid email address')
        .required('Email address is required'),
    password: yup.string()
        .min(8, 'Please enter minimum 8 characters')
        .max(72, "Password exceeds maxmium length of 72 characters")
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords do not match')
        .required('Confirm your password'),
});

export const loginSchema = yup.object({
    email: yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    password: yup.string()
        .min(8, 'Please enter minimum 8 characters')
        .required('Password is required'),
});

export interface RegisterFormData extends yup.InferType<typeof registerSchema> {
    view: typeof VIEWS.SIGN_UP,
}
export interface LoginFormData extends yup.InferType<typeof loginSchema> {
    view: typeof VIEWS.SIGN_IN,
}