import './UserInfo.css';

import  {useState} from 'react';

import { useCookies } from 'react-cookie';


function UserInfo({history}) {
    const [cookies, setCookie] = useCookies(['name']);

    console.log(cookies);
    return (
        <div className="user-info">

        </div>
    );
}

export default UserInfo;
