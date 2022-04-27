import {
    BaseRootStore,
    BaseRootStoreImpl,
    storeBindingFactory
} from '../../common'
import {ViewServices} from '../Types'
import {UserStore, UserStoreImpl} from './UserStore'

export interface RootStore extends BaseRootStore {
    services: ViewServices
    userStore: UserStore
}

export class RootStoreImpl extends BaseRootStoreImpl implements RootStore {
    userStore: UserStore

    constructor(
        public services: ViewServices
    ) {
        super()

        this.userStore = new UserStoreImpl(this, services)
    }
}

export const {createViewLoader, useStore} = storeBindingFactory<RootStore>()
