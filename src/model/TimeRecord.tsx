import {Entity} from "../persistence/entities";
import {Index, Store} from "../persistence/driver/indexeddb.decorator";

@Store()
export class TimeRecord extends Entity {
    @Index()
    date: Date;
    timeStart: Date;
    timeEnd: Date;
    totalHours: number;

    constructor(date: Date, timeStart: Date, timeEnd: Date, totalHours: number) {
        super();
        this.date = date;
        this.timeStart = timeStart;
        this.timeEnd = timeEnd;
        this.totalHours = totalHours;
    }
}