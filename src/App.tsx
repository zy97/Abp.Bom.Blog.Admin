import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Login from "./components/Login";
import styles from "./App.module.less";
const { Header, Content, Footer } = Layout;
import NavigateMenu from "./components/Layout/NavigateMenu";
import Breadcrumb from "./components/Layout/Breadcrumb";
function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <NavigateMenu />
      <Layout >
        <Header style={{ padding: 0 }}>
          <span className={styles.login}>
            <Login />
          </span>
        </Header>
        <Content style={{ margin: "16px 16px 0px" }}>
          <Breadcrumb />
          <div className={styles.wrapper}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
    </Layout >
  );
}

export default App;
