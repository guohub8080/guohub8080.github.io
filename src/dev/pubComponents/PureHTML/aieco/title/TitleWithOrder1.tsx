import {ReactNode} from "react";

const TitleWithOrder1 = (props: {
    index: string,
    children?: ReactNode
}) => {
    return <section style={{width: "fit-content", margin: "0 auto", paddingTop: 20, paddingBottom: 10}}>
        <section>
            <section style={{
                width: 70, height: 70, backgroundColor: "#33A3CC", margin: "0 auto -30px auto",
                paddingTop: 10, fontSize: 17, fontWeight: 700, color: "#eefff6", textAlign: "center",
                borderRadius: 999
            }}>
                {props.index}
            </section>

            <section>
                <section style={{
                    backgroundColor: "#0f73dc", color: "white", width: "fit-content",
                    margin: "0 auto", padding: "5px 30px 5px 30px", fontSize: 17,
                    fontWeight: 700
                }}>
                    {props.children}
                </section>
                <section style={{
                    width: "80%", backgroundColor: "#b5eaf2",
                    height: 8, marginTop: -5, marginLeft: "auto", marginRight: "auto",
                }}/>
             </section>

        </section>
    </section>
}
export default TitleWithOrder1
