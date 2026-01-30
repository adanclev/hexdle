import { useEffect, useState, useContext, useMemo } from "react";
import { GameInstructions } from "@/components/modals/GameInstructions";
import { GameOver } from "@/components/modals/GameOver";
import { Header, Footer, Modal } from "@/components"
import { Stats } from "@/components/modals/Stats";
import { Tooltip } from "@/components/Tooltip"
import { GameGrid } from "@/features/game/GameGrid"
import { Keyboard } from "@/features/game/Keyboard";
import { useGame } from "@/features/game/hooks/useGame";
import { getDailyRandomElement } from "@/features/game/lib/randomUtils"
import { MAX_DIGITS, defaultTileDelay, MSG_CODE, MSG_TYPE, MAX_GUESSES } from "@/features/game/constants"
import { GameContext } from "@/context/GameObjectContext";
import { GAME_STATUSES } from "@/constants";
import { getFeedbackWord, todayToString } from "@/lib/getGameInfo";

export const Game = ({ hasGameEnded }: { hasGameEnded: boolean }) => {
    const todayStr: string = todayToString();
    const dailyColor = useMemo(() => getDailyRandomElement(todayStr), [todayStr]);
    const { updateGuess, gameState, hasGameJustFinished } = useGame(dailyColor)
    const { gameContext, message, updateMessage } = useContext(GameContext)
    const [showModal, setShowModal] = useState<boolean>(gameContext?.status !== GAME_STATUSES.IN_PROGRESS);
    const [isClosing, setIsClosing] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(
        hasGameEnded
            ? <Stats />
            : <GameInstructions />
    );
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const animationDurationMs: number = 500

    useEffect(() => {
        const ms = animationDurationMs + defaultTileDelay * (MAX_DIGITS - 1);
        const { isGameOver, isCorrect, remainingGuesses, answer, guesses } = gameState;

        if (isGameOver && hasGameJustFinished) {
            setTimeout(() => {
                openModalWith(<GameOver answer={answer} guesses={guesses} won={isCorrect} hardMode={gameContext.hardMode} />)
            }, ms * (isCorrect ? 3 : 1))
        }

        if (isGameOver) {
            updateMessage({
                type: isCorrect ? MSG_TYPE.SUCCESS : MSG_TYPE.INFO,
                text: isCorrect
                    ? getFeedbackWord(MAX_GUESSES - remainingGuesses)
                    : answer.hex,
                code: isCorrect ? MSG_CODE.WIN : MSG_CODE.GAME_OVER
            })
            setTimeout(() => {
                setShowTooltip(true)
            }, ms)
        }
    }, [gameState.isGameOver, hasGameJustFinished])

    useEffect(() => {
        if (!message) setShowTooltip(false);
        if (message?.code === MSG_CODE.GAME_OVER) return;

        if (message?.code === MSG_CODE.NOT_ENOUGH_DIGITS ||
            message?.code === MSG_CODE.HARD_MODE) {
            setShowTooltip(true);
            const hideTimer = setTimeout(() => setShowTooltip(false), 1500);
            return () => clearTimeout(hideTimer);
        } else {
            const ms = (MAX_DIGITS + 1) * defaultTileDelay
            const hideTimer = setTimeout(() => setShowTooltip(false), ms + 1800);
            return () => clearTimeout(hideTimer);
        }
    }, [message]);

    const openModalWith = (content: React.ReactNode) => {
        setModalContent(content);
        setShowModal(true);
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowModal(false);
            setIsClosing(false);
        }, 200);
    };

    return (
        <div className="flex flex-col h-screen">
            <Header openModalWith={openModalWith} />
            <main className="relative top-0 left-0 flex flex-col flex-1 items-center justify-around md:justify-evenly mb-auto">
                {showTooltip && <Tooltip text={message?.text ?? ''} code={message?.code} />}
                <GameGrid guesses={gameState.guesses} currentGuess={gameState.currentGuess} />
                <Keyboard updateGuess={updateGuess} isModalVisible={showModal} />
            </main>
            <Footer />
            {(showModal) && (
                <Modal onClose={handleClose} isClosing={isClosing}>
                    {modalContent}
                </Modal>
            )}
        </div>
    )
}