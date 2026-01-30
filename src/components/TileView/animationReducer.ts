import type { Action, AnimationFSM } from '@/components/TileView/types'

export function animationReducer(
    controller: AnimationFSM,
    action: Action
): AnimationFSM {
    switch (action.type) {
        case "START":
            return { state: action.animation };

        case "END":
            if (controller.state === "animate-flip-in")
                return { state: "animate-flip-out" };
            if (
                controller.state === "animate-flip-out" ||
                controller.state === "animate-pop-scale" ||
                controller.state === "animate-bounce" ||
                controller.state === "animate-shake"
            )
                return { state: "animate-idle" };

            return { state: controller.state };

        case "LOOP": {
            const sequence = action.sequence;
            const index = sequence.indexOf(controller.state);

            const nextState =
                index === -1
                    ? sequence[0]
                    : sequence[index + 1] ?? sequence[0];

            return {
                state: nextState,
                lastAction: action
            };
        }

        default:
            return controller;
    }
}