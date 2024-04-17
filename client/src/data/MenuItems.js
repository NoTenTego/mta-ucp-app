import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined"
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"
import SupportIcon from "@mui/icons-material/Support"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"

const menuItems = {
  0: [
    //gracz
    {
      title: "Dashboard",
      leftIcon: <HomeOutlinedIcon sx={{ marginRight: "8px", fontSize: "25px" }} />,
      route: "/dashboard",
    },
    {
      title: "Postacie",
      leftIcon: <PeopleAltOutlinedIcon sx={{ marginRight: "9px", fontSize: "25px" }} />,
      route: "/characters",
    },
    {
      title: "Centrum Pomocy",
      leftIcon: <SupportIcon sx={{ marginRight: "9px", fontSize: "25px" }} />,
      route: "/helpdesk",
    },
    {
      title: "Sklep Premium",
      leftIcon: <AddShoppingCartIcon sx={{ marginRight: "9px", fontSize: "25px" }} />,
      route: "/premiumshop",
    },
  ],
  1: [
    //administracja
    {
      title: "Dashboard",
      leftIcon: <HomeOutlinedIcon sx={{ marginRight: "8px", fontSize: "25px" }} />,
      route: "/dashboard",
    },
    {
      title: "Postacie",
      leftIcon: <PeopleAltOutlinedIcon sx={{ marginRight: "9px", fontSize: "25px" }} />,
      route: "/characters",
    },
    {
      title: "Centrum Pomocy",
      leftIcon: <SupportIcon sx={{ marginRight: "9px", fontSize: "25px" }} />,
      route: "/helpdesk",
    },
    {
      title: "Sklep Premium",
      leftIcon: <AddShoppingCartIcon sx={{ marginRight: "9px", fontSize: "25px" }} />,
      route: "/premiumshop",
    },
    {
      title: "Centrum Administracji",
      leftIcon: <AdminPanelSettingsIcon sx={{ marginRight: "8px", fontSize: "25px" }} />,
      routeName: "admin",
      menuItems: [
        { title: "Logi", route: "/admin/logs" },
        { title: "Kary w grze [AJ]", route: "/admin/bans" },
        { title: "Konfiguracja Serwera", route: "/admin/servermanagement" }, //ekonomia etc
        { title: "Wiadomości i Ogłoszenia", route: "/admin/notificationsmanagement" },
        { title: "Panel Zarządzania Graczami & Grupami", route: "/admin/playersmanagement" },
      ],
    },
  ],
}

export default menuItems