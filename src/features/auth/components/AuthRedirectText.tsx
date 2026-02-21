import type {ViewType} from "@/types";
import { VIEWS } from "@/constants";

type Props = {
    onRedirect: () => void | Promise<void>;
    authView: ViewType;
}

export const AuthRedirectText = ({ onRedirect, authView }: Props) => {
    const promptText = authView === VIEWS.SIGN_UP
        ? "Already have an account?"
        : "New here?"
    const actionText = authView === VIEWS.SIGN_UP
        ? "Sign in"
        : "Create an account"

    return (
        <div className="p-4">
            <p className="text-center text-base rounded-md">
                {promptText} <span className='underline cursor-pointer' onClick={onRedirect}>{actionText}</span>
            </p>
        </div>

    )
}