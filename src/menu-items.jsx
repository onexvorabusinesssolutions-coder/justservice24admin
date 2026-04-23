import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

export default {
  items: [
    {
      id: 'dashboard-group',
      title: 'JustService Admin',
      caption: 'Overview',
      type: 'group',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: DashboardOutlinedIcon,
          url: '/dashboard/default'
        }
      ]
    },
    {
      id: 'users-group',
      title: 'User Management',
      caption: 'Manage Users',
      type: 'group',
      children: [
        {
          id: 'all-users',
          title: 'All Users',
          type: 'item',
          icon: PeopleAltOutlinedIcon,
          url: '/users'
        }
      ]
    },
    {
      id: 'business-group',
      title: 'Business',
      caption: 'Manage Businesses',
      type: 'group',
      children: [
        {
          id: 'all-business',
          title: 'All Businesses',
          type: 'item',
          icon: BusinessOutlinedIcon,
          url: '/businesses'
        },
        {
          id: 'categories',
          title: 'Categories',
          type: 'item',
          icon: CategoryOutlinedIcon,
          url: '/categories'
        }
      ]
    },
    {
      id: 'marketing-group',
      title: 'Marketing',
      caption: 'Ads & Posters',
      type: 'group',
      children: [
        {
          id: 'adset',
          title: 'AdSet / Ads',
          type: 'item',
          icon: CampaignOutlinedIcon,
          url: '/adset'
        },
        {
          id: 'digital-poster',
          title: 'Digital Poster',
          type: 'item',
          icon: ImageOutlinedIcon,
          url: '/digital-poster'
        },
      ]
    },
    {
      id: 'content-group',
      title: 'Content',
      caption: 'Blog & Notifications',
      type: 'group',
      children: [
        {
          id: 'blog',
          title: 'Blog',
          type: 'item',
          icon: ArticleOutlinedIcon,
          url: '/blog'
        },
        {
          id: 'notifications',
          title: 'Notifications',
          type: 'item',
          icon: NotificationsOutlinedIcon,
          url: '/notifications'
        },
        {
          id: 'referral',
          title: 'Referral & Redeem',
          type: 'item',
          icon: RedeemOutlinedIcon,
          url: '/referral'
        }
      ]
    },
    {
      id: 'support-group',
      title: 'Support',
      caption: 'Help & Settings',
      type: 'group',
      children: [
        {
          id: 'support',
          title: 'Support Tickets',
          type: 'item',
          icon: SupportAgentOutlinedIcon,
          url: '/support'
        },
        {
          id: 'chat',
          title: 'Chat / Messages',
          type: 'item',
          icon: ChatOutlinedIcon,
          url: '/chat'
        },
        {
          id: 'settings',
          title: 'Settings',
          type: 'item',
          icon: SettingsOutlinedIcon,
          url: '/settings'
        }
      ]
    }
  ]
};
