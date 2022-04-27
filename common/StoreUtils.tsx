import React, {useEffect} from 'react'
import {observer} from 'mobx-react'
import {RouterState} from 'react-router'
import {Spin} from 'ui-kit'

/**
 * Properties of View Loader HOC.
 * <S> - type of store
 */
export interface ViewLoaderConfig<S> {
    /**
     * Function initiates side-effects(loading data)
     * @param store - target store
     * @param routerState - Router state to get route params
     */
    startLoading: (store: S, routerState: Partial<RouterState>) => void
    /**
     * Function determines the loading conditions for view component.
     * @param store - target store
     */
    isLoaded: (store: S) => boolean
    /**
     * Function returns to create an instance of store
     */
    createStore: () => S
    /**
     * View component
     */
    component: React.ComponentType
    /**
     * Initial properties for the view component
     */
    componentProps?: Record<string, unknown>
}

/**
 * Function creates react context for specific store
 * <P> - type of a wrapped component props
 * <S> - type of store
 * @returns Context provider, hook to get store
 */
export function createViewStoreContext<S>(): {
    StoreProvider: React.Provider<S | null>
    useViewStore: () => S
} {
    const StoreContext = React.createContext<S | null>(null)

    const useViewStore = () => {
        const store = React.useContext(StoreContext)

        if (!store) {
            throw new Error('useViewStore must be used within a StoreContext.Provider')
        }

        return store
    }

    return {
        StoreProvider: StoreContext.Provider,
        useViewStore
    }
}

/**
 * Function creates following HOCs for specific store:
 * HOC to create view loader and HOC for connecting component to store
 * @returns HOC to create view loader, useStore hook
 */
export function storeBindingFactory<S>(): {
    createViewLoader: (config: ViewLoaderConfig<S>) => React.FC<Partial<RouterState>>
    useStore: () => S
} {
    const {StoreProvider, useViewStore} = createViewStoreContext<S>()

    function createViewLoader(config: ViewLoaderConfig<S>): React.FC<Partial<RouterState>> {
        const {startLoading, isLoaded, component: Component, componentProps = {}} = config

        const ViewLoader: React.FC<Partial<RouterState>> = observer(props => {
            const store = useViewStore()

            useEffect(() => {
                if (!isLoaded(store)) {
                    startLoading(store, props)
                }
            }, [])

            return isLoaded(store) ? (
                <Component {...componentProps} />
            ) : (
                <Spin />
            )
        })

        return (props: Partial<RouterState>) => (
            <StoreProvider value={config.createStore()}>
                <ViewLoader {...props} />
            </StoreProvider>
        )
    }

    return {
        useStore: useViewStore,
        createViewLoader
    }
}
