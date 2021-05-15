import {DBConfig, IDBStoreConfig, TStoreParameters} from "./indexeddb.config";
class DBVersion {
    private dbVersionMap: Record<string, number | undefined> = {}

    set(dbName: string, version: number | undefined) {
        this.dbVersionMap[dbName] = version;
    }

    get(dbName: string): number | undefined {
        return this.dbVersionMap[dbName];
    }
}

export class IDBClient {
    private static readonly dbVersion = new DBVersion();
    private indexedDB: IDBFactory;

    constructor(public dbName: string = DBConfig.NAME_DB_DEFAULT, public readonly storeConfig: IDBStoreConfig = DBConfig.for(dbName)) {
        const windowBrowser = window as any;
        this.indexedDB = windowBrowser.indexedDB || windowBrowser.mozIndexedDB || windowBrowser.webkitIndexedDB || windowBrowser.msIndexedDB || indexedDB;
    }

    get version() {
        return IDBClient.dbVersion.get(this.dbName);
    }

    set version(value: number | undefined) {
        IDBClient.dbVersion.set(this.dbName, value);
    }

    async deleteDb(dbName = this.dbName): Promise<boolean> {
        return new Promise(((resolve, reject) => {
            const request = this.indexedDB.deleteDatabase(dbName);
            request.onsuccess = () => {
                this.version = undefined;
                resolve(true);
            };
            request.onerror = () => reject(request.error);
        }))
    }

    async connect(dbName = this.dbName, version = this.version, upgradeNeeded = function (this: IDBOpenDBRequest, e: Event) {
    }): Promise<IDBDatabase> {
        const request: IDBOpenDBRequest = this.indexedDB.open(this.dbName, version);
        return new Promise((resolve, reject) => {
            request.onblocked = (e) => reject(e);
            request.onupgradeneeded = upgradeNeeded;
            request.onerror = (e) => reject(request.error);
            request.onsuccess = (e) => resolve(request.result);
        });
    }

    async getDb(dbName = this.dbName): Promise<IDBDatabase> {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.connect(dbName);
                resolve(db)
            } catch (err) {
                reject(err);
            }
        })
    }

    async getOrCreateObjectStore(storeName: string, params: TStoreParameters = this.storeConfig.get(storeName)) {
        let db = await this.getDb(params.database);
        console.log(" - version: " + (db.version ?? -1) + " | " + (this.version ?? -1))
        if (!this.version)
            this.version = db.version;

        if (!db.objectStoreNames.contains(storeName))
            this.version++;

        if (db.version === this.version) {
            console.log("no need to upgrade: ", storeName)
            return db;
        }

        // upgrade needed
        db.close();

        const {indices} = params;
        const indexedDb = this;
        return await this.connect(this.dbName, this.version, function (e) {
            let db = this.result;
            indexedDb.version = db.version;
            if (!db.objectStoreNames.contains(storeName)) {
                const objectStore = db.createObjectStore(storeName, params);
                console.log("objectStore created: ", {objectStore, params});
                if (!indices) {
                    return;
                }
                for (let index of indices) {
                    objectStore.createIndex(index.name, index.keyPath ?? index.name, index.options ?? {})
                    console.log("index created: ", {index});
                }
            }
        });
    }

    async storeTransaction(storeName: string, mode: IDBTransactionMode = "readonly", params?: TStoreParameters) {
        const store = storeName.toLowerCase();
        const storeParams = params ?? this.storeConfig.get(store);
        let db = await this.getOrCreateObjectStore(store, storeParams);

        db.onversionchange = (e) => {
            console.log("reloading db: " + store, e);
            db.close();
        };

        // make transaction
        const tx = db.transaction(store, mode);
        // tx.oncomplete = (e) => {console.log("transaction ", e)}
        return tx.objectStore(store);
    }
}