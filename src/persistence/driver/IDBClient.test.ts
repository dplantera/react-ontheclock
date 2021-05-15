import {IDBClient} from "./IDBClient";
import {TStoreParameters} from "./indexeddb.config";
require("fake-indexeddb/auto");

const NAME_TEST_DB = "test-db";

test("default client", async () => {
    let underTest = new IDBClient();

    let db = await underTest.connect(NAME_TEST_DB);
    expect(db.version).toBe(1);
    // db.close();

    const storeParams: TStoreParameters = {
        database: NAME_TEST_DB,
    }
    db = await underTest.getDbForStore("test-storage", storeParams);

    expect(db.version).toBe(2);
    expect(db.name).toContain(NAME_TEST_DB);
    expect(db.objectStoreNames).toContain("test-storage");
})

export {}