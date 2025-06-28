# ExpenseAI - Smart Expense Tracker

A modern expense tracking application with AI-powered insights and real OAuth authentication.

## 🚀 Features

- **Real OAuth Authentication** with Google, Facebook, and LinkedIn
- **AI-Powered Insights** for spending patterns and recommendations
- **Smart Budget Management** with alerts and projections
- **Goal Tracking** with progress monitoring
- **Expense Forecasting** using AI algorithms
- **Multi-Currency Support** with 20+ currencies
- **Responsive Design** optimized for mobile and desktop

## 🔐 OAuth Setup

To enable real social login, you need to set up OAuth applications:

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Add redirect URI: `http://localhost:5173/auth/google/callback`

### Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URI: `http://localhost:5173/auth/facebook/callback`
5. Add your domain to App Domains

### LinkedIn OAuth Setup
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Add Sign In with LinkedIn product
4. Configure OAuth redirect URI: `http://localhost:5173/auth/linkedin/callback`

## 🛠️ Environment Variables

Create a `.env` file in the root directory:

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Facebook OAuth
VITE_FACEBOOK_APP_ID=your_facebook_app_id_here
VITE_FACEBOOK_APP_SECRET=your_facebook_app_secret_here

# LinkedIn OAuth
VITE_LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
VITE_LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your OAuth credentials
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

## 📱 How to Use

### Authentication
- **Demo Account**: Click "Try Demo Account" for instant access
- **Email/Password**: Create account or sign in with email
- **Social Login**: Use Google, Facebook, or LinkedIn (requires OAuth setup)

### Navigation
- **Header**: Access notifications and profile dropdown
- **Bottom Navigation**: Quick access to main features
- **Profile Dropdown**: Settings, profile, and sign out

### Features
- **Dashboard**: Overview of finances and quick actions
- **Expenses**: Add, edit, and categorize transactions
- **Budget**: Set spending limits and track progress
- **Analytics**: Visualize spending patterns with charts
- **Goals**: Set and track financial objectives
- **AI Insights**: Get personalized recommendations
- **Smart Planner**: AI-powered financial planning

## 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Build Tool**: Vite

## 🌟 Key Features Explained

### Real OAuth Integration
- Proper OAuth 2.0 flow implementation
- Secure token exchange
- Real user data from providers
- Fallback to demo mode if OAuth not configured

### AI Insights Engine
- Spending pattern analysis
- Budget alert system
- Saving opportunity detection
- Expense forecasting
- Personalized recommendations

### Smart Financial Planning
- Budget projections
- Savings strategies
- Goal achievement timelines
- Seasonal spending adjustments

## 🔒 Security & Privacy

- No sensitive data stored in localStorage
- OAuth tokens handled securely
- Client-side only (no backend required)
- User data stays local to device

## 📄 License

MIT License - feel free to use for personal or commercial projects.