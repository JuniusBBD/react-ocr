import React, { useState, useRef } from 'react';
import Loader from './Loader';
import { toast } from 'react-toastify';

const CameraCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [captured, setCaptured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL('image/jpeg');
        setImageData(dataURL);
        setCaptured(true);
      }
    }
  };

  const recaptureImage = () => {
    setCaptured(false);
    startCamera();
    setExtractedText('');
  };

  const sendImageToBackend = () => {
    if (imageData) {
      setIsLoading(true);
      setExtractedText('');
      const formData = new FormData();
      const blob = dataURItoBlob(imageData);
      formData.append('file', blob, 'ocr.jpeg');

      fetch('https://pyrest.fly.dev/extract_text', {
        method: 'POST',
        body: formData,
        headers: {
          accept: 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data: { extracted_text: string }) => {
          setIsLoading(false);
          setExtractedText(data.extracted_text);
          if (!data.extracted_text) {
            toast.error('Failed to extract text', {theme: 'dark'});
          }
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.message || 'Failed to extract text', { theme: 'dark'});
          console.error('Error sending image to backend:', error);
        });
    }
  };

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: 'image/jpeg' });
  };

  React.useEffect(() => {
    startCamera();
  }, []);

  return (
    <div>
      <Loader loading={isLoading} />
      {!captured ? (
        <div className='flex flex-col items-center gap-3'>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className='w-180 h-170 rounded-2xl'
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <p className='text-white text-2xl'>
            Take a photo of your Kwika device
          </p>
          <button
            className='bg-white py-3 px-4 rounded-lg'
            onClick={captureImage}
          >
            Capture Image
          </button>
        </div>
      ) : !extractedText ? (
        <div className='flex flex-col items-center gap-3'>
          <img
            src={imageData || ''}
            alt='Captured'
            className='w-180 h-170 rounded-2xl'
          />
          <div className='flex items-center justify-center gap-5'>
            <button
              className='bg-white py-3 px-4 rounded-lg'
              onClick={recaptureImage}
            >
              Recapture
            </button>
            <button
              className='bg-white py-3 px-4 rounded-lg'
              onClick={sendImageToBackend}
            >
              Scan
            </button>
          </div>
        </div>
      ) : null}

      {extractedText && !isLoading && (
        <div className='gap-4 flex flex-col items-center justify-center'>
          <p className='text-lg text-white'>OCR'ed Result</p>
          <p className='text-white pt-2'>{extractedText}</p>
          <button
            className='bg-white w-fit py-3 px-4 rounded-lg'
            onClick={recaptureImage}
          >
            Recapture
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
