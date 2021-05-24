import './App.css';
import MainPage from "../MainPage/MainPage";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Reg from "../Reg/Reg";
import Login from "../Login/Login";
import UserInfo from "../UserInfo/UserInfo";


function App() {
  return (
    <div className="App">
        <BrowserRouter >
            <Switch>
                <Route exact path="/" component={MainPage} />
                <Route path="/register" component={Reg} />
                <Route path="/login" component={Login} />
                <Route path="/:id" component={UserInfo} />
            </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
