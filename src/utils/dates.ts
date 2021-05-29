function roundTwoDecimals(number: number) {
    //https://www.delftstack.com/howto/javascript/javascript-round-to-2-decimal-places/
    const m = Number((Math.abs(number) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(number);
}

export class Duration {
    private static instance = new Duration(new Date(), new Date());

    private constructor(public startDate: Date, public endDate: Date) {
    }

    static for(startDate: Date, endDate: Date) {
        Duration.instance.startDate = startDate;
        Duration.instance.endDate = endDate;
        return Duration.instance;
    }

    toHours() {
        let diffTimeInMs = this.endDate.getTime() - this.startDate.getTime();
        const hour_in_min = 60, min_in_sec = 60, sec_in_ms = 1000;
        const hour_in_ms = sec_in_ms * min_in_sec * hour_in_min;
        return roundTwoDecimals((diffTimeInMs / hour_in_ms))
    }
}

export class DateTransform {
    private static getInstance = new DateTransform();

    private constructor(private date:Date = new Date()) {
    }

    static for(date: Date | string) {
        return DateTransform.getInstance.for(date);
    }

    for(date: Date | string) {
        this.date = typeof date === "string" ? new Date(date) : new Date(date.getTime());
        return this;
    }

    toDate() {
        return this.date;
    }

    truncate(mode: "day" | "month" | "year" = "day"): DateTransform {
        const date = this.date;
        switch (mode) {
            case "day":
                this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                return this;
            case "month":
                this.date = new Date(date.getFullYear(), date.getMonth());
                return this;
            case "year":
                this.date = new Date(date.getFullYear(), 0);
                return this;
        }
        return this;
    }

    addDays(days: number) {
        const date = this.date.getDate();
        this.date.setDate(date + days)
        return this;
    }

    addHours(hours: number) {
        const date = this.date.getHours();
        this.date.setHours(date + hours)
        return this;
    }

    addMinutes(minutes: number) {
        const date = this.date.getMinutes();
        this.date.setMinutes(date + minutes)
        return this;
    }
}