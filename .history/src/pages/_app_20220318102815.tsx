import { AppProps } from 'next/app';
import Home from './index';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Home />,
      <Component {...pageProps} />;
    </>
  )
  
}

export default MyApp;
