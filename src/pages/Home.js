import React, { useState, useEffect } from "react";
import {getDoc, getDocs, collection, deleteDoc, doc, query, orderBy} from 'firebase/firestore';
import {auth, db} from '../firebase-config';

function Home({isAuth}) {
    const [postsLists, setPostList] = useState([]);
    const postsCollectionRef = collection(db, "posts");

    const getPosts = async () => {
        try {
            const data = await getDocs(postsCollectionRef);
            const posts = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                docId: parseInt(doc.id) || 0
            }));
            
            // Sort posts by createdAt timestamp if available, otherwise use document ID
            const sortedPosts = posts.sort((a, b) => {
                // If both posts have createdAt timestamps, use them
                if (a.createdAt && b.createdAt) {
                    return b.createdAt.seconds - a.createdAt.seconds;
                }
                // If only one post has createdAt, put the one with timestamp first
                if (a.createdAt) return -1;
                if (b.createdAt) return 1;
                // If neither has createdAt, fall back to document ID
                return b.docId - a.docId;
            });
            
            setPostList(sortedPosts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        getPosts();
        // Set up an interval to refresh posts periodically
        const interval = setInterval(getPosts, 10000); // Refresh every 10 seconds
        
        // Cleanup interval on component unmount
        return () => clearInterval(interval);
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
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;
