import { AppRouter } from './router/AppRouter'
import {AuthProvider} from './auth/AuthProvider.tsx'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App
