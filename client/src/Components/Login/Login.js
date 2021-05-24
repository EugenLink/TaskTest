import './Login.css';
import {Field, Form, Formik} from "formik";
import {Link} from "react-router-dom";
import {useEffect, useState} from 'react';
import * as Yup from 'yup';
import { useCookies } from 'react-cookie';


const SigninSchema = Yup.object().shape({
    email: Yup.string().email('Некорректный email').required('Обязательное поле'),
    pass: Yup.string().min(8, 'Слишком короткий пароль').required('Обязательное поле').matches(/[a-zA-Z]/, 'Пароль должен содержать только латинские символы')
});

function Login({history}) {
    const [authError, setAuthError] = useState(false)
    const [cookies, setCookie] = useCookies(['name']);
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (cookies['id']) {
            const _id = cookies['id'] / 60 / 50 / 25;
            history.push(`/${_id}`)
        }
    }, [])


    return (
        <div className="register-page">
            {loading ? <div className='loading'><div className="loader">Loading...</div></div> : null}
            <p className='register-page__title'>Вход</p>
            <Formik
                initialValues={{
                    email: '',
                    pass: ''
                }}
                validationSchema={SigninSchema}
                onSubmit={values => {
                    setLoading(true)


                    fetch(`https://volga24bot.com/task/register.php?email=${values['email']}&pass=${values['pass']}&method=auth`)
                        .then(response => response.json())
                        .then(result => {

                            if (result['access']) {
                                const _id = result['access'][0];
                                setCookie('id', _id * 60 * 50 * 25, { path: '/' });
                                history.push(`/${_id}`)
                            } else if (result['access_denied']) {
                                setAuthError(true)
                            }
                            setLoading(false);
                        })
                        .catch(error => console.log('error', error));
                }}
            >
                {({ errors, touched }) => (
                    <Form>
                        <Field name="email" type="email" className='input-text' placeholder='E-mail'/>
                        {errors.email && touched.email ? <div className='error_auth'>{errors.email}</div> : null}
                        <Field name="pass" type="password" className='input-text' placeholder='Пароль'/>
                        {errors.pass && touched.pass ? <div className='error_auth'>{errors.pass}</div> : null}
                        {authError ? <div className='error_auth'>Неверный email или пароль</div> : null}
                        <button type="submit" className='submit-bth submit-bth__login'>Войти!</button>
                        <p>Или</p>
                        <Link to='/register' className='auth-bth signup-bth'>Зарегистрироваться!</Link>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Login;
