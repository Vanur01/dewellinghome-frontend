import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/auth.store";
import LoadingScreen from "./components/LoadingScreen";
import ScrollToTop from "./components/ScrollToTop";
import { routes } from './routesConfig';
import MetaWrapper from './components/MetaWrapper';
import { API_URL } from "./utils/axiosInstance";

// ✅ Safe UUID generation
function generateUUID() {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  // Fallback UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function App() {
  const { restoreSession } = useAuthStore();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    console.log(API_URL);
    const startTime = Date.now();
    const minimumLoadingTime = 2000;

    restoreSession()
      .catch((error) => {
        console.error('Failed to restore session:', error);
      })
      .finally(() => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);
        
        setTimeout(() => {
          setShowLoading(false);
        }, remainingTime);
      });
  }, []);

  if (showLoading) {
    return <LoadingScreen />;
  }

  const renderRoutes = (routes) => {
    return routes.map((route) => (
      <Route
        key={route.path || generateUUID()}
        path={route.path}
        element={route.element}
      >
        {route.children && renderRoutes(route.children)}
      </Route>
    ));
  };

  return (
    <Router>
      <MetaWrapper>
        <ScrollToTop />
        <Routes>
          {renderRoutes(routes)}
        </Routes>
      </MetaWrapper>
    </Router>
  );
}

export default App;
