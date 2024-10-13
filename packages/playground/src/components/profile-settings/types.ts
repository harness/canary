export interface KeysList {
  created?: number
  verified?: number | null
  identifier?: string
  usage?: string
  fingerprint?: string
  comment?: string
  type?: string
}

export interface TokensList {
  principal_id?: number
  type?: string
  identifier?: string
  expires_at?: number | null
  issued_at?: number
  created_by?: number
  uid?: string
}
