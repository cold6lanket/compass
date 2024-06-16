import { Layout, Menu } from 'antd';
const { Content, Sider } = Layout;
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import TaskManager from './pages/TaskManager/TaskManager';
// import TaskManagerGame from './pages/TaskManager/TaskManagerGame';
import Compass from './components/Compass/Compass';
import ArtificialHorizon from './components/ArtificialHorizon/ArtificialHorizon';
import Rbi from './components/Rbi/Rbi';
import Orientation from './components/Orientation/Orientation';


function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
}

const items = [
    getItem('Option 1', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
];

function App() {
  return (
    <Layout
        style={{
            minHeight: '100vh',
        }}
    >
        <Sider collapsible>
            <div className="demo-logo-vertical" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout>
            <Content
                style={{
                margin: '0 16px',
                position:"relative"
                }}
            >
                {/* <div style={{display: "flex", justifyContent: "space-around"}}>
                    <Rbi/>
                    <ArtificialHorizon />
                    <Compass />
                </div> */}
                <Orientation />
            </Content>
        </Layout>
    </Layout>
  );
}

export default App;
