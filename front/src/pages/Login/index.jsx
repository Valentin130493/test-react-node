import React from "react";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router-dom"

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import {fetchAuth, selectIsAuth} from "../../redux/slices/authSlice";

import styles from "./Login.module.scss";
import {TOKEN} from "../../constants/storage";


export const Login = () => {
    const dispatch = useDispatch()
    const isAuth = useSelector(selectIsAuth)

    const {register, handleSubmit, formState: {errors, isValid}} = useForm({
        defaultValues: {
            email: 'test123@test.com',
            password: ''
        },
        mode: "onChange"
    })

    const onSubmit = async (data) => {
        const values = await dispatch(fetchAuth(data))
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
                Вход в аккаунт
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    type={"email"}
                    fullWidth
                    {...register('email', {required: "Write your email"})}
                />
                <TextField
                    className={styles.field}
                    label="Пароль"
                    error={Boolean(errors.password?.message)}
                    fullWidth
                    type={"password"}
                    helperText={errors.password?.message}
                    {...register('password', {required: "Write your password"})}/>
                <Button type={"submit"} size="large" variant="contained" fullWidth disabled={!isValid}>
                    Войти
                </Button>
            </form>
        </Paper>
    );
};
