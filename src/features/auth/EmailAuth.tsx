import { useState, useEffect } from 'react';
import { PasswordStrengthMeter } from "@/features/auth/components/PasswordStrengthMeter";
import { useForm } from "react-hook-form"
import {registerSchema, loginSchema, type RegisterFormData, type LoginFormData} from "@/features/auth/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingTile } from "@/features/auth/components/LoadingTile";
import type { ViewType } from '@/types';
import { VIEWS } from "@/constants";
import { SupabaseClient } from "@supabase/supabase-js";
import {Navigate, useNavigate} from "react-router";

type ShowPwdState = {
    pwd: boolean;
    confirmPwd?: boolean;
}

interface Props {
    authView: ViewType,
    supabaseClient: SupabaseClient,
}

type AuthData = RegisterFormData | LoginFormData

export const EmailAuth = ({ authView='sign_in', supabaseClient }: Props) => {
    const schema = authView === VIEWS.SIGN_IN ? loginSchema : registerSchema
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<AuthData>({
        resolver: yupResolver(schema),
        defaultValues: { view: authView }
    });
    const [showPwd, setShowPwd] = useState<ShowPwdState>({
        pwd: false,
        confirmPwd: false
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    const onSubmit = async (data: AuthData) => {
        setError('')
        setLoading(true)

        switch (authView) {
            case VIEWS.SIGN_IN: {
                const { error: signInError } =
                    await supabaseClient.auth.signInWithPassword({
                        email: data.email,
                        password: data.password,
                    })
                if (signInError) {
                    setError(signInError.message)
                } else {
                    return <Navigate to="/" />
                }
                break
            }
            case VIEWS.SIGN_UP: {
                const {
                    data: { user: signUpUser, session: signUpSession },
                    error: signUpError,
                } = await supabaseClient.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            display_name: data?.name,
                        },
                    },
                });
                if (signUpError) setError(signUpError.message)

                if (signUpUser && signUpSession) {
                    setMessage('Signup successfully')
                    return <Navigate to="/" />
                }
                break
            }
        }
        setLoading(false)
    }

    const handleAuthMode = () => {
        if (authView === VIEWS.SIGN_UP) {
            navigate("/auth/sign_in");
        } else if (authView === VIEWS.SIGN_IN) {
            navigate("/auth/sign_up");
        }
    }

    const password = watch('password')

    useEffect(() => {
        reset({ view: authView })
    }, [authView, reset])

    return (
        <main className="grow my-0 mx-auto min-w-[380px] max-w-[380px] lg:min-w-[450px] lg:max-w-[450px]">
            <h1 className="text-[32px] md:text-[36px] text-center font-bold my-8">
                {authView === VIEWS.SIGN_UP ? 'Create an account' : 'Welcome back'}
            </h1>

            <form className="block" onSubmit={handleSubmit(onSubmit)}>
                {authView === VIEWS.SIGN_UP &&
                    <fieldset className={`fieldset-form ${errors.name ? 'mb-2' : 'mb-8'}`}>
                        <label htmlFor="name" className="label-form">
                            Name
                        </label>
                        <input
                            type="text"
                            className={`input-form ${errors.name ? 'invalid' : ''}`}
                            id="name"
                            {...register('name')}
                        />
                        <p className="text-imperial-red mt-1">{errors.name?.message}</p>
                    </fieldset>
                }

                <fieldset className={`fieldset-form ${errors.email ? 'mb-2' : 'mb-8'}`}>
                    <label htmlFor="email" className="label-form">
                        Email address
                    </label>
                    <input
                        type="email"
                        className={`input-form ${errors.email ? 'invalid' : ''}`}
                        id="email"
                        {...register('email')}
                    />
                    <p className="text-imperial-red mt-1">{errors.email?.message}</p>

                </fieldset>

                <fieldset className={`fieldset-form ${errors.password ? 'mb-2' : 'mb-8'}`}>
                    <div className="flex justify-between">
                        <label htmlFor="password" className="label-form">
                            Password
                        </label>
                        <button
                            type="button"
                            className="tracking-widest underline mr-2 cursor-pointer text-[12px]"
                            onClick={() => setShowPwd(prev => ({
                                ...prev, pwd: !prev.pwd
                            }))}
                        >
                            {showPwd.pwd ? "Hide" : "Show"}
                        </button>
                    </div>
                    <input
                        type={showPwd.pwd ? "text" : "password"}
                        className={`input-form ${errors.password ? 'invalid' : ''}`}
                        id="password"
                        {...register('password')}
                    />
                    {(authView === VIEWS.SIGN_UP && password) &&
                        <PasswordStrengthMeter text={password}/>
                    }
                    <p className="text-imperial-red mt-1">{errors.password?.message}</p>
                </fieldset>

                {authView === VIEWS.SIGN_UP &&
                    <fieldset className="fieldset-form">
                        <div className="flex justify-between">
                            <label htmlFor="confirmPwd" className="label-form">
                                Confirm Password
                            </label>
                            <button
                                type="button"
                                className="tracking-widest underline mr-2 cursor-pointer text-[12px]"
                                onClick={() => setShowPwd(prev => ({
                                    ...prev, confirmPwd: !prev.confirmPwd
                                }))}
                            >
                                {showPwd.confirmPwd ? "Hide" : "Show"}
                            </button>
                        </div>
                        <input
                            type={showPwd.confirmPwd ? "text" : "password"}
                            className={`input-form ${errors.confirmPassword ? 'invalid' : ''}`}
                            id="confirmPwd"
                            {...register('confirmPassword')}
                        />
                        <p className={`${errors.confirmPassword ? 'visible' : 'invisible'} text-imperial-red mt-1`}>
                            {errors.confirmPassword?.message ?? 'Lorem ipsum dolor sit amet'}
                        </p>
                    </fieldset>
                }

                <button
                    type="submit"
                    className="btn w-full mt-8 rounded-xs p-[8px] font-semibold text-base bg-light-300 dark:bg-dark-300"
                >
                    {loading
                        ? <LoadingTile label={authView === VIEWS.SIGN_UP ? "Creating account" : 'Logging in'}/>
                        : authView === VIEWS.SIGN_UP ? "Create account" : 'Log in'
                    }
                </button>
            </form>

            {authView === VIEWS.SIGN_UP
                ? <p className="text-center text-base mt-4 md:mt-8">
                    Already have an account? <span className='underline cursor-pointer' onClick={handleAuthMode}>Sign in</span>
                </p>
                : <p className="text-center text-base mt-4 md:mt-8">
                    New here? <span className='underline cursor-pointer' onClick={handleAuthMode}>Create an account</span>
                </p>
            }

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </main>
    )
}