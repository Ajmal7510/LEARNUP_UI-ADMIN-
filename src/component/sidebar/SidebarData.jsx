import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import MessageIcon from "@mui/icons-material/Message";
import SettingsIcon from "@mui/icons-material/Settings";

// Define the sidebar data array
export const SidebarData = [
  {
    title: "Overview",
    icon: <HomeIcon />,
    link: "/admin/overview",
  },
  {
    title: "Courses",
    icon: <MenuBookIcon color="white" />,
    link: "/admin/courses",
  },
  {
    title: "Categories",
    icon: <CategoryIcon />,
    link: "/admin/categories",
  },
  {
    title: "Transactions",
    icon: <ReceiptLongIcon />,
    link: "/admin/transactions",
  },
  {
    title: "Banner",
    icon: <ViewCarouselIcon />,
    link: "/admin/banners",
  },
  {
    title: "Requests",
    icon: <MessageIcon />,
    link: "/admin/requests",
  },
  {
    title: "Manage Users",
    icon: <SettingsIcon />,
    link: "/admin/manage-users",
  },
];
