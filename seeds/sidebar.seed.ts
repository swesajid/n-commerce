/** @format */

import EventNoteIcon from "@mui/icons-material/EventNote";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import {
  Brush,
  ContactPage,
  Email,
  FolderSpecial,
  Videocam,
  Web,
  Work as JobIcon,
} from "@mui/icons-material";
import UserCircleIcon from "@mui/icons-material/AccountCircle";

interface iSidebarLink {
  text: string;
  icon?: any;
  link: string;
}

interface iSidebarItem {
  text: string;
  icon: any;
  links: iSidebarLink[];
}

export const sidebarLinks: iSidebarItem[] = [
  // {
  //     text: 'Resources',
  //     icon: FolderSpecial,
  //     links: [
  //         { text: 'Create Resource', link: '/resources/create' },
  //         { text: 'All Resources', link: '/resources' },
  //         { text: 'Create Tag', link: '/resources/tags/create' },
  //         { text: 'All Tags', link: '/resources/tags' },
  //         // { text: 'Spam', icon: MailIcon, link: '/' },
  //     ],
  // },
  // {
  //     text: 'Categories',
  //     icon: FolderSpecial,
  //     links: [
  //         { text: 'Create Categories', link: '/categories/create' },
  //         { text: 'All Categories', link: '/categories' },
  //     ],
  // },
  //  {
  //     text: 'Vehicle Rates',
  //     icon: FolderSpecial,
  //     links: [
  //         { text: 'Create Rates', link: '/rates/create' },
  //         { text: 'All Rates', link: '/rates' },
  //     ],
  // },
  // {
  //     text: 'Vehicle Receipt',
  //     icon: FolderSpecial,
  //     links: [
  //         { text: 'Create Rates', link: '/receipts/create' },
  //         { text: 'All Rates', link: '/receipts' },
  //     ],
  // },
  // {
  //     text: 'User Management',
  //     icon: UserCircleIcon,
  //     links: [
  //         // { text: 'All Users', icon: UserRoundIcon, link: '/users' },
  //         { text: 'Members', icon: UserCircleIcon, link: '/users/members' },
  //         { text: 'Admins', icon: UserCircleIcon, link: '/users/admins' },
  //         { text: 'Roles', icon: UserCircleIcon, link: '/roles' },
  //     // text: 'Users',
  //     // icon: UserCircleIcon,
  //     // links: [
  //     //     { text: 'All Users', link: '/users' },
  //     //     // { text: 'Trash', icon: UserIcon, link: '/' },
  //     //     // { text: 'Spam', icon: MailIcon, link: '/' },
  //     ],
  // },
];
