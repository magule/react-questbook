import React, { useState, useEffect } from "react";
import {getDoc, getDocs, collection,deleteDoc, doc} from 'firebase/firestore';
import {auth, db} from '../firebase-config';

function Home({isAuth}) {
    const [postsLists, setPostList] = useState([]);
    const postsCollectionRef = collection(db, "posts");


    useEffect(() => {
        const getPosts = async () => {
            const data = await getDocs(postsCollectionRef); 
            setPostList(data.docs.map((doc)  => ({  ...doc.data(), id: doc.id })));
        };

        getPosts();
    });
    const deletePost = async (id) => {
        const postDoc = doc(db, "posts", id);
        await deleteDoc(postDoc);
    };

    return (
        <div className="homePage">
            {postsLists.map((post) => {
                return (
                <div className="post">
                    <div className="postHeader">
                         <div className="title">
                             <h2> {post.title} </h2>
                        </div> 
                        <div className="deletePost">
                          {isAuth && post.author.id === auth.currentUser.uid && (
                            <button
                            onClick={() => {
                              deletePost(post.id);
                            }}
                          >
                            {" "}
                            <small>x</small>
                          </button>
                         )}
                        </div>
                    </div>
                    <div className="postTextContainer"> <p>{post.postText}</p> </div>
                    <small>@{post.author.name}</small> 
                </div>

                );
            })}    
        </div>
    );
}

export default Home;
