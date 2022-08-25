import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import {useForm} from "react-hook-form";
import {fetchRegister, selectIsAuth} from "../../redux/slices/authSlice";
import {TOKEN} from "../../constants/storage";
import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

export const Registration = () => {
    const dispatch = useDispatch()
    const isAuth = useSelector(selectIsAuth)

    const {register, handleSubmit, formState: {errors, isValid}} = useForm({
        defaultValues: {
            email: 'test123@test.com',
            password: '',
            fullName: "",
            avatarUrl: 'https://play-lh.googleusercontent.com/CWzqShf8hi-AhV9dUjzsqk2URzdIv8Vk2LmxBzf-Hc8T-oGkLVXe6pMpcXv36ofpvtc',
        },
        mode: "onChange"
    })

    const onSubmit = async (data) => {
        console.log(data)
        const values = await dispatch(fetchRegister(data))
        if (values.payload.token) {
            window.localStorage.setItem(TOKEN, values.payload.token)
        } else {
            console.log("error")
        }
    }
    if (isAuth) {
        return <Navigate to={"/"}/>
    }

    return (
        <Paper classes={{root: styles.root}}>
            <Typography classes={{root: styles.title}} variant="h5">
                Создание аккаунта
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.avatar}>
                    <Avatar sx={{width: 100, height: 100}}/>
                </div>
                <TextField className={styles.field} error={Boolean(errors.fullName?.message)}
                           helperText={errors.fullName?.message}
                           type={"text"}
                           label="Полное имя"
                           fullWidth
                           {...register('fullName', {required: "Write your full name"})}
                />
                <TextField className={styles.field}
                           label="E-Mail"
                           error={Boolean(errors.email?.message)}
                           helperText={errors.email?.message}
                           type={"email"}
                           fullWidth
                           {...register('email', {required: "Write your email"})}
                />
                <TextField className={styles.field}
                           label="Пароль"
                           error={Boolean(errors.password?.message)}
                           fullWidth
                           type={"password"}
                           helperText={errors.password?.message}
                           {...register('password', {required: "Write your password"})}
                />
                <Button type={"submit"} size="large" variant="contained" disabled={!isValid} fullWidth>
                    Зарегистрироваться
                </Button>
            </form>
        </Paper>
    );
};
