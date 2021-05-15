/*https://saul-mirone.github.io/a-complete-guide-to-typescript-decorator/*/

import {TStoreParameters} from "./indexeddb.config";
import {ClassDecoratorFactory, PropertyDecoratorFactory} from "../../utils/decorator";

type TMetaInfo = { store: string, database?: string } & TStoreParameters;
const MetaInfo: Record<string, TMetaInfo> = {};

export const Store: ClassDecoratorFactory = (args: { name?: string, database?: string }) => {
    return (constructor: Function) => {
        const cfg = MetaInfo[constructor.name];
        MetaInfo[constructor.name] = {
            ...cfg,
            store: args?.name ?? constructor.name.toLowerCase(),
            database: args?.database
        }
    }
}

export const PrimaryKey: PropertyDecoratorFactory = (args: { autoIncrement: boolean }) => {
    return (target: any, propertyKey: string) => {
        const cfg = MetaInfo[target.constructor.name];
        const getKeyPath = () => {
            if (cfg?.keyPath && typeof cfg.keyPath === "string")
                return [cfg.keyPath, propertyKey];
            if (cfg?.keyPath && Array.isArray(cfg.keyPath))
                return [...cfg.keyPath, propertyKey];

            return [propertyKey];
        }
        const keyPath = getKeyPath();
        MetaInfo[target.constructor.name] = {
            ...cfg, keyPath, ...args
        }
    }
}

export const Index: PropertyDecoratorFactory = () => {
    return (target: any, propertyKey: string) => {
        const cfg = MetaInfo[target.constructor.name];
        const getIndices = () => {
            const newIndex = {name: propertyKey};
            if (cfg?.indices)
                return [...cfg.indices, newIndex]
            return [newIndex];
        }
        const indices = getIndices();
        MetaInfo[target.constructor.name] = {...cfg, indices};
    }
}

export const getCollectedMetaInfo = () => ({...MetaInfo});