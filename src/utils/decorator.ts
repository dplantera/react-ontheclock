export type ClassDecoratorFactory = (...args: any) => (constructor: Function) => any
export type PropertyDecoratorFactory = (...args: any) => (target: any, propertyKey: string) => any
export type MethodDecoratorFactory = (...args: any) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any
export type AccessorDecoratorFactory = (...args: any) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any
export type ParameterDecoratorFactory = (...args: any) => (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => any

