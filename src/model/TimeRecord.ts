import {Entity} from "../persistence/entities";
import {Index, Store} from "../persistence/driver/indexeddb.decorator";
@Store()
export class TimeRecord extends Entity {
    @Index()
    date?: number | undefined;
    timeStart?: Date | undefined;
    timeEnd?: Date | undefined;
    totalHours?: number | undefined;
}