export interface SecretReference {
  name: string
  type: string
  scope: string
  createdAt: number
}

export interface SecretActivity {
  event: string
  type: string
  scope: string
  createdAt: number
}
