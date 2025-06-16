import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Gameui from './Frontend/Gameui';


export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gameui/>} />
      </Routes>
    </BrowserRouter>

  )
}