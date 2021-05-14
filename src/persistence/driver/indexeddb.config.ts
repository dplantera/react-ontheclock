import {getCollectedMetaInfo} from "./indexeddb.decorator";

export type TStoreIndex = { name: string, keyPath?: string | string[], options?: IDBIndexParameters }
export type TStoreParameters =
    IDBObjectStoreParameters
    & { name?: string, indices?: Array<TStoreIndex>, database?: string };

export class DBConfig {
    private static instance: DBConfig;
    public static readonly NAME_DB_DEFAULT = "default_db";
    private readonly STORE_CONFIGS: Record<string, DBStoreConfig> = {};

    private static init() {
        DBConfig.instance = new DBConfig()
        const collectedMeta = getCollectedMetaInfo();

        Object.keys(collectedMeta).forEach(className => {
            const collectedInfo = collectedMeta[className];
            const {database, store, ...props} = collectedInfo;

            const dbName = database ?? DBConfig.NAME_DB_DEFAULT;
            DBConfig.for(dbName).add(className, {...props, name: store, database: dbName})
        })
    }

    static for(databaseName: string) {
        if (!DBConfig.instance)
            DBConfig.init()

        const config = DBConfig.instance.STORE_CONFIGS[databaseName];
        if (!config)
            DBConfig.instance.STORE_CONFIGS[databaseName] = new DBStoreConfig();

        return DBConfig.instance.STORE_CONFIGS[databaseName];
    }
}

export interface IDBStoreConfig {
    add(storeName: string, config: Partial<TStoreParameters>): IDBStoreConfig;
    get(store: string): any;
}

class DBStoreConfig implements IDBStoreConfig {
    private readonly STORE_CONFIGS: Record<string, TStoreParameters> = {};
    private storeParamsDefault: TStoreParameters = {
        keyPath: "id",
        autoIncrement: true
    }

    add(storeName: string, config: Partial<TStoreParameters> = this.storeParamsDefault) {
        const storeNameLowerCase = storeName.toLowerCase();
        let storeConfig = this.get(storeNameLowerCase);
        if (storeConfig)
            this.STORE_CONFIGS[storeNameLowerCase] = {...storeConfig, ...config};
        else
            this.STORE_CONFIGS[storeNameLowerCase] = config
        return this;
    }

    get(store: string) {
        const storeNameLowerCase = store.toLowerCase();
        if (!this.STORE_CONFIGS[storeNameLowerCase])
            return this.storeParamsDefault;
        return this.STORE_CONFIGS[storeNameLowerCase];
    }

    addPrimaryKey(store: string, key: string) {
        const currentKeyPath = this.get(store).keyPath;
        if (typeof currentKeyPath === "string" && currentKeyPath)
            this.add(store, {keyPath: [currentKeyPath, key]})

    }

}