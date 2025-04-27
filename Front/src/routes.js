import Dashboard from "./views/Dashboard.js"
import Icons from "./views/Icons.js"
import GenImgs from "./views/GenImgs.js"
import UserProfile from "./views/UserProfile.js"
import Mod from "./views/mod.js"

var routes = [
  {
    path: "/dashboard",
    name: "Home",
    icon: "tim-icons icon-chart-pie-36",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "driver data",
    icon: "tim-icons icon-link-72",
    component: <Icons />,
    layout: "/admin",
  },

  {
    path: "/generate",
    name: "Generate images",
    icon: "tim-icons icon-components",
    component: <GenImgs />,
    layout: "/admin",
  },
  {
    path: "/mod",
    name: "Explorer no models",
    icon: "tim-icons icon-image-02",
    component: <Mod />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "Profile",
    icon: "tim-icons icon-single-02",
    component: <UserProfile />,
    layout: "/admin",
  }
]
export default routes
