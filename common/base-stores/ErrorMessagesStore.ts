import {observable, action} from 'mobx'
import {ErrorMessage} from '../Types'

export interface ErrorMessagesStore {
    /**
     * The list of error messages
     */
    errorMessages: ErrorMessage[]
    /**
     * Handler for error notifications
     * @param message
     */
    handleError: (message: ErrorMessage) => void
}

export class ErrorMessagesStoreImpl implements ErrorMessagesStore {
    @observable errorMessages: ErrorMessage[] = []

    @action
    handleError = (errorMessage: ErrorMessage) => {
        const {code, message} = errorMessage

        console.error(code, message)

        this.errorMessages.push(errorMessage)
    }
}
