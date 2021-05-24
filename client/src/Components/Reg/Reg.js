import './Reg.css';
import  {useState} from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {Link} from "react-router-dom";

const SignupSchema = Yup.object().shape({
    fio: Yup.string()
        .min(7, 'Некорректное ФИО')
        .max(50, 'Too Long!')
        .required('Обязательное поле')
        .matches(/[а-яёА-ЯЁ]/, 'ФИО должен содержать только кирилицу'),
    phone: Yup.string()
        .min(6, 'Неккоректный телефон')
        .max(50, 'Too Long!')
        .required('Обязательное поле'),
    email: Yup.string().email('Некорректный email').required('Обязательное поле'),
    pass: Yup.string().min(8, 'Слишком короткий пароль').required('Обязательное поле').matches(/[a-zA-Z]/, 'Пароль должен содержать только латинские символы'),
    passConfirm: Yup.string().min(8, 'Слишком короткий пароль').required('Обязательное поле').oneOf([Yup.ref('pass')], 'Пароли не совпадают')

});

function Reg({history}) {

    const [emailError, setEmailError] = useState(false)
    const [emailValid, setEmailValid] = useState(false);
    const [fioValid, setFioValid] = useState(false);
    const [phoneValid, setPhoneValid] = useState(false);
    const [passValid, setPassValid] = useState(false);
    const [passConfirmValid, setPassConfirmValid] = useState(false);

    const [loading, setLoading] = useState(false)
    const [popup, setPopup] = useState(false)
    return (
        <div>
            <div className="register-page">
                {loading ? <div className='loading'><div className="loader">Loading...</div></div> : null}
                {popup ? <div className='loading'><div className="popup"><p>Регистрация прошла успешно!</p> <Link to='/login' className='auth-bth'>Авторизация!</Link></div></div> : null}
                <p className='register-page__title'>Регистрация</p>
                <Formik
                    initialValues={{
                        fio: '',
                        phone: '',
                        email: '',
                        pass: '',
                        passConfirm: ''
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={values => {
                        setLoading(true)
                        var formdata = new FormData();
                        formdata.append("fio", values['fio']);
                        formdata.append("phone", values['phone']);
                        formdata.append("email", values['email']);
                        formdata.append("pass", values['pass']);
                        formdata.append("passConfirm", values['passConfirm']);

                        var requestOptions = {
                            method: 'POST',
                            body: formdata,
                            redirect: 'follow'
                        };

                        fetch("https://volga24bot.com/task/register.php", requestOptions)
                            .then(response => response.json())
                            .then(result => {

                                if (result['access']) {
                                    setPopup(true);
                                } else if (result['error']) {
                                    setEmailError(true)
                                } else if (result['validError']){
                                    result['validError'].forEach((element) => {
                                        if (element === 'pass') {
                                            setPassValid(true);
                                        } else if (element === 'phone') {
                                            setPhoneValid(true)
                                        } else if (element === 'email') {
                                            setEmailValid(true)
                                        } else if (element === 'passConfirm') {
                                            setPassConfirmValid(true)
                                        } else if (element === 'fio') {
                                            setFioValid(true)
                                        }
                                    })
                                } else {
                                    alert('Произошла непредвиденная ошибка')
                                }
                                setLoading(false);
                            })
                            .catch(error => console.log('error', error));
                    }}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <Field name="fio" className='input-text' placeholder='ФИО'/>
                            {errors.fio && touched.fio ? (
                                <div className='error_auth'>{errors.fio}</div>
                            ) : null}
                            {fioValid ? <div className='error_auth'>ФИО должно содержать только кирилицу</div> : null}
                            <Field name="phone" className='input-text' placeholder='Телефон'/>
                            {errors.phone && touched.phone ? (
                                <div className='error_auth'>{errors.phone}</div>
                            ) : null}
                            {phoneValid ? <div className='error_auth'>Неккоректный формат телефона</div> : null}
                            <Field name="email" type="email" className='input-text' placeholder='E-mail'/>
                            {errors.email && touched.email ? <div className='error_auth'>{errors.email}</div> : null}
                            {emailError ? <div className='error_auth'>Аккаунт с данным E-mail уже существует</div> : null}
                            {emailValid ? <div className='error_auth'>Некорректный E-mail</div> : null}
                            <Field name="pass" type="password" className='input-text' placeholder='Пароль'/>
                            {errors.pass && touched.pass ? <div className='error_auth'>{errors.pass}</div> : null}
                            {passValid ? <div className='error_auth'>Пароль должен содержать минимум 1 заглавную букву и 1 цифру</div> : null}
                            <Field name="passConfirm" type="password" className='input-text' placeholder='Подтверждение пароля'/>
                            {errors.passConfirm && touched.passConfirm ? <div className='error_auth'>{errors.passConfirm}</div> : null}
                            {passConfirmValid ? <div className='error_auth'>Пароли не совпадают</div> : null}
                            <button type="submit" className='submit-bth'>Зарегистрироваться!</button>
                            <p>Или</p>
                            <Link to='/login' className='auth-bth logIn-bth'>Войти</Link>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>

    )
}

export default Reg;
