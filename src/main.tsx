import React  from 'react'
import "flowbite"
import ReactDOM  from 'react-dom/client'
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

const elem = ReactDOM.createRoot(document.getElementById('root')!)
elem.render(<>
              <React.StrictMode>
              <Provider store={store}>
                    <RouterConfig/>
              </Provider>
            </React.StrictMode>
            </>
          )
