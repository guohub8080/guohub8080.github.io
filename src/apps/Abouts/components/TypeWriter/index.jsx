import styles from "./styles.js"
import {TypeAnimation} from 'react-type-animation';
import googleColors from "@/assets/colors/googleColors.js";


export default (props) => {
	
	return (<>
		<div css={styles.Frame}>
			<TypeAnimation
				sequence={[
					'while (true) {\n}', // Types 'One'
					1000, // Waits 1s
					'while (true) {\nmyself.do(...', 3000,// Deletes 'One' and types 'Two'
				
				]}
				wrapper="span"
				cursor={true}
				deletionSpeed={300}
				repeat={Infinity}
				style={{
					fontSize: '1.4em', fontWeight: 200,
					display: 'inline-block', width: "fit-content",
					borderRadius: 15,
					backgroundColor: googleColors.gray50,
					whiteSpace: 'pre-line',
					color: googleColors.indigo600,
					paddingLeft: "50px",
					paddingRight: "50px", paddingTop: "30px", paddingBottom: "30px"
				}}
			/>
		</div>
	
	
	</>)
}

