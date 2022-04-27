import {observable, computed, action} from 'mobx'

export enum ActionState {
    started = 'started',
    completed = 'completed',
    failed = 'failed'
}

export interface ActionsStore {
    actions: Map<string, ActionState>
    startAction: (actionName: string) => void
    completeAction: (actionName: string) => void
    failAction: (actionName: string) => void
    isRunning: (actionName: string) => boolean
    isCompleted: (actionName: string) => boolean
}

export class ActionsStoreImpl implements ActionsStore {
    @observable actions: Map<string, ActionState> = new Map()

    @action
    startAction = (actionName: string) => {
        this.actions.set(actionName, ActionState.started)
    }

    @action
    completeAction = (actionName: string) => {
        this.actions.set(actionName, ActionState.completed)
    }

    @action
    failAction = (actionName: string) => {
        this.actions.set(actionName, ActionState.failed)
    }

    @computed
    get isRunning(): (actionName: string) => boolean {
        return (actionName: string) => this.actions.get(actionName) === ActionState.started
    }

    @computed
    get isCompleted(): (actionName: string) => boolean {
        return (actionName: string) => this.actions.get(actionName) === ActionState.completed
    }
}
