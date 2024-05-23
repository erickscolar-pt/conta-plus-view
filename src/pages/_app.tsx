import { AppProps } from "next/app"
import '../../styles/globals.scss'
import Head from "next/head"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from "../contexts/AuthContexts";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Conta+</title>


            </Head>
            <AuthProvider>
                <Component {...pageProps} />
                <ToastContainer autoClose={3000} />
            </AuthProvider>

        </>
    )
}

export default MyApp