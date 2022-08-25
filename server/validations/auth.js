import {body} from 'express-validator'


export const loginValidation = [
    body('email', "Invalid email").isEmail(),
    body('password', "Password length can't be less 5 symbols").isLength({min: 5}),
]

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
    body('fullName', 'Укажите имя').isLength({min: 3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];