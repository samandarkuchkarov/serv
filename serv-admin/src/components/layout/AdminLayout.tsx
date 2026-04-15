import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Typography,
  theme,
} from 'antd';
import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  PictureOutlined,
  StarOutlined,
  AppstoreOutlined,
  ToolOutlined,
  SolutionOutlined,
  CustomerServiceOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Дашборд',
  },
  {
    key: '/banners',
    icon: <PictureOutlined />,
    label: 'Баннеры',
  },
  {
    key: '/advantages',
    icon: <StarOutlined />,
    label: 'Почему выбирают Comnet',
  },
  {
    key: '/equipments',
    icon: <ToolOutlined />,
    label: 'Оборудование',
  },
  {
    key: '/services',
    icon: <CustomerServiceOutlined />,
    label: 'Услуги',
  },
  {
    key: '/vacancies',
    icon: <SolutionOutlined />,
    label: 'Вакансии',
  },
  {
    key: '/constructor',
    icon: <AppstoreOutlined />,
    label: 'Конструктор',
  },
  {
    key: '/partners',
    icon: <TeamOutlined />,
    label: 'Партнёры',
  },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { token: designToken } = theme.useToken();

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      danger: true,
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={300}
        collapsedWidth={80}
        style={{
          background: designToken.colorBgContainer,
          borderRight: `1px solid ${designToken.colorBorderSecondary}`,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 24px',
            borderBottom: `1px solid ${designToken.colorBorderSecondary}`,
          }}
        >
          {!collapsed && (
            <Text
              strong
              style={{ fontSize: 18, color: designToken.colorPrimary }}
            >
              Serv Admin
            </Text>
          )}
          {collapsed && (
            <Text
              strong
              style={{ fontSize: 18, color: designToken.colorPrimary }}
            >
              S
            </Text>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ borderRight: 0, background: 'transparent', marginTop: 8 }}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: designToken.colorBgContainer,
            borderBottom: `1px solid ${designToken.colorBorderSecondary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
              }}
            >
              <Avatar
                icon={<UserOutlined />}
                style={{ background: designToken.colorPrimary }}
              />
              {user && (
                <Text style={{ color: designToken.colorText }}>
                  {user.name}
                </Text>
              )}
            </div>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: designToken.colorBgContainer,
            borderRadius: designToken.borderRadiusLG,
            minHeight: 360,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
