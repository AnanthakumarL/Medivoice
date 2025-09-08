import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { seedDemoData } from "@/lib/demo-store";

seedDemoData();

createRoot(document.getElementById("root")!).render(<App />);
