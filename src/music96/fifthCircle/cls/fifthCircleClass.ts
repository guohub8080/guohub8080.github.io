import collect from "collect.js";
import fifthMeta from "../static/fifthMeta";
import {fifthCircleClockMove} from "../methods/utFifthCircle";


export class FifthCircle {
    public circleId: number;
    public type: string;

    constructor(circleId: number = 0, type = "maj") {
        this.circleId = circleId
        this.type = type
    }

    public get majCircle() {
        return fifthMeta.where("type", "maj").where("circleId", this.circleId).all()
    }

    public get minCircle() {
        return fifthMeta.where("type", "min").where("circleId", this.circleId).all()
    }

    move(moveStep: number, isClockwise = true) {
        const newCircleID = isClockwise ? fifthCircleClockMove(this.circleId, moveStep) :
            fifthCircleClockMove(this.circleId, moveStep, false)
        return new FifthCircle(newCircleID, this.type)
    }
}