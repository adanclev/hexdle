import {useEffect, useReducer, useState} from 'react';
import { useForm } from "react-hook-form"
import { loginSchema, type LoginFormData } from "@/features/auth/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingTile } from "@/features/auth/components/LoadingTile";
import { useNavigate } from "react-router";
import {AuthRedirectText} from "@/features/auth/components/AuthRedirectText.tsx";
import {animationReducer} from "@/components/TileView/animationReducer.ts";
import {AlertError} from "@/features/auth/components/AlertError.tsx";
import { VIEWS } from "@/constants";

type ShowPwdState = {
    pwd: boolean;
    confirmPwd?: boolean;
}

interface Props {
    onSubmitClick: (data: LoginFormData) => Promise<void>,
}

export const SignIn = ({ onSubmitClick }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema)
    });
    const navigate = useNavigate()
    const [animationController, dispatch] = useReducer(animationReducer, { state: "animate-idle" });
    const [showPwd, setShowPwd] = useState<ShowPwdState>({
        pwd: false,
        confirmPwd: false
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState('');
    const [childrenAdvice, setChildrenAdvice] = useState<React.ReactNode>(
        <AuthRedirectText
            onRedirect={() => navigate("/auth/sign_up")}
            authView={VIEWS.SIGN_IN}
        />
    );

    useEffect(() => {
        dispatch({ type: "START", animation: "animate-flip-in" })
        const timeout = setTimeout(() => {
            setError('');
        }, 5000);

        return () => clearTimeout(timeout);
    }, [error]);

    const onSubmit = async (data: LoginFormData) => {
        setError('')

        setLoading(true)
        try {
            await onSubmitClick(data);
            navigate("/");
        } catch(error) {
            setError(error instanceof Error
                ? error.message
                : 'Something went wrong'
            );
        } finally {
            setLoading(false);
        }

    }

    return (
        <main className="grow my-0 mx-auto min-w-[380px] max-w-[380px] lg:min-w-[450px] lg:max-w-[450px]">
            <h1 className="text-[32px] md:text-[36px] text-center font-bold my-8">
                Welcome back
            </h1>

            <form className="block" onSubmit={handleSubmit(onSubmit)}>
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
                            tabIndex={-1}
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
                    <p className="text-imperial-red mt-1">{errors.password?.message}</p>
                </fieldset>

                <button
                    type="submit"
                    className="btn w-full mt-8 rounded-xs p-[8px] font-semibold text-base bg-light-300 dark:bg-dark-300"
                >
                    {loading
                        ? <LoadingTile label={'Logging in'}/>
                        : 'Log in'
                    }
                </button>
            </form>

            <section
                className={`w-full mt-2 rounded-md ${animationController.state}`}
                onAnimationEnd={() => {
                    dispatch({type: "END"})
                    setChildrenAdvice(error
                        ? <AlertError message={error}/>
                        : <AuthRedirectText
                            onRedirect={() => navigate("/auth/sign_up")}
                            authView={VIEWS.SIGN_IN}
                        />)
                }}
            >
                {childrenAdvice}
            </section>
        </main>
    )
}