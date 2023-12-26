import { Component } from 'solid-js';
import AppRoutes from './router';
import SnackbarContainer from "./components/snackbar/Container";

const App: Component = () => {
  return (
    <>
      <div id="popups" />
      <SnackbarContainer />
      <AppRoutes />
    </>
  );
};

export default App;
