import {DateTransform, Duration} from "./dates";
import {log} from "./logger";

test("transform date", () => {
    const date = new Date("2021-12-01T23:12:23");
    let dateTransform = DateTransform.for(date);

    let newDate = dateTransform.addDays(2).toDate();
    expect(newDate.getTime()).toBe(new Date("2021-12-03T23:12:23").getTime());

    newDate = dateTransform.truncate("day").toDate();
    expect(newDate.getTime()).toBe(new Date("2021-12-03T00:00:00").getTime());

    newDate = DateTransform.for("2021-12-03T21:12:23").truncate("day").toDate();
    expect(newDate.getTime()).toBe(new Date("2021-12-03T00:00:00").getTime());

    newDate = DateTransform.for("2021-12-03T21:12:23").truncate("month").toDate();
    expect(newDate.getTime()).toBe(new Date("2021-12-01T00:00:00").getTime());

    newDate = DateTransform.for("2021-12-03T21:12:23").truncate("year").toDate();
    expect(newDate.getTime()).toBe(new Date("2021-01-01T00:00:00").getTime());
})


test("time duration in hours", () => {
    const fromDate = new Date("2021-05-25T08:00:00");
    const fromDateTransform = DateTransform.for(fromDate);
    let toDate = fromDateTransform.addHours(4).toDate();

    expect(Duration.for(fromDate, toDate).toHours()).toBe(4);

    toDate = fromDateTransform.addHours(12).toDate();
    expect(Duration.for(fromDate, toDate).toHours()).toBe(16)
})

export {}