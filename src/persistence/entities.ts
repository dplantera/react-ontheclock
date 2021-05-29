import {PrimaryKey} from "./driver/indexeddb.decorator";

export abstract class Entity {
    @PrimaryKey({autoIncrement: false})
    public id: string | number | undefined;
}


export const EntityObject = class EntityJS extends Entity {
};