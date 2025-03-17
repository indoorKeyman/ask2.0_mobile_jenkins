import GlobalStyle from "./GlobalStyle";
import { ThemeProvider } from "styled-components";
import theme from "./theme";
import Layout from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { StrictMode } from "react";

function App() {
  return (
    <StrictMode>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Layout />
        </ThemeProvider>
      </AuthProvider>
    </StrictMode>
  );
}

export default App;
