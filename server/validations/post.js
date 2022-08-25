import {body} from 'express-validator'

export const postCreateValidation = [
    body('title', "Enter your title").isLength({min: 3}).isString(),
    body('text', "Enter your text").isLength({min: 10}).isString(),
    body('tags', "Wrong form of data(array need)").optional().isString(),
    body('imageUrl', "Wrong url").optional().isString()
]