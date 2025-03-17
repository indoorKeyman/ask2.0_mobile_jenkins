import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* CSS Variables */
  :root {
    --max-width: 430px;
    --min-width: 320px;
    --header-height: 68px;
    --side-padding: 20px;
  }

  /* Reset CSS */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    line-height: 1.5;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  /* Layout */
  body {
    min-width: var(--min-width);
    background-color: #f2f2f2;
    position: relative;
  }

  #root {
    position: relative;
    height: 100%;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
  }

  /* Links & Buttons */
  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  /* Lists */
  ul, ol {
    list-style: none;
  }

  /* Forms */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Utility */
  .hidden {
    display: none;
  }

  /* Remove scrollbar */
  ::-webkit-scrollbar {
    display: none;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
  }
`;

export default GlobalStyle;
