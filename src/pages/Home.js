import React, { useState, useEffect } from "react";
import {getDoc, getDocs, collection, deleteDoc, doc} from 'firebase/firestore';
import {auth, db} from '../firebase-config';

function Home({isAuth}) {
    const [postsLists, setPostList] = useState([]);
    const postsCollectionRef = collection(db, "posts");

    const getPosts = async () => {
        try {
            const data = await getDocs(postsCollectionRef); 
            setPostList(data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                createdAt: doc.data().createdAt?.toDate() || new Date()
            })));
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        getPosts();
    }, []);

    const deletePost = async (id) => {
        try {
            const postDoc = doc(db, "posts", id);
            await deleteDoc(postDoc);
            // Refresh the posts list after deletion
            await getPosts();
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return (
        <div className="homePage">
            {postsLists.length === 0 ? (
                <div className="empty-state">
                    <h2>No posts yet</h2>
                    <p>Be the first to share your thoughts!</p>
                </div>
            ) : (
                postsLists.map((post) => (
                    <div className="post" key={post.id}>
                        <div className="postHeader">
                            <div className="title">
                                <h2>{post.title}</h2>
                            </div>
                            <div className="deletePost">
                                {isAuth && post.author.id === auth.currentUser?.uid && (
                                    <button
                                        onClick={() => deletePost(post.id)}
                                        title="Delete post"
                                        aria-label="Delete post"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="postTextContainer">
                            <p>{post.postText}</p>
                        </div>
                        <div className="postMeta">
                            <div className="author">
                                <span className="by">Posted by </span>
                                <span className="name">@{post.author.name}</span>
                            </div>
                            <div className="date">
                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;
