import React, { useState } from 'react'
import { noop } from 'lodash-es'
import { Home } from '../components/home'
import PlaygroundLandingSettings from '../settings/landing-settings'
import { SignInPage } from '../pages/signin-page'
import { useNavigate } from 'react-router-dom'
import { SignUpPage } from './signup-page'
import { ForgotPasswordPage } from './forgot-password-page'
import { OTPPage } from './otp-page'
import { NewPasswordPage } from './new-password-page'
import { mockProjects } from '../data/mockProjects'
import { CreateProjectPage } from './create-project-page'

export default function LandingPage() {
  const [loadState, setLoadState] = useState('home-auth')
  const navigate = useNavigate()

  const handleSelectProject = () => {
    navigate('/repos')
  }

  const handleSignUp = () => {
    setLoadState('sign-up')
  }

  const handleSignIn = () => {
    setLoadState('sign-in')
  }

  const renderContent = () => {
    switch (loadState) {
      case 'home-auth':
        return <Home isAuthed onSelectProject={handleSelectProject} title="Canary Playground" projects={mockProjects} />
      case 'home-unauth':
        return (
          <Home isAuthed={false} handleSignUp={handleSignUp} handleSignIn={handleSignIn} title="Canary Playground" />
        )
      case 'create-project':
        return <CreateProjectPage onFormSubmit={noop} />
      case 'sign-in':
        return <SignInPage handleSignIn={handleSignIn} />
      case 'sign-up':
        return <SignUpPage handleSignUp={handleSignUp} />
      case 'password-forgot':
        return <ForgotPasswordPage handleSignUp={handleSignUp} />
      case 'password-new':
        return <NewPasswordPage handleSignIn={handleSignIn} />
      case 'password-otp':
        return <OTPPage handleResend={noop} />
      default:
        return null
    }
  }

  return (
    <>
      {renderContent()}
      <PlaygroundLandingSettings loadState={loadState} setLoadState={setLoadState} />
    </>
  )
}
