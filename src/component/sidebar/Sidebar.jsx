import React from "react";
import { NavLink } from "react-router-dom"; // Import NavLink for active styling
import styles from "./Sidebar.module.css"; // Assuming you modularized CSS
import { SidebarData } from "./SidebarData"; // Importing the SidebarData array

const Sidebar = () => {
  return (
    <div className={styles.Sidebar}>
      <div className={styles.AdminTitle}>Admin</div>
      <ul className={styles.SidebarList}>
        {SidebarData.map((item, index) => (
          <li key={index} className={styles.row}>
            <NavLink
              to={item.link}
              className={({ isActive }) =>
                isActive ? `${styles.row} ${styles.active}` : styles.row
              }
            >
              <div id={styles.icon}>{item.icon}</div>
              <div id={styles.title}>{item.title}</div>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
