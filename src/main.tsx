import React  from 'react'
import "flowbite"
import ReactDOM  from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import "./assets/css/main.css"
import RouterConfig from './config/router.config'
import { Provider } from 'react-redux'
import store from './config/store.config'
// import App from './App.tsx'
// import './index.css'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""

const elem = ReactDOM.createRoot(document.getElementById('root')!)
elem.render(<>
              <React.StrictMode>
              {googleClientId ? (
                <GoogleOAuthProvider clientId={googleClientId}>
                  <Provider store={store}>
                        <RouterConfig/>
                  </Provider>
                </GoogleOAuthProvider>
              ) : (
                <Provider store={store}>
                      <RouterConfig/>
                </Provider>
              )}
            </React.StrictMode>
            </>
          )
