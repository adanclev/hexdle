import {type RegisterFormData, type LoginFormData} from "@/features/auth/utils/validation";
import { VIEWS } from "@/constants";
import { SignUp } from "@/features/auth/SignUp";
import { SignIn } from "@/features/auth/SignIn";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import type {ViewType} from "@/types";
import {registerWithEmail, signInWithPassword} from "@/features/auth/services/auth.service.ts";

type AuthData = RegisterFormData | LoginFormData

export const EmailAuth = () => {
    const { view } = useParams();
    const [authView, setAuthView] = useState<ViewType>(VIEWS.SIGN_IN);

    useEffect(() => setAuthView(view as ViewType), [view]);

    const onSubmit = async (data: AuthData) => {
        if (authView === VIEWS.SIGN_IN) {
            const {error} = await signInWithPassword(data)

            if (error) throw new Error(error.message)
            return;
        }

        if (authView === VIEWS.SIGN_UP) {
            const registerData = data as RegisterFormData

            const { data: signUpData, error } = await registerWithEmail(registerData)

            if (error) throw new Error(error.message)
            if (!signUpData.user) throw new Error('User not created')

            return
        }

        throw new Error('Invalid auth view')
    }


    switch(authView) {
        case VIEWS.SIGN_UP:
            return (
                <>
                    <title>Create account - #Hexdle</title>
                    <SignUp onSubmitClick={onSubmit} />
                </>
            )
        case VIEWS.SIGN_IN:
            return (
                <>
                    <title>Log in with password - #Hexdle</title>
                    <SignIn onSubmitClick={onSubmit} />
                </>
            )
        default:
            return null;
    }
}