import './MainPage.css';
import {Link} from "react-router-dom";
import {useEffect} from "react";
import {useCookies} from "react-cookie";

function MainPage({history}) {
    const [cookies, setCookie] = useCookies(['name']);

    useEffect(() => {
        if (cookies['id']) {
            const _id = cookies['id'] / 60 / 50 / 25;
            history.push(`/${_id}`)
        }
    }, [])

    return (
        <div className="mainPage">
            <Link to='/register' className='auth-bth auth-bth_reg'>Регистрация</Link>
            <Link to='/login' className='auth-bth auth-bth_login'>Вход</Link>
        </div>
    );
}

export default MainPage;
