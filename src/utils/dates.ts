export class Duration {
    constructor(public startDate: Date, public endDate: Date) {
    }

    toHours() {
        let diffTimeInMs = this.endDate.getTime() - this.startDate.getTime();
        const hour_in_min = 60, min_in_sec = 60, sec_in_ms = 1000;
        const hour_in_ms = sec_in_ms * min_in_sec * hour_in_min;
        return (diffTimeInMs / hour_in_ms)
    }
}