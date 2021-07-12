interface IProps {
    label: string
    color: string
    onClick: () => void
}

export default function Button({ label, color, onClick }: IProps) {
    return (
        <button className={`px-4 py-1 bg-${color}-600 mx-10 my-4 rounded`} onClick={onClick}>
            {label}
        </button>
    )
}
