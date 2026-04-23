import React, { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';
import AuthGuard from 'component/AuthGuard';

const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const Businesses = Loadable(lazy(() => import('views/Businesses')));
const AdSets = Loadable(lazy(() => import('views/AdSets')));
const Categories = Loadable(lazy(() => import('views/Categories')));
const DigitalPosters = Loadable(lazy(() => import('views/DigitalPosters')));
const Users = Loadable(lazy(() => import('views/Users')));
const Blog = Loadable(lazy(() => import('views/Blog')));
const Referral = Loadable(lazy(() => import('views/Referral')));
const Support = Loadable(lazy(() => import('views/Support')));
const Notifications = Loadable(lazy(() => import('views/Notifications')));
const AppSettings = Loadable(lazy(() => import('views/AppSettings')));
const Chat = Loadable(lazy(() => import('views/Chat')));

const MainRoutes = {
  path: '/',
  element: <AuthGuard><MainLayout /></AuthGuard>,
  children: [
    { path: '/', element: <DashboardDefault /> },
    { path: '/dashboard/default', element: <DashboardDefault /> },
    { path: '/businesses', element: <Businesses /> },
    { path: '/adset', element: <AdSets /> },
    { path: '/categories', element: <Categories /> },
    { path: '/digital-poster', element: <DigitalPosters /> },
    { path: '/users', element: <Users /> },
    { path: '/blog', element: <Blog /> },
    { path: '/referral', element: <Referral /> },
    { path: '/support', element: <Support /> },
    { path: '/notifications', element: <Notifications /> },
    { path: '/settings', element: <AppSettings /> },
    { path: '/chat', element: <Chat /> },
  ]
};

export default MainRoutes;
