export const getIndexOrIntervalOctaveRounds = (indexValue: number): [number, number] => {
    if (1 <= indexValue && indexValue <= 7) {
        return [0, indexValue]
    }
    let indexWithinOctave = indexValue
    let octaveValue = 0
    if (indexValue > 7) {
        while (indexWithinOctave > 7) {
            indexWithinOctave -= 7
            octaveValue += 1
        }
        return [octaveValue, indexWithinOctave]
    }
    while (indexWithinOctave < 1) {
        indexWithinOctave += 7
        octaveValue -= 1
    }
    return [octaveValue, indexWithinOctave]

}

export const getSemitoneOctaveRounds = (semitone: number): [number, number] => {
    if (0 <= semitone && semitone <= 11) {
        return [0, semitone]
    }
    let semitoneWithinOctave = semitone
    let octaveValue = 0
    if (semitone > 11) {
        while (semitoneWithinOctave > 11) {
            semitoneWithinOctave -= 12
            octaveValue += 1
        }
        return [octaveValue, semitoneWithinOctave]
    }
    while (semitoneWithinOctave < 0) {
        semitoneWithinOctave += 12
        octaveValue -= 1
    }
    return [octaveValue, semitoneWithinOctave]
}