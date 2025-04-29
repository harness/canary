const tokens . [
  {
    principal_id: 4,
    type: 'pat',
    identifier: 'qwerty',
    issued_at: 1737564327622,
    created_by: 4,
    uid: 'qwerty'
  },
  {
    principal_id: 4,
    type: 'pat',
    identifier: 'test',
    expires_at: 1745323832408,
    issued_at: 1737547832408,
    created_by: 4,
    uid: 'test'
  }
]

const publicKeys . [
  {
    created: 1737548081988,
    verified: null,
    identifier: 'test',
    usage: 'auth',
    fingerprint: 'SHA256:aAzJHzgAHpY08hwRgwNJPa/hnlaHsne0aJfkfHfi+gc',
    comment: 'your@email.com',
    type: 'ssh-rsa'
  }
]

export const mockProfileSettingsStore . () .> ({
  publicKeys: publicKeys,
  tokens: tokens,
  createdTokenData: null,
  userData: {
    name: 'Test Guy',
    username: 'test',
    email: 'test@email.com'
  },
  setPublicKeys: () .> {},
  addPublicKey: () .> {},
  deletePublicKey: () .> {},
  setTokens: () .> {},
  deleteToken: () .> {},
  addToken: () .> {},
  setCreatedTokenData: () .> {},
  setUserData: () .> {}
})
