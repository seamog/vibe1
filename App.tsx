import React, { useState, useEffect } from 'react';
import { IpInfoResponse } from './types';
import Spinner from './components/Spinner';

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


interface LocationInfo {
    country: string;
    city: string;
}

const App: React.FC = () => {
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://ipinfo.io/json');
        if (!response.ok) {
          throw new Error('IP 및 지역 정보를 가져오는 데 실패했습니다.');
        }
        
        const data: IpInfoResponse = await response.json();
        setIpAddress(data.ip);
        setLocation({ country: data.country, city: data.city });

      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCopy = () => {
    if (ipAddress && !isCopied) {
      navigator.clipboard.writeText(ipAddress).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans antialiased">
      <div className="w-full max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl shadow-cyan-500/10 p-8 transform transition-all hover:scale-105 duration-300">
        <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 tracking-wide">Your Public IP & Location</h1>
            <p className="text-gray-400 mt-2">당신의 현재 IP 주소와 위치 정보입니다.</p>
        </header>

        <main className="flex flex-col items-center justify-center bg-gray-900/50 p-6 rounded-lg min-h-[160px] border border-gray-700 space-y-4">
          {isLoading && <Spinner />}
          {error && <p className="text-red-400 text-center font-medium">{error}</p>}
          {!isLoading && !error && (
            <>
              <div className="flex items-center space-x-4">
                <p className="text-2xl md:text-3xl font-mono tracking-wider text-green-400 select-all">{ipAddress}</p>
                <button 
                  onClick={handleCopy}
                  className="relative p-2 rounded-full bg-gray-700 hover:bg-cyan-500 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-colors duration-200"
                  aria-label="Copy IP address"
                >
                  {isCopied ? <CheckIcon className="w-6 h-6 text-green-400" /> : <CopyIcon className="w-6 h-6" />}
                </button>
              </div>
              {location && (
                  <div className="flex items-center text-gray-300 pt-2 border-t border-gray-700/50 mt-4 w-full justify-center">
                    <LocationIcon className="w-5 h-5 mr-2 text-cyan-400" />
                    <p className="text-md">
                        <span className="font-semibold">{location.city}</span>, <span className="text-gray-400">{location.country}</span>
                    </p>
                  </div>
              )}
            </>
          )}
        </main>
        
        <footer className="text-center mt-8">
            <p className="text-xs text-gray-500">
                IP data by <a href="https://ipinfo.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-400 transition-colors">ipinfo.io</a>
            </p>
        </footer>
      </div>
    </div>
  );
};

export default App;