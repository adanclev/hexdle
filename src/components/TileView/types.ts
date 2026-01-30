export type AnimationState =
    | "animate-idle"
    | "animate-flip-in"
    | "animate-flip-out"
    | "animate-pop-scale"
    | "animate-bounce"
    | "animate-shake";

export type AnimationFSM = {
    state: AnimationState;
    lastAction?: Action | null;
};

export type Action =
    | { type: "START", animation: AnimationState }
    | { type: "LOOP", sequence: AnimationState[] }
    | { type: "END" };