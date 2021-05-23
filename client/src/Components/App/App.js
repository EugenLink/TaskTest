import './App.css';
import MainPage from "../MainPage/MainPage";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Reg from "../Reg/Reg";
import Login from "../Login/Login";

function App() {
  return (
    <div className="App">
        <BrowserRouter >
            <Switch>
                <Route exact path="/" component={MainPage} />
                <Route path="/register" component={Reg} />
                <Route path="/login" component={Login} />
            </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
