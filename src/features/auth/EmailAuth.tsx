import {type RegisterFormData, type LoginFormData} from "@/features/auth/utils/validation";
import type { ViewType } from '@/types';
import { VIEWS } from "@/constants";
import { SupabaseClient } from "@supabase/supabase-js";
import { SignUp } from "@/features/auth/SignUp";
import { SignIn } from "@/features/auth/SignIn";

interface Props {
    authView: ViewType,
    supabaseClient: SupabaseClient,
}

type AuthData = RegisterFormData | LoginFormData

export const EmailAuth = ({ authView='sign_in', supabaseClient }: Props) => {
    const onSubmit = async (data: AuthData) => {
        if (authView === VIEWS.SIGN_IN) {
            const {error} = await supabaseClient.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            })

            if (error) throw new Error(error.message)
            return
        }

        if (authView === VIEWS.SIGN_UP) {
            const registerData = data as RegisterFormData

            const {data: signUpData, error} =
                await supabaseClient.auth.signUp({
                    email: registerData.email,
                    password: registerData.password,
                    options: {
                        data: {display_name: registerData.name},
                    },
                })

            if (error) throw new Error(error.message)
            if (!signUpData.user) throw new Error('User not created')

            return
        }

        throw new Error('Invalid auth view')
    }


    switch(authView) {
        case VIEWS.SIGN_UP:
            return <SignUp onSubmitClick={onSubmit} />
        case VIEWS.SIGN_IN:
            return <SignIn onSubmitClick={onSubmit} />
        default:
            return null;
    }
}