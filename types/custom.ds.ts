declare module '@ioc:Adonis/Core/Request' {
  interface RequestContract {
    permissions?: string[]
  }
}
