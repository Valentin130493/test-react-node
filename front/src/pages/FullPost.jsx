import React, {useEffect, useState} from "react";

import {Post} from "../components/Post/index";
import {Index} from "../components/AddComment/index";
import {CommentsBlock} from "../components";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {baseURL, posts} from "../constants/api";
import {useSelector} from "react-redux";
import {selectIsAuth} from "../redux/slices/authSlice";
import ReactMarkdown from "react-markdown";


export const FullPost = () => {
    const [post, setPost] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const {id} = useParams()
    let navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth)

    useEffect(() => {
        axios.get(`${baseURL}${posts}/${id}`)
            .then((res) => {
                setPost(res.data)
                setIsLoading(false)
            })
            .catch((err) => console.log(err))
    }, [])

    if (isLoading) {
        return <Post isLoading={true}/>
    }
    return (<>
        <Post
            id={post._id}
            title={post.title}
            imageUrl={post.imageUrl}
            user={post.user}
            createdAt={post.imageUrl ? `http://localhost:4444/${post.createdAt}` : ''}
            viewsCount={post.viewsCount}
            commentsCount={post.commentsCount}
            tags={post.tags}
            isFullPost
        >
            <p>
                <ReactMarkdown children={post.text}/>
            </p>
        </Post>
        <CommentsBlock
            items={[{
                user: {
                    fullName: "Вася Пупкин", avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                }, text: "Это тестовый комментарий 555555",
            }, {
                user: {
                    fullName: "Иван Иванов", avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
            },]}
            isLoading={false}
        >
            <Index/>
        </CommentsBlock>
    </>);
};
