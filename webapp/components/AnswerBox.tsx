
function AnswerLetter({val}: {val: string}) {
    const status = val === "*" ? "unknown" : "known";
    return <span className={`AnswerLetter ${status}`}>{val}</span>
}

export default function AnswerBox({value}: {value: String}): JSX.Element {
    return (
        <span className="AnswerBox">
            {value.split("").map( val => (
                <AnswerLetter val={val} />
            ))}
        </span>
    )
}
