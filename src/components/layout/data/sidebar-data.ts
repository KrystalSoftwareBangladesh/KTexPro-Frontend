// import { ClerkLogo } from '@/assets/clerk-logo'
import {
  AudioWaveform,
  Bell,
  // Bug,
  // Construction,
  // FileX,
  // Command,
  Factory,
  GalleryVerticalEnd,
  // HelpCircle,
  LayoutDashboard,
  List,
  ListTodo,
  // Lock,
  // MessagesSquare,
  Monitor,
  // Package,
  Palette,
  Shirt,
  // ServerOff,
  Settings,
  ShoppingBag,
  // ShieldCheck,
  UserCog,
  // UserX,
  Users,
  Wrench,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { type SidebarData } from '../types'

export const getSidebarData = (): SidebarData => {
  const userData = useAuthStore.getState().auth.user

  return {
    user: {
      name: userData?.username || 'Guest',
      email: userData?.email || 'guest@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
  teams: [
    // {
    //   name: 'CRM',
    //   logo: Command,
    //   plan: 'Vite + ShadcnUI',
    // },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: ListTodo,
        },
        // {
        //   title: 'Apps',
        //   url: '/apps',
        //   icon: Package,
        // },
        // {
        //   title: 'Chats',
        //   url: '/chats',
        //   badge: '3',
        //   icon: MessagesSquare,
        // },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Buyers',
          url: '/buyers',
          icon: ShoppingBag,
        },
        {
          title: 'Suppliers',
          icon: Factory,
          items: [
            {
              title: 'Supplier List',
              url: '/suppliers',
              icon: List,
            },
            {
              title: 'Capability List',
              url: '/suppliers/capabilities',
              icon: List,
            },
          ],
        },
        {
          title: 'Styles',
          url: '/styles',
          icon: Shirt,
        },
        // {
        //   title: 'Secured by Clerk',
        //   icon: ClerkLogo,
        //   items: [
        //     {
        //       title: 'Sign In',
        //       url: '/clerk/sign-in',
        //     },
        //     {
        //       title: 'Sign Up',
        //       url: '/clerk/sign-up',
        //     },
        //     {
        //       title: 'User Management',
        //       url: '/clerk/user-management',
        //     },
        //   ],
        // },
      ],
    },
    // {
    //   title: 'Pages',
    //   items: [
    //     {
    //       title: 'Auth',
    //       icon: ShieldCheck,
    //       items: [
    //         {
    //           title: 'Sign In',
    //           url: '/sign-in',
    //         },
    //         {
    //           title: 'Sign In (2 Col)',
    //           url: '/sign-in-2',
    //         },
    //         {
    //           title: 'Sign Up',
    //           url: '/sign-up',
    //         },
    //         {
    //           title: 'Forgot Password',
    //           url: '/forgot-password',
    //         },
    //         {
    //           title: 'OTP',
    //           url: '/otp',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Errors',
    //       icon: Bug,
    //       items: [
    //         {
    //           title: 'Unauthorized',
    //           url: '/errors/unauthorized',
    //           icon: Lock,
    //         },
    //         {
    //           title: 'Forbidden',
    //           url: '/errors/forbidden',
    //           icon: UserX,
    //         },
    //         {
    //           title: 'Not Found',
    //           url: '/errors/not-found',
    //           icon: FileX,
    //         },
    //         {
    //           title: 'Internal Server Error',
    //           url: '/errors/internal-server-error',
    //           icon: ServerOff,
    //         },
    //         {
    //           title: 'Maintenance Error',
    //           url: '/errors/maintenance-error',
    //           icon: Construction,
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
            {
              title: 'User Management',
              url: '/settings/users',
              icon: Users,
            },
            {
              title: 'Roles',
              url: '/settings/roles',
              icon: UserCog,
            },
          ],
        },
        // {
        //   title: 'Help Center',
        //   url: '/help-center',
        //   icon: HelpCircle,
        // },
      ],
    },
  ],
  }
}
