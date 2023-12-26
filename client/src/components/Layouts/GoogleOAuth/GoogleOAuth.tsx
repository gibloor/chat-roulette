import { GoogleOAuthProvider } from '@react-oauth/google'

type GoogleOAuthProps = {
  children: React.ReactNode,
}

const GoogleOAuth = (props: GoogleOAuthProps) => {
  const GOOGLE_CLIENT_ID = '834681738056-ci4lmpvdjt6c4hvm6884eiaoba1rmjq5.apps.googleusercontent.com'

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {props.children}
    </GoogleOAuthProvider>
  )
}

export default GoogleOAuth