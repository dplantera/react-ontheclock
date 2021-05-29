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
    addTimeRecords: (timeRecords: TimeRecord[]) => void
    setTimeRecords: (timeRecords: TimeRecord[]) => void
    setCurrentTimeRecord: (timeRecord: Partial<TimeRecord>) => void
    currentTimeRecord: Partial<TimeRecord> & TimeRecord
    startRecord: () => void
    stopRecord: () => void
    fetchTimeRecords: () => Promise<void>
}
const timeRecordRepo = new IDBRepository(TimeRecord);


export const useTimeTableStore = create<TimeTableStore>((set: SetState<TimeTableStore>, get: GetState<TimeTableStore>) => (
    {
        timeRecords: [],
        addTimeRecords: (timeRecords: TimeRecord[]): void => {
            set({
                timeRecords: [...get().timeRecords, ...timeRecords]
            });
        },
        setTimeRecords: (timeRecords: TimeRecord[]): void => {
            set({
                timeRecords: [...timeRecords]
            });
        },
        currentTimeRecord: new TimeRecord(),
        setCurrentTimeRecord: (timeRecord: Partial<TimeRecord>): void => {
            const records = get().timeRecords;
            const newCurrent = Object.assign(get().currentTimeRecord, timeRecord);
            timeRecordRepo.update(newCurrent).then();
            records[records.length - 1] = newCurrent;
            set({
                currentTimeRecord: newCurrent,
                timeRecords: [...records]
            });
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
