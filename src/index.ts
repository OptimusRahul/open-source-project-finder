// Import all components first
import './components/base/AccessibleBase';
import './components/IssueCard/IssueCard';
import './components/Sidebar/Sidebar';
import './components/SearchBar/SearchBar';
import './components/ThemeToggle/ThemeToggle';
import './components/PaginationControls/PaginationControls';
import './components/Header/Header';
import './components/LoadingState/LoadingState';

// Then import styles and app
import './styles/global.css';
import { App } from './App';

// Wait for custom elements to be defined
window.addEventListener('load', () => {
  // Give a small delay to ensure all custom elements are defined
  setTimeout(() => {
    new App();
  }, 100);
}); 