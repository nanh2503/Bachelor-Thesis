import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '../styles/style/format.scss';
import '../styles/style/styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
