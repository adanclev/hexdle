import { Link } from "react-router";
import {Footer, Header} from "@/components";
import {TileView} from "@/components/TileView";
import {defaultTileDelay} from "@/features/game/constants";

export const NotFound = () => {
    const code404 = ['4', '0', '4'];

    return (
        <div className="flex flex-col h-screen">
            <title>404 Not Found - #Hexdle</title>
            <Header />
            <main className="size-full flex flex-col items-center justify-center">
                <section className="grid grid-cols-3 gap-2 mb-4">
                    {code404.map((num, idx) =>
                        <TileView
                            key={idx}
                            state={'tile-submitted'}
                            color={'tile-not-found'}
                            delay={idx * defaultTileDelay}
                            animation={'animate-flip-in'}
                        >
                            <p className="text-[48px] md:text-[60px] px-4">{num}</p>
                        </TileView>
                    )}
                </section>
                <h2 className="text-[32px] md:text-[40px] text-center">Page Not Found</h2>
                <p className="text-[16px] md:text-[20px] text-center mb-2">
                    Sorry, but the page you are trying to reach cannot be found.
                </p>
                <Link className="btn bg-light-300 rounded-full py-2 px-6 text-base dark:bg-dark-300" to={"/"}>
                    Go to main page
                </Link>
            </main>
            <Footer />
        </div>
    )
}