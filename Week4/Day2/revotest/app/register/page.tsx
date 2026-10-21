'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '../lib/auth';

type FormErrors = {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
};

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [formError, setFormError] = useState('');
    const [success, setSuccess] = useState(false);

    function validate(): FormErrors {
        const nextErrors: FormErrors = {};

        if (!username.trim()) {
            nextErrors.username = 'Username is required';
        }

        if (!email.trim()) {
            nextErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            nextErrors.email = 'Enter a valid email';
        }

        if (!password) {
            nextErrors.password = 'Password is required';
        } else if (password.length < 8) {
            nextErrors.password = 'Password must be at least 8 characters';
        }

        if (!confirmPassword) {
            nextErrors.confirmPassword = 'Please confirm your password';
        } else if (confirmPassword !== password) {
            nextErrors.confirmPassword = 'Passwords do not match';
        }

        return nextErrors;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitted(true);
        setFormError('');

        const validationErrors = validate();
        setErrors(validationErrors);
        setSuccess(false);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const registerError = registerUser({
            username: username.trim(),
            email: email.trim(),
            password,
        });

        if (registerError) {
            setFormError(registerError);
            return;
        }

        setSuccess(true);
        await new Promise((resolve) => setTimeout(resolve, 5000));

        router.push('/login');
    }

    function handleUsernameChange(value: string) {
        setUsername(value);
        if (submitted) {
            setErrors((current) => {
                const next = { ...current };
                if (value.trim()) {
                    delete next.username;
                } else {
                    next.username = 'Username is required';
                }
                return next;
            });
        }
    }

    function handleEmailChange(value: string) {
        setEmail(value);
        if (submitted) {
            setErrors((current) => {
                const next = { ...current };

                if (!value.trim()) {
                    next.email = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    next.email = 'Enter a valid email';
                } else {
                    delete next.email;
                }

                return next;
            });
        }
    }

    function handlePasswordChange(value: string) {
        setPassword(value);
        if (submitted) {
            setErrors((current) => {
                const next = { ...current };

                if (!value) {
                    next.password = 'Password is required';
                } else if (value.length < 8) {
                    next.password = 'Password must be at least 8 characters';
                } else {
                    delete next.password;
                }

                if (confirmPassword !== value) {
                    next.confirmPassword = confirmPassword
                        ? 'Passwords do not match'
                        : 'Please confirm your password';
                } else {
                    delete next.confirmPassword;
                }

                return next;
            });
        }
    }

    function handleConfirmPasswordChange(value: string) {
        setConfirmPassword(value);
        if (submitted) {
            setErrors((current) => {
                const next = { ...current };

                if (!value) {
                    next.confirmPassword = 'Please confirm your password';
                } else if (value !== password) {
                    next.confirmPassword = 'Passwords do not match';
                } else {
                    delete next.confirmPassword;
                }

                return next;
            });
        }
    }

    const inputClass =
        'w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 ' +
        'outline-none transition focus:border-blue-500 focus:ring-2 ' +
        'focus:ring-blue-100';

    const errorClass = 'mt-1 text-sm text-red-600';

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Create an account
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Register to get started with RevoShop.
                    </p>
                </div>

                <form
                    data-testid="register-form"
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-5"
                >
                    <div>
                        <label
                            htmlFor="username"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            data-testid="username-input"
                            name="username"
                            type="text"
                            autoComplete="username"
                            value={username}
                            onChange={(event) =>
                                handleUsernameChange(event.target.value)
                            }
                            aria-invalid={Boolean(errors.username)}
                            aria-describedby={
                                errors.username ? 'username-error' : undefined
                            }
                            className={inputClass}
                            placeholder="Enter your username"
                        />
                        {errors.username && (
                            <p
                                id="username-error"
                                data-testid="username-error"
                                role="alert"
                                className={errorClass}
                            >
                                {errors.username}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            data-testid="email-input"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => handleEmailChange(event.target.value)}
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                            className={inputClass}
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p
                                id="email-error"
                                data-testid="email-error"
                                role="alert"
                                className={errorClass}
                            >
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            data-testid="password-input"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(event) =>
                                handlePasswordChange(event.target.value)
                            }
                            aria-invalid={Boolean(errors.password)}
                            aria-describedby={
                                errors.password ? 'password-error' : undefined
                            }
                            className={inputClass}
                            placeholder="At least 8 characters"
                        />
                        {errors.password && (
                            <p
                                id="password-error"
                                data-testid="password-error"
                                role="alert"
                                className={errorClass}
                            >
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Confirm password
                        </label>
                        <input
                            id="confirmPassword"
                            data-testid="confirm-password-input"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(event) =>
                                handleConfirmPasswordChange(event.target.value)
                            }
                            aria-invalid={Boolean(errors.confirmPassword)}
                            aria-describedby={
                                errors.confirmPassword
                                    ? 'confirm-password-error'
                                    : undefined
                            }
                            className={inputClass}
                            placeholder="Re-enter your password"
                        />
                        {errors.confirmPassword && (
                            <p
                                id="confirm-password-error"
                                data-testid="confirm-password-error"
                                role="alert"
                                className={errorClass}
                            >
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <button
                        data-testid="register-submit"
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Register
                    </button>

                    {formError && (
                        <p
                            role="alert"
                            data-testid="register-error"
                            className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-700"
                        >
                            {formError}
                        </p>
                    )}
                    {success && (
                        <p
                            role="status"
                            data-testid="register-success"
                            className="rounded-lg bg-green-50 p-3 text-center text-sm text-green-700"
                        >
                            Validation successful! Your form is ready to submit.
                        </p>
                    )}
                </form>

                <p className="mt-6 text-center text-xs text-gray-500">
                    Demo registration form — no account will be created.
                </p>
            </section>
        </main>
    );
}
