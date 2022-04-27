export interface User {
    firstName: string
    lastName: string
}

export interface ViewServices {
    loadUser: () => Promise<User>
}
