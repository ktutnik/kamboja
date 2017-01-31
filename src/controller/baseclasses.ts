

export interface ExecutorCommand{
    execute(parameters:any[]):Promise<void>
}