// OAuth Configuration and Utilities
export const OAUTH_CONFIG = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
    redirectUri: `${window.location.origin}/auth/google/callback`,
    scope: 'openid email profile'
  },
  facebook: {
    appId: import.meta.env.VITE_FACEBOOK_APP_ID || '1234567890123456',
    redirectUri: `${window.location.origin}/auth/facebook/callback`,
    scope: 'email,public_profile'
  },
  linkedin: {
    clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || '1234567890',
    redirectUri: `${window.location.origin}/auth/linkedin/callback`,
    scope: 'r_liteprofile r_emailaddress'
  }
}

export interface OAuthUser {
  id: string
  name: string
  email: string
  picture?: string
  provider: 'google' | 'facebook' | 'linkedin'
}

// Google OAuth
export const initiateGoogleLogin = () => {
  const params = new URLSearchParams({
    client_id: OAUTH_CONFIG.google.clientId,
    redirect_uri: OAUTH_CONFIG.google.redirectUri,
    response_type: 'code',
    scope: OAUTH_CONFIG.google.scope,
    access_type: 'offline',
    prompt: 'consent'
  })
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  window.location.href = authUrl
}

// Facebook OAuth
export const initiateFacebookLogin = () => {
  const params = new URLSearchParams({
    client_id: OAUTH_CONFIG.facebook.appId,
    redirect_uri: OAUTH_CONFIG.facebook.redirectUri,
    response_type: 'code',
    scope: OAUTH_CONFIG.facebook.scope,
    state: generateRandomState()
  })
  
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
  window.location.href = authUrl
}

// LinkedIn OAuth
export const initiateLinkedInLogin = () => {
  const params = new URLSearchParams({
    client_id: OAUTH_CONFIG.linkedin.clientId,
    redirect_uri: OAUTH_CONFIG.linkedin.redirectUri,
    response_type: 'code',
    scope: OAUTH_CONFIG.linkedin.scope,
    state: generateRandomState()
  })
  
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
  window.location.href = authUrl
}

// Exchange authorization code for access token and user info
export const exchangeCodeForToken = async (code: string, provider: 'google' | 'facebook' | 'linkedin'): Promise<OAuthUser> => {
  try {
    // In a real app, this would be handled by your backend
    // For demo purposes, we'll simulate the OAuth flow
    
    if (provider === 'google') {
      return await handleGoogleCallback(code)
    } else if (provider === 'facebook') {
      return await handleFacebookCallback(code)
    } else if (provider === 'linkedin') {
      return await handleLinkedInCallback(code)
    }
    
    throw new Error('Unsupported provider')
  } catch (error) {
    console.error(`OAuth ${provider} error:`, error)
    throw new Error(`Failed to authenticate with ${provider}`)
  }
}

// Google callback handler
const handleGoogleCallback = async (code: string): Promise<OAuthUser> => {
  // Exchange code for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: OAUTH_CONFIG.google.clientId,
      client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
      code,
      grant_type: 'authorization_code',
      redirect_uri: OAUTH_CONFIG.google.redirectUri,
    }),
  })
  
  if (!tokenResponse.ok) {
    throw new Error('Failed to exchange code for token')
  }
  
  const tokenData = await tokenResponse.json()
  
  // Get user info
  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  })
  
  if (!userResponse.ok) {
    throw new Error('Failed to get user info')
  }
  
  const userData = await userResponse.json()
  
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    picture: userData.picture,
    provider: 'google'
  }
}

// Facebook callback handler
const handleFacebookCallback = async (code: string): Promise<OAuthUser> => {
  // Exchange code for access token
  const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: OAUTH_CONFIG.facebook.appId,
      client_secret: import.meta.env.VITE_FACEBOOK_APP_SECRET || '',
      code,
      redirect_uri: OAUTH_CONFIG.facebook.redirectUri,
    }),
  })
  
  if (!tokenResponse.ok) {
    throw new Error('Failed to exchange code for token')
  }
  
  const tokenData = await tokenResponse.json()
  
  // Get user info
  const userResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`)
  
  if (!userResponse.ok) {
    throw new Error('Failed to get user info')
  }
  
  const userData = await userResponse.json()
  
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    picture: userData.picture?.data?.url,
    provider: 'facebook'
  }
}

// LinkedIn callback handler
const handleLinkedInCallback = async (code: string): Promise<OAuthUser> => {
  // Exchange code for access token
  const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: OAUTH_CONFIG.linkedin.clientId,
      client_secret: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET || '',
      code,
      grant_type: 'authorization_code',
      redirect_uri: OAUTH_CONFIG.linkedin.redirectUri,
    }),
  })
  
  if (!tokenResponse.ok) {
    throw new Error('Failed to exchange code for token')
  }
  
  const tokenData = await tokenResponse.json()
  
  // Get user profile
  const profileResponse = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  })
  
  // Get user email
  const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  })
  
  if (!profileResponse.ok || !emailResponse.ok) {
    throw new Error('Failed to get user info')
  }
  
  const profileData = await profileResponse.json()
  const emailData = await emailResponse.json()
  
  const firstName = profileData.firstName?.localized?.en_US || ''
  const lastName = profileData.lastName?.localized?.en_US || ''
  const email = emailData.elements?.[0]?.['handle~']?.emailAddress || ''
  
  return {
    id: profileData.id,
    name: `${firstName} ${lastName}`.trim(),
    email,
    picture: profileData.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier,
    provider: 'linkedin'
  }
}

// Utility functions
const generateRandomState = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Check if we're in OAuth callback
export const isOAuthCallback = (): { provider: string; code: string } | null => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const path = window.location.pathname
  
  if (code) {
    if (path.includes('/auth/google/callback')) {
      return { provider: 'google', code }
    } else if (path.includes('/auth/facebook/callback')) {
      return { provider: 'facebook', code }
    } else if (path.includes('/auth/linkedin/callback')) {
      return { provider: 'linkedin', code }
    }
  }
  
  return null
}