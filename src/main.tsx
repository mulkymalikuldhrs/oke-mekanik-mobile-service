import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

<<<<<<< HEAD
async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  const { worker } = await import('./mocks/browser')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and running.
  return worker.start()
}

enableMocking().then(() => {
    createRoot(document.getElementById("root")!).render(<App />);
})
=======
createRoot(document.getElementById('root')!).render(<App />)
>>>>>>> origin/feat/project-revamp-10664209957500258455
