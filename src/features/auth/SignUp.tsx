import {useEffect, useReducer, useState} from 'react';
import {useNavigate} from "react-router";
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup";
import {registerSchema, type RegisterFormData} from "@/features/auth/utils/validation";
import {animationReducer} from "@/components/TileView/animationReducer";
import {PasswordStrengthMeter} from "@/features/auth/components/PasswordStrengthMeter";
import {LoadingTile} from "@/features/auth/components/LoadingTile";
import {AlertError} from "@/features/auth/components/AlertError";
import {AuthRedirectText} from "@/features/auth/components/AuthRedirectText";
import { VIEWS } from "@/constants";

type ShowPwdState = {
    pwd: boolean;
    confirmPwd?: boolean;
}

interface Props {
    onSubmitClick: (data: RegisterFormData) => Promise<void>,
}

export const SignUp = ({onSubmitClick}: Props) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema)
    });
    const navigate = useNavigate()
    const [animationController, dispatch] = useReducer(animationReducer, { state: "animate-idle" });
    const [showPwd, setShowPwd] = useState<ShowPwdState>({
        pwd: false,
        confirmPwd: false
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState('');
    const [childrenAdvice, setChildrenAdvice] = useState<React.ReactNode>(<></>);

    useEffect(() => {
        dispatch({ type: "START", animation: "animate-flip-in" })

        if (!error) return;
        const timeout = setTimeout(() => {
            setError('');
        }, 5000);

        return () => clearTimeout(timeout);
    }, [error]);

    const onSumbit = async (data: RegisterFormData) => {
        setLoading(true);
        setError('');
        try {
            await onSubmitClick(data);
            navigate("/")
        } catch (error) {
            setError(error instanceof Error
                ? error.message
                : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const password = watch('password')

    return (
        <main className="grow my-0 mx-auto min-w-[380px] max-w-[380px] lg:min-w-[450px] lg:max-w-[450px]">
            <h1 className="text-[32px] md:text-[36px] text-center font-bold my-8">
                 Create an account
            </h1>

            <form className="block" onSubmit={handleSubmit(onSumbit)}>
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
                            onClick={() => {
                                setShowPwd(prev => ({
                                    ...prev, pwd: !prev.pwd
                                }))
                            }}
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
                    {password &&
                        <PasswordStrengthMeter text={password}/>
                    }
                    <p className="text-imperial-red mt-1">{errors.password?.message}</p>
                </fieldset>

                <fieldset className={`fieldset-form ${errors.confirmPassword ? 'mb-2' : 'mb-8'}`}>
                    <div className="flex justify-between">
                        <label htmlFor="confirmPwd" className="label-form">
                            Confirm Password
                        </label>
                        <button
                            tabIndex={-1}
                            type="button"
                            className="tracking-widest underline mr-2 cursor-pointer text-[12px]"
                            onClick={() => {
                                setShowPwd(prev => ({
                                    ...prev, confirmPwd: !prev.confirmPwd
                                }))
                            }}
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
                    <p className={`text-imperial-red mt-1 `}>
                        {errors.confirmPassword?.message}
                    </p>
                </fieldset>

                <button
                    type="submit"
                    className="btn w-full mt-8 rounded-xs p-[8px] font-semibold text-base bg-light-300 dark:bg-dark-300"
                >
                    {loading
                        ? <LoadingTile label={"Creating account"}/>
                        : "Create account"
                    }
                </button>
            </form>

            <section
                className={`w-full mt-2 ${animationController.state}`}
                onAnimationEnd={() => {
                    dispatch({type: "END"})
                    setChildrenAdvice(error
                        ? <AlertError message={error}/>
                        : <AuthRedirectText
                            onRedirect={() => navigate("/auth/sign_in")}
                            authView={VIEWS.SIGN_UP}
                        />)
                }}
            >
                {childrenAdvice}
            </section>

        </main>
    )
}