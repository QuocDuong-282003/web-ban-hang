import React, { useState, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigator.css';
const MenuGroup = ({ name, children }) => (
    <li className="menu-group">
        <div className="menu-group-name">
            <FormattedMessage id={name} />
        </div>
        <ul className="menu-list list-unstyled">{children}</ul>
    </li>
);

const Menu = ({ name, active, link, children, onClick, hasSubMenu, isOpen }) => {
    return (
        <li className={
            "menu" +
            (hasSubMenu ? " has-sub-menu" : "") +
            (active ? " active" : "")
        }>
            {hasSubMenu ? (
                <Fragment>
                    <span
                        className={"menu-link" + (isOpen ? "" : " collapsed")}
                        onClick={onClick}
                        aria-expanded={isOpen}
                        style={{ cursor: 'pointer' }}
                    >
                        <FormattedMessage id={name} />
                        <div className="icon-right">
                            <i className={"far fa-angle-right"} />
                        </div>
                    </span>
                    {isOpen && (
                        <div>
                            <ul className="sub-menu-list list-unstyled">
                                {children}
                            </ul>
                        </div>
                    )}
                </Fragment>
            ) : (
                <Link to={link} className="menu-link">
                    <FormattedMessage id={name} />
                </Link>
            )}
        </li>
    );
};

const SubMenu = ({ name, link, active }) => (
    <li className={"sub-menu " + (active ? "active" : "")}>
        <Link to={link} className="sub-menu-link">
            <FormattedMessage id={name} />
        </Link>
    </li>
);

const Navigator = ({ menus }) => {
    const location = useLocation();
    const [expandedMenu, setExpandedMenu] = useState({});

    // Kiểm tra menu con hoặc menu chính active
    const isMenuActive = (link, subMenus) => {
        if (subMenus && subMenus.length > 0) {
            for (const sub of subMenus) {
                if (sub.link === location.pathname) return true;
            }
        }
        if (link) return link === location.pathname;
        return false;
    };

    // Mở rộng menu khi có item active
    useEffect(() => {
        const newExpanded = {};
        menus.forEach((group, groupIndex) => {
            group.menus.forEach((menu, menuIndex) => {
                if (isMenuActive(menu.link, menu.subMenus)) {
                    newExpanded[`${groupIndex}_${menuIndex}`] = true;
                }
            });
        });
        setExpandedMenu(newExpanded);
    }, [location.pathname, menus]);

    const toggle = (groupIndex, menuIndex) => {
        const key = `${groupIndex}_${menuIndex}`;
        setExpandedMenu(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <ul className="navigator-menu list-unstyled">
            {menus.map((group, groupIndex) => (
                <MenuGroup key={groupIndex} name={group.name}>
                    {group.menus.map((menu, menuIndex) => {
                        const key = `${groupIndex}_${menuIndex}`;
                        const isActive = isMenuActive(menu.link, menu.subMenus);
                        const isOpen = expandedMenu[key] === true;
                        return (
                            <Menu
                                key={menuIndex}
                                name={menu.name}
                                link={menu.link}
                                active={isActive}
                                hasSubMenu={menu.subMenus && menu.subMenus.length > 0}
                                isOpen={isOpen}
                                onClick={() => toggle(groupIndex, menuIndex)}
                            >
                                {menu.subMenus && menu.subMenus.map((subMenu, subMenuIndex) => {
                                    const isSubActive = location.pathname === subMenu.link;
                                    return (
                                        <SubMenu
                                            key={subMenuIndex}
                                            name={subMenu.name}
                                            link={subMenu.link}
                                            active={isSubActive}
                                        />
                                    );
                                })}
                            </Menu>
                        );
                    })}
                </MenuGroup>
            ))}
        </ul>
    );
};

export default Navigator;
