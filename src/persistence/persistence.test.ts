import {Entity} from "./entities";
import {IDBRepository} from "./repositories/IDBRepository";
import {IDBClient} from "./driver/IDBClient";
import {Newable} from "./repositories/interfaces";
import {Index, PrimaryKey, Store} from "./driver/indexeddb.decorator";

require("fake-indexeddb/auto");

// const dataStoreConfig = StoreConfig.getInstance().for("data");
// dataStoreConfig.autoIncrement = true;

let indexedDbClient = new IDBClient();

beforeEach(async () => {
    await indexedDbClient.deleteDb()
})

test('test crud operations on an object', async () => {
    type Data = { attrNum: number, attrStr: string } & Entity
    const data: Data = {id:undefined, attrNum: 1, attrStr: "test"};
    const storeData = new IDBRepository<Data>("data", indexedDbClient);

    // create
    const storedDate = await storeData.create(data);
    expect(storedDate.id).toBe(1);
    //read
    let foundData = await storeData.getById(1);
    expect(foundData.id).toBe(1);
    expect(foundData.attrNum).toBe(1);
    expect(foundData.attrStr).toBe("test");
    expect(storeData.dbClient.version.get()).toBe(2);
    //update
    foundData.attrNum = 2;
    foundData.attrStr = "test updated";

    let uptData = await storeData.update(foundData)
    expect(uptData).toBe(true);

    foundData = await storeData.getById(1);
    expect(foundData.id).toBe(1);
    expect(foundData.attrNum).toBe(2);
    expect(foundData.attrStr).toBe("test updated");
    // _id:undefined TS Workaround for IDB
    const forUpdate = {id:undefined, ...foundData, attrStr: "test partial upt"};
    uptData = await storeData.update(forUpdate);
    expect(uptData).toBe(true);

    foundData = await storeData.getById(1);
    expect(foundData.id).toBe(1);
    expect(foundData.attrNum).toBe(2);
    expect(foundData.attrStr).toBe("test partial upt");
    //delete
    const deleted = await storeData.delete(1);
    expect(deleted).toBe(true);

    foundData = await storeData.getById(1);
    expect(foundData).toBe(undefined);
})

test('create multiply objects of same type', async () => {
    jest.setTimeout(20000)
    type Data = { attrNum: number, attrStr: string } & Entity
    const data: Data[] = [];

    for (let i = 0; i < 20; i++) {
        data.push({id:undefined, attrNum: i, attrStr: "test-" + i})
    }

    const storeData = new IDBRepository<Data>("data", indexedDbClient);

    const storedDate = await storeData.createAll(data);
    expect(storedDate.length).toBe(data.length);
    for (let i = 0; i < 20; i++) {
        expect(storedDate[i].id).toBe(i + 1);
        expect(storedDate[i].attrNum).toBe(i);
        expect(storedDate[i].attrStr).toBe("test-" + i);
    }

    try {
        const existing = await storeData.create(storedDate[0]);
        fail("should raise ConstraintException: \n" + JSON.stringify(existing))
    } catch (err) {
        expect(err.name).toBe("ConstraintError");
    }
})

test('create multiply objects and stores of different type', async () => {
    type Data = { attrNum: number, attrStr: string } & Entity
    type DataTwo = { attrNum: number } & Entity
    type DataThree = { attrNum: number, attrBool: boolean } & Entity

    const dataStore = new IDBRepository("data", indexedDbClient);
    const dataTwoStore = new IDBRepository("data-two", indexedDbClient);
    const dataThreeStore = new IDBRepository("data-three", indexedDbClient);

    const data: Data = {id:undefined, attrNum: 1, attrStr: "test data"};

    let created = await dataStore.create(data);
    expect(created.id).toBe(1);
    expect(dataStore.dbClient.version.get()).toBe(2);

    const data2: DataTwo = {id:undefined, attrNum: 2};
    created = await dataTwoStore.create(data2);
    expect(created.id).toBe(1);
    expect(dataTwoStore.dbClient.version.get()).toBe(3);

    const data3: DataThree = {id:undefined, attrNum: 3, attrBool: true};
    created = await dataThreeStore.create(data3);
    expect(created.id).toBe(1);
    expect(dataThreeStore.dbClient.version.get()).toBe(4);
})

test("class without decorator", async () => {
    class Data extends Entity {
        static map = new Map();

        constructor(public attrNum: number, public attrStr: string) {
            super();
            Data.map.set("test", 1);
        }
    }

    const data = new Data(1, "test");
    const dataStore = new IDBRepository(Data, indexedDbClient);
    const created = await dataStore.create(data);
    expect(created.id).toBe(1);
    expect(dataStore.dbClient.version.get()).toBe(2);

    let foundData = await dataStore.getById(1);
    expect(foundData.id).toBe(1);
    expect(foundData).toBeInstanceOf(Data)
})

test("class with decorator", async () => {
    @Store()
    class DataDecorated extends Entity {
        attrNum:number;
        @Index()
        attrStr:string;
        constructor(attrNum: number, attrStr: string) {
            super();
            this.attrNum = attrNum;
            this.attrStr = attrStr;
        }
    }

    const data = new DataDecorated(1, "test2");
    const dataDecorated = new IDBRepository(DataDecorated, indexedDbClient);
    const created = await dataDecorated.create(data);
    expect(created.id).toBe(1);
    expect(dataDecorated.dbClient.version.get()).toBe(2);

    let foundData = await dataDecorated.getById(1);
    expect(foundData.id).toBe(1);
    expect(foundData).toBeInstanceOf(DataDecorated)
})

test("newable", () => {
    class Generic<T> {
        constructor(public type: Newable<T>) {
        }

        transform(object: T) {
            const newObj = Object.create(this.type.prototype);
            return Object.assign(newObj, object);
        }
    }

    class Data extends Entity {
        static map = new Map();

        constructor(public attrNum: number, public attrStr: string) {
            super();
            Data.map.set("test", 1);
        }
    }

    const generic = new Generic<Data>(Data);
    const obj = generic.transform({id:undefined, attrNum: 1, attrStr: "test-attr"})
    expect(obj).toBeInstanceOf(Data)
})

export {}