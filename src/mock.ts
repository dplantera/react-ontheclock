import {TimeRecord} from "./model/TimeRecord";
import {DateTransform, Duration} from "./utils/dates";
import {IDBRepository} from "./persistence/repositories/IDBRepository";
import {log} from "./utils/logger";

function getRandom(from: number, to: number) {
    return Math.floor(Math.random() * to) + from;
}

export async function mockTimeRecords() {
    const timeRecordStore = new IDBRepository(TimeRecord);
    const records = await timeRecordStore.getAll();
    if(records.length > 0)
        return
    const startDay = DateTransform.for(new Date()).truncate("day").addHours(8).toDate();
    const timeRecords: TimeRecord[] = [];

    // within the last week
    for (let day = 1; day <= 7; day++) {

        let lastEnd: Date = startDay;
        for (let i = 0; i < getRandom(1, 3); i++) {
            // up to 3 records per day
            const newRecord = new TimeRecord();
            const pause = i % 2 === 0? 30 : 45;
            newRecord.timeStart = DateTransform
                .for(lastEnd)
                .addDays(-1 * day)
                .addMinutes(pause)
                .toDate();

            newRecord.timeEnd = DateTransform
                .for(newRecord.timeStart)
                .addHours(getRandom(1, 7))
                .toDate();

            newRecord.date = DateTransform.for(newRecord.timeStart).truncate("day").toDate().getTime();
            newRecord.totalHours = Duration.for(newRecord.timeStart, newRecord.timeEnd).toHours();
            newRecord.id = newRecord.timeStart.getTime();

            timeRecords.push(newRecord);
            lastEnd = newRecord.timeEnd;
        }
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    timeRecordStore.updateAll(timeRecords).then((records) => {
        log.info("imported mock records: ", {timeRecords})
    })
}

