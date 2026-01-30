import { Tile } from "@/features/game/components/Tile";
import { rules, examples } from "@/constants";

export const GameInstructions = () => {
    return (
        <section className="w-full sm:w-[350px] h-fit text-primary-light dark:text-primary-dark">
            <header>
                <h1 className="text-[20px] md:text-[24px] font-bold mb-2">How to Play</h1>
            </header>
            <h2 className="text-[18px] md:text-[20px] mb-2">Guess the hex color in 6 tries</h2>

            <article>
                <ul className="list-disc space-y-1 pl-8 mb-4">
                    {rules.map(rule => (
                        <li
                            key={rule.id}
                            className="text-[12px] md:text-[14px] text-wrap"
                        >
                            {rule.text}
                        </li>
                    ))}
                </ul>
            </article>

            <article>
                <p className="font-bold text-[14px] md:text-[16px] mb-2">Examples:</p>
                {examples.map(example => {
                    const { characters } = example;
                    return (
                        <section key={example.id}>
                            <div className="grid grid-cols-6 gap-2 mb-2 h-full w-[260px]">
                                {characters.map((char, index) => (                                    
                                    <Tile hexDigit={char} key={index} index={index} onModal/>
                                ))}
                            </div>
                            <p className="text-[12px] md:text-[14px] text-wrap mb-4">
                                <span className="font-bold">{example.character}</span> {example.description}
                            </p>
                        </section>
                    )
                })}
            </article>
        </section>
    );
}
