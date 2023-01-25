import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppProps } from "next/app";
import Head from "next/head";

import { AuthProvider } from "../hooks/useAuth";
import "../styles/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Options Co-Pilot</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <ToastContainer autoClose={4000} limit={3} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
