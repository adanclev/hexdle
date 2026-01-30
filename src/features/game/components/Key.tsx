interface Props {
    keyName: string,
    special?: boolean,
    onPress: (value: string) => void
}

export const Key = ({ keyName, special, onPress }: Props) => {
    return (
        <button
            className={`key-btn ${special ? "md:w-[80px] capitalize" : "md:w-[40px] uppercase"}`}
            onClick={(e) => {
                onPress(keyName)
                e.currentTarget.blur()
            }}
            type="button"
        >
            <p className="text-[22px] md:text-[24px] text-white">{keyName}</p>
        </button>
    )
}
