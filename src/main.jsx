import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from './components/ui/provider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import NonWordle from './components/NonWordle.jsx';

const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <QueryClientProvider client={queryClient}>
         <NonWordle />
      </QueryClientProvider>
    </Provider> 
  </StrictMode>
)
