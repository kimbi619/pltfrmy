export interface User {
    id?: string
    firstName: string
    lastName: string
    email: string
    password?: string
  }
  
  export interface AuthResponse {
    user: User
    token: string
  }
  
  