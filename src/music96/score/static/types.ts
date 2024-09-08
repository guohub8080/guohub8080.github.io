export type t_score_part = {}

export type t_partMeta_OneInstrument = {
	partID: string
	partName: string,
	partAbbr?: string
	midiChannel?: number
	midiProgram?: number
	midiPort?:number
	instrumentId?: number
	instrumentName?: string
	instrumentSound?: string
}