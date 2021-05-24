import './UserInfo.css';

import {useEffect, useState} from 'react';

import { useCookies } from 'react-cookie';
import {Link} from "react-router-dom";


function UserInfo({history}) {
    const [cookies, setCookie, removeCookie] = useCookies(['id']);
    const [loading, setLoading] = useState(false)
    const [popup, setPopup] = useState(false)
    const [data, setData] = useState({});

    const logOut = () => {
        removeCookie('id');
        history.push('/')
    }
    useEffect(() => {
        setLoading(true)
        const _id = history.location.pathname.substr(1)
        if (cookies['id'] / 60 / 50 / 25 != _id) {
            setLoading(false)
            history.push('/')
        } else {
            fetch(`https://volga24bot.com/task/register.php?id=${_id}&method=getData`)
                .then(response => response.json())
                .then(result => {
                    if (result['access']) {
                        setData(result['access']);
                    } else  {
                        removeCookie('id');
                        history.push('/');
                    }
                    setLoading(false);
                })
                .catch(error => console.log('error', error));
        }
    }, [])
    return (
        <div className="user-info">
            {popup ? <div className='loading'><div className="popup"><p>Вы уверены что хотите выйти?</p> <button onClick={() => logOut()} className='logOut logOut-confirm'>Да!</button></div></div> : null}
            {loading ? <div className='loading'><div className="loader">Loading...</div></div> : null}
            {data ? <div className="">
                <h1>Ваши данные:</h1>
                <p>ФИО: {data[1]}</p>
                <p>E-mail: {data[3]}</p>
                <p>Телефон: {data[2]}</p>
                <button className='logOut' onClick={() => setPopup(true)}>Выйти</button>
            </div> : null}
        </div>
    );
}

export default UserInfo;
