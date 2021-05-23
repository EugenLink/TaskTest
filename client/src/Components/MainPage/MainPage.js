import './MainPage.css';
import {Link} from "react-router-dom";

function MainPage() {
    return (
        <div className="mainPage">
            <Link to='/register' className='auth-bth auth-bth_reg'>Регистрация</Link>
            <Link to='/login' className='auth-bth auth-bth_login'>Вход</Link>
        </div>
    );
}

export default MainPage;
