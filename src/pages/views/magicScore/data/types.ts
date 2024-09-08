export type t_scorePartMeta = {
	clef: "G" | "P" | "B" | "M"
	instrument: string
	midiChannel: number
	midiProgram: number
	partName: string
}
export type t_scorePartObj = {
	partMeta: t_scorePartMeta
	notesList: any[] | []
}

export type t_scoreMeta = {
	clef: string,
	title: string,
	subTitle: string,
	left: string,
	right: string,
	bpm: number,
	beat: string,
	fifth: number,
	mode: "major" | "minor",
}