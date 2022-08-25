import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/authSlice";
import {Navigate, useNavigate, useParams} from "react-router-dom"

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import {TOKEN} from "../../constants/storage";
import Axios from "../../utils/axios";
import {posts, upload} from "../../constants/api";


export const AddPost = () => {
    const isAuth = useSelector(selectIsAuth)
    const navigate = useNavigate()
    const {id} = useParams()

    const [, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState('');
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');

    const isEditing = Boolean(id)


    const inputFileRef = useRef(null)


    const handleChangeFile = async (e) => {
        try {
            const formData = new FormData()
            const file = e.target.files[0]
            formData.append('image', file)
            const {data} = await Axios.post(`${upload}`, formData)
            setImageUrl(data.url)
        } catch (err) {
            console.log(err)
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl('')
    };

    const onChange = React.useCallback((value) => {
        setText(value);
    }, []);

    const onSubmit = async () => {
        try {
            setLoading(true)

            const fields = {
                text,
                title,
                tags,
                imageUrl
            }

            const {data} = isEditing ? await Axios.patch(`${posts}/${id}`) : await Axios.post(`${posts}`, fields)

            const _id = isEditing ? id : data._id

            navigate(`posts/${_id}`)

            setLoading(false)

        } catch (err) {
            console.warn(err)
        }
    }

    useEffect(() => {
        if (id) {
            Axios.get(`${posts}/${id}`).then(({data}) => {
                const {title, text, tags, imageUrl} = data

                setTitle(title)
                setText(text)
                setTags(tags.join(','))
                setImageUrl(imageUrl)


            })
        }
    }, [id])

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        [],
    );

    if (!window.localStorage.getItem(TOKEN) && !isAuth) {
        return <Navigate to={"/"}/>
    }

    return (
        <Paper style={{padding: 30}}>
            <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
                Загрузить превью
            </Button>
            <input ref={inputFileRef} type="file" onChange={(e) => handleChangeFile(e)} hidden/>
            {imageUrl && (<>
                    <Button variant="contained" color="error" onClick={onClickRemoveImage}>
                        Удалить
                    </Button>
                    <img className={styles.image} src={`http://localhost:4444/${imageUrl}`} alt="Uploaded"/>
                </>
            )}

            <br/>
            <br/>
            <TextField
                classes={{root: styles.title}}
                variant="standard"
                placeholder="Заголовок статьи..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
            />
            <TextField classes={{root: styles.tags}} variant="standard" placeholder="Тэги" value={tags}
                       onChange={(e) => setTags(e.target.value)} fullWidth/>
            <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options}/>
            <div className={styles.buttons}>
                <Button onClick={onSubmit} size="large" variant="contained">
                    {isEditing ? 'Сохранить' : 'Опубликовать'}
                </Button>
                <a href="/">
                    <Button size="large">Отмена</Button>
                </a>
            </div>
        </Paper>
    );
};
