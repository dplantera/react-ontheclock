import {getCollectedMetaInfo} from "./indexeddb.decorator";

export type TStoreIndex = { name: string, keyPath?: string | string[], options?: IDBIndexParameters }
export type TStoreParameters =
    IDBObjectStoreParameters
    & { database: string, name?: string, indices?: Array<TStoreIndex> };

export class StoreConfig {
    public static readonly NAME_DB_DEFAULT = "default_db";
    private static instance: StoreConfig;
    private storeConfig: IStoreConfig;

    private constructor() {
        this.storeConfig = new IDBStoreConfig(StoreConfig.NAME_DB_DEFAULT);
    }

    static getInstance() {
        if (!StoreConfig.instance)
            StoreConfig.init();
        return StoreConfig.instance;
    }

    private static init() {
        StoreConfig.instance = new StoreConfig()
        const collectedMeta = getCollectedMetaInfo();
        Object.keys(collectedMeta).forEach(className => {
            const collectedInfo = collectedMeta[className];
            const {database, store, ...props} = collectedInfo;

            const dbName = database ?? StoreConfig.NAME_DB_DEFAULT;
            StoreConfig.instance.storeConfig.add(className, {...props, name: store, database: dbName})
        })
    }

    for(store: string) {
        return StoreConfig.getInstance().storeConfig.get(store);
    }
}

export interface IStoreConfig {
    add(storeName: string, config: Partial<TStoreParameters>): IStoreConfig;

    get(store: string): any;
}

class IDBStoreConfig implements IStoreConfig {
    private static readonly STORE_CONFIGS: Record<string, TStoreParameters> = {};
    public storeParamsDefault: TStoreParameters

    constructor(defaultDbName: string) {
        this.storeParamsDefault = {
            keyPath: "id",
            autoIncrement: true,
            database: defaultDbName
        }
    }

    add(storeName: string, config: Partial<TStoreParameters> = this.storeParamsDefault) {
        const storeNameLowerCase = storeName.toLowerCase();
        let storeConfig = this.get(storeNameLowerCase);
        if (storeConfig)
            IDBStoreConfig.STORE_CONFIGS[storeName] = {...storeConfig, ...config};
        else
            IDBStoreConfig.STORE_CONFIGS[storeName] = {...this.storeParamsDefault, ...config}
        return this;
    }

    get(storeName: string) {
        if (!IDBStoreConfig.STORE_CONFIGS[storeName])
            return this.storeParamsDefault;
        return IDBStoreConfig.STORE_CONFIGS[storeName];
    }
}