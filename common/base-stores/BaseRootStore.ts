import {ActionsStoreImpl, ActionsStore} from './ActionsStore'
import {ErrorMessagesStoreImpl, ErrorMessagesStore} from './ErrorMessagesStore'
import {ErrorMessage} from '../Types'

export interface BaseRootStore {
    /**
     * Store for handling asynchronous actions
     */
    actionsStore: ActionsStore
    /**
     * Store for handling errors
     */
    errorStore: ErrorMessagesStore
    /**
     * The utility to call service
     */
    callService: <T>(
        service: Promise<T>,
        handlers: {
            successHandler: (payload: T) => void
            failureHandler?: (error: ErrorMessage) => void
        },
        actionName?: string
    ) => void
}

export class BaseRootStoreImpl implements BaseRootStore {
    public actionsStore: ActionsStore
    public errorStore: ErrorMessagesStore

    constructor() {
        this.actionsStore = new ActionsStoreImpl()
        this.errorStore = new ErrorMessagesStoreImpl()
    }

    callService<T>(
        service: Promise<T>,
        handlers: {
            successHandler: (payload: T) => void
            failureHandler?: (error: ErrorMessage) => void
        },
        actionName: string
    ): void {
        this.callPromiseService(service, handlers, actionName)
    }

    private async callPromiseService<T>(
        service: Promise<T>,
        handlers: {
            successHandler: (payload: T) => void
            failureHandler?: (error: ErrorMessage) => void
        },
        actionName: string = ''
    ): Promise<void> {
        const {successHandler, failureHandler} = handlers
        this.actionsStore.startAction(actionName)

        try {
            const result = await service
            successHandler(result)
        } catch (e) {
            const error = (await e.json()) as ErrorMessage

            handlers.failureHandler(error)

            if (failureHandler) {
                failureHandler(error)
            }
        } finally {
            this.actionsStore.completeAction(actionName)
        }
    }
}
