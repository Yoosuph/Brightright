import React, { useState } from 'react';
import type { Page } from '../types';
import Logo from './Logo';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  onGoHome: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const NavItem: React.FC<{
  page: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  dataTour?: string;
}> = ({ page, currentPage, setCurrentPage, icon, label, isCollapsed, dataTour }) => (
  <li>
    <button
      onClick={() => setCurrentPage(page)}
      data-tour={dataTour}
      className={`w-full flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-300 ${isCollapsed ? 'justify-center' : ''} ${
        currentPage === page
          ? 'bg-brand-purple/10 text-brand-purple dark:text-white dark:bg-brand-purple/20'
          : 'hover:bg-gray-500/10 text-gray-500 dark:text-gray-400 hover:text-brand-purple dark:hover:text-white'
      }`}
      aria-current={currentPage === page ? 'page' : undefined}
    >
      {icon}
      <span
        className={`transition-all duration-300 whitespace-nowrap ${currentPage === page ? 'font-semibold' : 'font-medium'} ${isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-4'}`}
      >
        {label}
      </span>
    </button>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  setCurrentPage,
  isDarkMode,
  setIsDarkMode,
  onGoHome,
  isOpen = false,
  onClose,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-light-card dark:bg-dark-card backdrop-blur-xl shadow-glass border-r border-white/10 z-50 md:hidden transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8">
            <div
              onClick={() => {
                onGoHome();
                onClose?.();
              }}
              className="flex items-center cursor-pointer"
            >
              <Logo className="w-10 h-10 flex-shrink-0" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white ml-3 whitespace-nowrap">
                BrightRank
              </h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-500/10 text-gray-500 dark:text-gray-400"
              aria-label="Close menu"
            >
              <IconClose />
            </button>
          </div>

          <nav className="flex-grow overflow-y-auto">
            <ul>
              <MobileNavItem
                page="dashboard"
                currentPage={currentPage}
                setCurrentPage={(page) => {
                  setCurrentPage(page);
                  onClose?.();
                }}
                icon={<IconDashboard />}
                label="Dashboard"
              />
              <MobileNavItem
                page="multiplatform"
                currentPage={currentPage}
                setCurrentPage={(page) => {
                  setCurrentPage(page);
                  onClose?.();
                }}
                icon={<IconLayers />}
                label="AI Platforms"
              />
              <MobileNavItem
                page="analytics"
                currentPage={currentPage}
                setCurrentPage={(page) => {
                  setCurrentPage(page);
                  onClose?.();
                }}
                icon={<IconChart />}
                label="Analytics"
              />
              <MobileNavItem
                page="keywords"
                currentPage={currentPage}
                setCurrentPage={(page) => {
                  setCurrentPage(page);
                  onClose?.();
                }}
                icon={<IconTag />}
                label="Keywords"
              />
              <MobileNavItem
                page="competitors"
                currentPage={currentPage}
                setCurrentPage={(page) => {
                  setCurrentPage(page);
                  onClose?.();
                }}
                icon={<IconUsers />}
                label="Competitors"
              />
              <MobileNavItem
                page="intelligence"
                currentPage={currentPage}
                setCurrentPage={(page) => {
                  setCurrentPage(page);
                  onClose?.();
                }}
                icon={<IconShield />}
                label="Intelligence"
              />
              <MobileNavItem
                page="alerts"
                currentPage={currentPage}
                setCurrentPage={(page) => {
                  setCurrentPage(page);
                  onClose?.();
                }}
                icon={<IconBell />}
                label="Alerts"
              />
              <MobileNavItem
                page="reports"
                currentPage={currentPage}
                setCurrentPage={(page) => {
                  setCurrentPage(page);
                  onClose?.();
                }}
                icon={<IconDocument />}
                label="Reports"
              />
              <MobileNavItem
                page="settings"
                currentPage={currentPage}
                setCurrentPage={(page) => {
                  setCurrentPage(page);
                  onClose?.();
                }}
                icon={<IconSettings />}
                label="Settings"
              />
            </ul>
          </nav>

          {/* Mobile Drawer Footer */}
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="p-2 rounded-lg bg-gray-500/5">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center text-gray-400">
                  <IconUser />
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-sm">Demo User</p>
                  <p className="text-xs text-gray-400">user@example.com</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-gray-500/10">
              <button
                onClick={() => setIsDarkMode(false)}
                className={`flex items-center justify-center p-2 rounded-md transition-colors text-gray-500 ${!isDarkMode ? 'bg-white dark:bg-dark-bg shadow' : ''}`}
                aria-label="Switch to light mode"
              >
                <IconSun />
              </button>
              <button
                onClick={() => setIsDarkMode(true)}
                className={`flex items-center justify-center p-2 rounded-md transition-colors text-gray-400 ${isDarkMode ? 'bg-white dark:bg-dark-bg shadow' : ''}`}
                aria-label="Switch to dark mode"
              >
                <IconMoon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`relative ${isCollapsed ? 'w-24' : 'w-64'} transition-all duration-300 hidden md:block`}
      >
        <aside
          data-tour="sidebar"
          className={`fixed top-0 left-0 h-full flex flex-col ${isCollapsed ? 'w-24' : 'w-64'} p-4 bg-light-card dark:bg-dark-card backdrop-blur-xl shadow-glass border-r border-white/10 transition-all duration-300`}
        >
          <div className="flex items-center justify-between mb-8">
            <div
              onClick={onGoHome}
              className={`flex items-center cursor-pointer`}
            >
              <Logo className="w-10 h-10 flex-shrink-0" />
              <h1
                className={`text-xl font-bold text-gray-900 dark:text-white ml-3 whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}
              >
                BrightRank
              </h1>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-1 rounded-full hover:bg-gray-500/20 text-gray-500 dark:text-gray-400 absolute left-full -ml-5 bg-light-card dark:bg-dark-bg border border-white/10 ${isCollapsed ? '' : ''}`}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <IconChevronRight /> : <IconChevronLeft />}
            </button>
          </div>

          <nav className="flex-grow">
            <ul>
              <NavItem
                page="dashboard"
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                icon={<IconDashboard />}
                label="Dashboard"
                isCollapsed={isCollapsed}
                dataTour="dashboard-link"
              />
              <NavItem
                page="multiplatform"
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                icon={<IconLayers />}
                label="AI Platforms"
                isCollapsed={isCollapsed}
                dataTour="multiplatform-link"
              />
              <NavItem
                page="analytics"
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                icon={<IconChart />}
                label="Analytics"
                isCollapsed={isCollapsed}
                dataTour="analytics-link"
              />
              <NavItem
                page="keywords"
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                icon={<IconTag />}
                label="Keywords"
                isCollapsed={isCollapsed}
                dataTour="keywords-link"
              />
              <NavItem
                page="competitors"
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                icon={<IconUsers />}
                label="Competitors"
                isCollapsed={isCollapsed}
                dataTour="competitors-link"
              />
              <NavItem
                page="intelligence"
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                icon={<IconShield />}
                label="Intelligence"
                isCollapsed={isCollapsed}
                dataTour="intelligence-link"
              />
              <NavItem
                page="alerts"
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                icon={<IconBell />}
                label="Alerts"
                isCollapsed={isCollapsed}
              />
              <NavItem
                page="reports"
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                icon={<IconDocument />}
                label="Reports"
                isCollapsed={isCollapsed}
              />
              <NavItem
                page="settings"
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                icon={<IconSettings />}
                label="Settings"
                isCollapsed={isCollapsed}
                dataTour="settings-link"
              />
            </ul>
          </nav>

          <div className="space-y-4">
            <div
              className={`p-2 rounded-lg bg-gray-500/5 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center text-gray-400">
                  <IconUser />
                </div>
                <div
                  className={`ml-3 overflow-hidden ${isCollapsed ? 'w-0' : 'w-auto'}`}
                >
                  <p className="font-semibold text-sm whitespace-nowrap">
                    Demo User
                  </p>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    user@example.com
                  </p>
                </div>
              </div>
            </div>

            <div data-tour="theme-toggle" className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-gray-500/10">
              <button
                onClick={() => setIsDarkMode(false)}
                className={`flex items-center justify-center p-2 rounded-md transition-colors text-gray-500 ${!isDarkMode ? 'bg-white dark:bg-dark-bg shadow' : ''}`}
                aria-label="Switch to light mode"
              >
                <IconSun />
              </button>
              <button
                onClick={() => setIsDarkMode(true)}
                className={`flex items-center justify-center p-2 rounded-md transition-colors text-gray-400 ${isDarkMode ? 'bg-white dark:bg-dark-bg shadow' : ''}`}
                aria-label="Switch to dark mode"
              >
                <IconMoon />
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-light-card dark:bg-dark-card backdrop-blur-xl shadow-glass border-t border-white/10 z-50">
        <nav className="flex justify-around p-2">
          <button
            onClick={onGoHome}
            className="p-3 rounded-lg text-gray-500"
            aria-label="Go home"
          >
            <IconHome />
          </button>
          <MobileNavItem
            page="dashboard"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            icon={<IconDashboard />}
          />
          <MobileNavItem
            page="analytics"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            icon={<IconChart />}
          />
          <MobileNavItem
            page="alerts"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            icon={<IconBell />}
          />
          <MobileNavItem
            page="reports"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            icon={<IconDocument />}
          />
        </nav>
      </div>
    </>
  );
};

const MobileNavItem: React.FC<{
  page: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  icon: React.ReactNode;
  label?: string;
}> = ({ page, currentPage, setCurrentPage, icon, label }) => (
  label ? (
    <li>
      <button
        onClick={() => setCurrentPage(page)}
        className={`w-full flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-300 ${
          currentPage === page
            ? 'bg-brand-purple/10 text-brand-purple dark:text-white dark:bg-brand-purple/20'
            : 'hover:bg-gray-500/10 text-gray-500 dark:text-gray-400 hover:text-brand-purple dark:hover:text-white'
        }`}
        aria-current={currentPage === page ? 'page' : undefined}
      >
        {icon}
        <span className={`ml-4 font-medium ${currentPage === page ? 'font-semibold' : ''}`}>
          {label}
        </span>
      </button>
    </li>
  ) : (
    <button
      onClick={() => setCurrentPage(page)}
      className={`p-3 rounded-lg transition-colors duration-200 ${currentPage === page ? 'text-brand-purple' : 'text-gray-500'}`}
      aria-label={`Go to ${page} page`}
    >
      {icon}
    </button>
  )
);

const IconClose = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const IconHome = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);
const IconDashboard = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);
const IconChart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);
const IconLayers = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);
const IconSettings = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const IconSun = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);
const IconMoon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);
const IconChevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);
const IconChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);
const IconTag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zM11 11h.01M11 15h.01M15 11h.01M15 15h.01M7 15h.01M7 19h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5a2 2 0 012-2z"
    />
  </svg>
);
const IconUser = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const IconUsers = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
);
const IconBell = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-5-5v5zm-5 0H5l5-5v5zM12 3v1m0 16v1M4 12H3m18 0h-1M5.636 5.636L4.929 4.93m12.728 12.728l.707.707M5.636 18.364L4.929 19.07m12.728-12.728l.707-.707"
    />
  </svg>
);
const IconShield = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);
const IconDocument = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

export default Sidebar;
