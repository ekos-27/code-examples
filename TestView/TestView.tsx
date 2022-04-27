import React, {FC} from 'react'
import {observer} from 'mobx-react'
import {createViewLoader, useStore, RootStoreImpl} from './store'

const loadUser = () => Promise.resolve({
    firstName: 'Adam',
    lastName: 'Smith'
})

const TestComponent: FC = observer(() => {
    const store = useStore()
    const firstName = store.userStore.user?.firstName

    return (
        <h1>Hello {firstName}!</h1>
    )
})

export const TestView = createViewLoader({
    createStore: () => new RootStoreImpl({loadUser}),
    startLoading: (store, _) => {
        store.userStore.loadUser()
    },
    isLoaded: store => !!store.userStore.user,
    component: TestComponent
})
