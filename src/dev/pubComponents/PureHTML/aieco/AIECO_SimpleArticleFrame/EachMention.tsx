import { EachMentionProps } from "./types.ts";

const OneTitle = (props: { name: string }) => (
    <section style={{
        textAlign: "center",
        fontSize: 14,
        marginTop: 5,
        color: "#616161",
        wordBreak: "break-all",
        paddingLeft: 10,
        paddingRight: 10,
        width: "100%",
        lineHeight: 1.3
    }}>
        {props.name}
    </section>
);

const EachMention = (props: EachMentionProps) => {
    const letterSpacing = 2;

    return (
        <section style={{ marginBottom: 25 }}>
            <section style={{
                width: 100,
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                height: 22,
                fontSize: 15,
                fontWeight: 700,
                paddingLeft: letterSpacing,
                margin: "0 auto",
                borderBottom: `10px ${props.titleUnderColor} solid`,
                letterSpacing: letterSpacing,
                color: props.titleColor,
            }}>
                {props.title}
            </section>
            {typeof props.name === "undefined" && <OneTitle name={"商务部经济合作局"} />}
            {typeof props.name === "string" && <OneTitle name={props.name} />}
            {props.name instanceof Array && props.name.map((x, y) => (
                <OneTitle key={y} name={x} />
            ))}
        </section>
    );
};

export default EachMention;

