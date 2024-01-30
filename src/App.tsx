import './App.css';
import CameraCapture from './CameraCapture';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <CameraCapture />
      <ToastContainer />
    </>
  );
}

export default App;
