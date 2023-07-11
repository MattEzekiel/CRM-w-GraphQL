import '../styles/globals.css'
import { ApolloProvider } from "@apollo/client";
import client from "../config/apollo";
import { AuthProvider } from "../context/AuthProvider";
import PedidoState from "../context/pedidos/PedidoState";

function MyApp({ Component, pageProps }) {
  return (
      <ApolloProvider client={client}>
        <AuthProvider>
            <PedidoState>
                <Component {...pageProps} />
            </PedidoState>
        </AuthProvider>
      </ApolloProvider>
  )
}

export default MyApp
