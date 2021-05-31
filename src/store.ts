import create, {GetState, SetState} from "zustand";
import {TimeRecord} from "./model/TimeRecord";
import {DateTransform, Duration} from "./utils/dates";
import {IDBRepository} from "./persistence/repositories/IDBRepository";
import {NotificationProps} from "./components/Notification";
import {MenuProps} from "./components/menu/Menu";

type NotificationStore = {
    open: boolean,
    setOpen: (open: boolean) => void,
    props: NotificationProps
    notify: (props: NotificationProps) => void
}

export const useNotificationStore = create<NotificationStore>((set: SetState<NotificationStore>, get: GetState<NotificationStore>) => ({
    open: false,
    props: {content: undefined, title: undefined, type: "info"},
    setOpen: (open: boolean): void => {
        if (!open)
            set({open: false, props: {content: undefined, title: undefined, type: "info"}});
        else
            set({open: open});
    },
    notify: (props: NotificationProps) => {
        set({props: {type: "info", ...props}, open: true})
    },
}));

type CalendarStore = {
    selectedDates: Date[],
    changeSelectedDate: (dates: Date[]) => void
}
export const useCalendarStore = create<CalendarStore>((set: SetState<CalendarStore>, get: GetState<CalendarStore>) => ({
    selectedDates: [DateTransform.for(new Date()).truncate("day").toDate()],
    changeSelectedDate: (dates: Date[]): void => {
        set({selectedDates: [...dates]});
    }
}));

type TimeTableStore = {
    timeRecords: TimeRecord[]
    currentTimeRecord: Partial<TimeRecord> & TimeRecord
    startRecord: () => void
    stopRecord: () => void
    updateRecord: (timeRecord: Partial<TimeRecord>) => Promise<void>,
    createRecord: (timeRecord: Partial<TimeRecord>) => Promise<TimeRecord>
    deleteRecord: (id: number | string) => Promise<boolean>
    fetchTimeRecords: () => Promise<void>
}
const timeRecordRepo = new IDBRepository(TimeRecord);

const insertSorted = (timeRecords: TimeRecord[], newRecord: TimeRecord) => {
    if (newRecord?.id) {
        const successorIdx = timeRecords.findIndex(successor => (successor.id && newRecord.id) && successor.id > newRecord.id);
        const insertIdx = successorIdx > 0 ? successorIdx : timeRecords.length;
        timeRecords.splice(insertIdx , 0, newRecord)
    }
}
export const useTimeTableStore = create<TimeTableStore>((set: SetState<TimeTableStore>, get: GetState<TimeTableStore>) => (
    {
        timeRecords: [],
        currentTimeRecord: new TimeRecord(),
        updateRecord: async (timeRecord: Partial<TimeRecord>) => {
            console.log("update record: ", {timeRecord})
            const timeRecords = get().timeRecords;
            const oldRecordIdx = timeRecords.findIndex(tr => tr.id === timeRecord.id);

            const hasOldRecord = oldRecordIdx !== -1;
            const oldRecord =  hasOldRecord? get().timeRecords[oldRecordIdx]: null;

            const determineId = () => {
                if (!oldRecord && timeRecord.id)
                    return timeRecord.id;
                if (!oldRecord && timeRecord.timeStart)
                    return timeRecord.timeStart.getTime();
                if (timeRecord.timeStart && oldRecord?.timeStart?.getTime() !== timeRecord.timeStart?.getTime())
                    return timeRecord.timeStart.getTime();
                if (timeRecord.id)
                    return timeRecord.id;
                if (oldRecord)
                    return oldRecord.id;
            }

            if (timeRecord.timeStart && timeRecord.timeEnd)
                timeRecord.totalHours = Duration.for(timeRecord.timeStart, timeRecord.timeEnd).toHours()

            const id = determineId();
            const newRecord = hasOldRecord? {...oldRecord,...timeRecord, id}: {...timeRecord, id};
            const hasIdChanged = oldRecord?.id !== newRecord.id;

            // id changed => replace record
            if(hasOldRecord && hasIdChanged){
                timeRecords.splice(oldRecordIdx, 1);
                insertSorted(timeRecords, newRecord);
            }
            // same id => update record
            else if(hasOldRecord)
                timeRecords[oldRecordIdx] = newRecord;
            // new record => create
            else
                insertSorted(timeRecords, newRecord);

            set({timeRecords: [...timeRecords]})

            // id is determined by start date => delete old if it has changed
            if (oldRecord?.id && hasIdChanged) {
                await timeRecordRepo.delete(oldRecord.id);
            }
            console.debug("update or create new record: ", {
                oldRecordIdx,
                oldRecord,
                newRecord,
            })
            await timeRecordRepo.update(newRecord);
        },
        createRecord: async (timeRecord: Partial<TimeRecord>) => {
            if (!timeRecord.timeStart)
                throw new Error("start time required.")

            const newRecord: TimeRecord = {
                ...timeRecord,
                id: timeRecord.timeStart.getTime(),
                date: DateTransform.for(timeRecord.timeStart).truncate("day").toDate().getTime(),
            };
            if (timeRecord.timeEnd)
                newRecord.totalHours = Duration.for(timeRecord.timeStart, timeRecord.timeEnd).toHours();

            const timeRecords = get().timeRecords;
            insertSorted(timeRecords, newRecord);
            set({timeRecords: [...timeRecords]})
            console.log("create: ", {newRecord})
            return await timeRecordRepo.create(newRecord);
        },
        deleteRecord: async (id) => {
            set({timeRecords: get().timeRecords.filter(r => r.id !== id)})
            return await timeRecordRepo.delete(id);
        },
        startRecord: (): void => {
            const records = get().timeRecords;
            const newRecord = get().currentTimeRecord;
            const now = new Date();
            newRecord.id = now.getTime();
            newRecord.date = DateTransform.for(now).truncate("day").toDate().getTime();
            newRecord.timeStart = now;
            set({
                currentTimeRecord: newRecord,
                timeRecords: [...records, newRecord]
            });
        },
        stopRecord: async (): Promise<void> => {
            const records = get().timeRecords;
            const currentTimeRecord = get().currentTimeRecord;
            currentTimeRecord.timeEnd = new Date();
            if (!currentTimeRecord.timeStart)
                throw Error("this should never happen")
            currentTimeRecord.totalHours = Duration.for(currentTimeRecord.timeStart, currentTimeRecord.timeEnd).toHours()
            records[records.length - 1] = currentTimeRecord;
            set({
                currentTimeRecord: new TimeRecord(),
                timeRecords: [...records]
            });
            await timeRecordRepo.update(currentTimeRecord);
        },
        fetchTimeRecords: async (): Promise<void> => {
            const timeRecords = await timeRecordRepo.getAll();
            set({
                currentTimeRecord: timeRecords.find(record => !record.timeEnd) ?? new TimeRecord(),
                timeRecords: [...timeRecords]
            });
        },

    }
));


type MenuStore = {
    visible: boolean
    props: MenuProps
    setVisible: (visible: boolean) => void
    open: (props: MenuProps) => void
}

export const useMenuStore = create<MenuStore>((set: SetState<MenuStore>, get: GetState<MenuStore>) => ({
    visible: false,
    props: {position: {x: 0, y: 0}},
    setVisible: (visible: boolean) => {
        set({visible: visible})
    },
    open: (props: MenuProps) => {
        set({props: props, visible: true})
    }
}));
