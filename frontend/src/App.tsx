import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StableLayout from "./components/StableLayout";
import { NotificationProvider } from "./contexts/NotificationContext";

/**
 * App Component - Implements the correct architecture
 *
 * ARCHITECTURE PRINCIPLES:
 * 1. Layout is a STABLE TEMPLATE that never changes
 * 2. Pages are COMPLETELY INDEPENDENT
 * 3. Main page is separate from layout
 * 4. Each page has its own structure and doesn't affect others
 */
function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          {/* Single route that handles all paths */}
          <Route path="*" element={<StableLayout />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
