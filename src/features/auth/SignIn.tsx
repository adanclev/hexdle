import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"

export const SignIn = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex flex-col justify-center items-center m-auto">
                <header>
                    <h1
                        className="text-center text-[26px] md:text-[28px] mb-4 md:mx-40"
                    >
                        Log in or create an account to start tracking your stats and streaks
                    </h1>
                </header>

                <form action="" className="flex flex-col w-full px-4 md:px-0 md:w-[350px]">
                    <label htmlFor="email" className="font-bold text-[14px] md:text-[12px]">Email Address</label>
                    <input type="email" className="input-log mb-4" id="email"/>

                    <label htmlFor="password" className="font-bold text-[14px] md:text-[12px]">Password</label>
                    <input type="password" className="input-log" id="password"/>

                    <button type="submit" className="btn rounded-xs p-[8px] font-semibold text-[14px] md:text-[12px] mt-4 bg-light-300 dark:bg-dark-300">
                        Continue
                    </button>
                </form>
            </main>
        <Footer />
        </div>
    )
}