import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { SignInPage, type SignInData } from '@harnessio/ui/views'

// Source: https://stackoverflow.com/a/30106551
// Encoding UTF-8 -> base64
function b64EncodeUnicode(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16))
    })
  )
}

// Decoding base64 -> UTF-8
function b64DecodeUnicode(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
}

function createAuthToken(email: string, password: string): string {
  const encodedToken = b64EncodeUnicode(email + ':' + password)
  return `Basic ${encodedToken}`
}

export default function SignIn() {
  const navigate = useNavigate()
  const handleSignIn = useCallback(({ email, password }: SignInData) => {
    if (!email || !password) return

    const authToken = createAuthToken(email, password)
    fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ authorization: authToken })
    })
      .then(res => res.json())
      .then(res => {
        localStorage.setItem('token', res.resource.token)
        localStorage.setItem('accountId', res.resource.defaultAccountId)
        navigate(`/dashboard`)
      })
  }, [])

  return <SignInPage handleSignIn={handleSignIn} />
}
