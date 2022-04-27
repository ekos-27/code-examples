import {observable, action} from 'mobx'
import {User, ViewServices} from '../Types'
import {RootStore} from './RootStore'

export const LOAD_USER_ACTION = 'load_user_action'

export interface UserStore {
    user: User | null
    loadUser: () => void
}

export class UserStoreImpl implements UserStore {
    @observable user: User | null = null

    constructor(
        private rootStore: RootStore,
        private services: ViewServices
    ) {}

    loadUser = (): void => {
        this.rootStore.callService<User>(
            this.services.loadUser(),
            {
                successHandler: user => this.setUser(user)
            },
            LOAD_USER_ACTION
        )
    }

    @action
    setUser = (user: User) => {
        this.user = user
    }
}
