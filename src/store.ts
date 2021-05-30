import create, {GetState, SetState} from "zustand";
import {TimeRecord} from "./model/TimeRecord";
import {DateTransform, Duration} from "./utils/dates";
import {IDBRepository} from "./persistence/repositories/IDBRepository";
import {NotificationProps} from "./components/Notification";
import {MenuProps} from "./components/Menu";

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
    updateRecord: (timeRecord: Partial<TimeRecord>) => void
    fetchTimeRecords: () => Promise<void>
}
const timeRecordRepo = new IDBRepository(TimeRecord);


export const useTimeTableStore = create<TimeTableStore>((set: SetState<TimeTableStore>, get: GetState<TimeTableStore>) => (
    {
        timeRecords: [],
        currentTimeRecord: new TimeRecord(),
        updateRecord: async (timeRecord: Partial<TimeRecord>) => {
            const prevRecord = get().timeRecords.find(tr => tr.id === timeRecord.id);

            const determineId = () => {
                if (!prevRecord && timeRecord.id)
                    return timeRecord.id;
                if (!prevRecord && timeRecord.timeStart)
                    return DateTransform.for(timeRecord.timeStart).truncate("day").toDate().getTime();
                if (timeRecord.timeStart && prevRecord?.timeStart?.getTime() !== timeRecord.timeStart?.getTime())
                    return DateTransform.for(timeRecord.timeStart).truncate("day").toDate().getTime();
                if (timeRecord.id)
                    return timeRecord.id;
                if (prevRecord)
                    return prevRecord.id;
            }

            if (timeRecord.timeStart && timeRecord.timeEnd)
                timeRecord.totalHours = Duration.for(timeRecord.timeStart, timeRecord.timeEnd).toHours()
            if (!prevRecord || timeRecord?.timeStart?.getTime() !== prevRecord?.timeStart?.getTime()) {
                const id = determineId();
                const newRecord = {id, ...timeRecord};
                set({timeRecords: [...get().timeRecords, newRecord]})
                await timeRecordRepo.update(newRecord);
            }
            if (prevRecord) {
                const id = determineId();
                const newRecord = {...prevRecord, ...timeRecord, id};
                set({timeRecords: [...get().timeRecords.filter(r => r.id !== prevRecord.id), newRecord]})
                if (prevRecord.id)
                    await timeRecordRepo.delete(prevRecord.id);
                await timeRecordRepo.update(newRecord);
            }
        },
        startRecord: (): void => {
            const records = get().timeRecords;
            const newRecord = get().currentTimeRecord;
            const now = new Date();
            newRecord.id = DateTransform.for(now).truncate("day").toDate().getTime();
            newRecord.date = DateTransform.for(now).truncate("day").toDate().getTime();
            newRecord.timeStart = now;
            set({
                currentTimeRecord: newRecord,
                timeRecords: [...records, newRecord]
            });
        },
        stopRecord: (): void => {
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
            timeRecordRepo.update(currentTimeRecord);
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
