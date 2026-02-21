import { useEffect, useState } from "react";

interface Props {
    children: React.ReactNode,
    onClose: () => void,
    isClosing?: boolean
}

export const Modal = ({ children, onClose, isClosing }: Props) => {
    const handleClickInside = (e: React.MouseEvent) => {
        e.stopPropagation();
    };
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    useEffect(() => {
        if (isClosing) {
            setIsModalVisible(false);
        } else{
            setTimeout(() => {
                setIsModalVisible(true);
            }, 200);
        }
    }, [isClosing])

    const overlayClass = isModalVisible
        ? "duration-200 bg-modal/50 dark:bg-modal-dark/50"
        : "duration-200 bg-modal/0 dark:bg-modal-dark/0"

    const animationClass = isModalVisible
        ? "duration-200 opacity-100 scale-100"
        : "duration-200 opacity-0 scale-95";

    return (
        <div className={`fixed z-10 inset-0 flex items-center justify-center p-4 transition-opacity ${overlayClass}`} onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                className={`bg-light-100 dark:bg-dark-100 px-8 py-8 rounded-lg w-full max-w-fit relative shadow-[0_4px_23px_0_rgba(0,0,0,0.2)] transition-all transform ${animationClass}`}
                onClick={handleClickInside}
            >
                <button
                    className="absolute top-4 right-4 cursor-pointer text-primary-light dark:text-primary-dark"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7 md:size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>
                {children}
            </div>
        </div>
    );
}
