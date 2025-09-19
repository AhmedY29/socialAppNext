"use server"

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action"
import { revalidatePath } from "next/cache";


export const createPost = async (content: string, image: string) => {
    try {
        const userId = await getDbUserId();

        if(!userId) return;

        const post = await prisma.post.create({
            data: {
                content,
                image,
                authorId: userId,
            }
        })
        revalidatePath('/')
        return { success: true, post }
    } catch (error) {
        console.log('Failed to create post: ', error)
        return { success: false, error: 'Failed to create post' }
    }
}

export const getPosts = async () => {
    try {
        const posts = await prisma.post.findMany({
            orderBy:{
                createdAt: 'desc'
            },
            include:{
                author: {
                    select:{
                        id: true,
                        name: true,
                        image: true,
                        username: true,
                    }
                },
                comments: {
                    include:{
                        author:{
                            select:{
                                id: true,
                                username: true,
                                image: true,
                                name: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
                likes: {
                    select:{
                        userId: true,
                    }
                },
                _count: {
                    select:{
                        comments: true,
                        likes: true
                    }
                }
            }
        });

        return posts
    } catch (error) {
        console.log('Error in Get Posts: ', error);
        throw new Error("Failed to fetch posts")
    }
}

export const toggleLike = async (postId: string) => {
    try {
        const userId = await getDbUserId()
        if(!userId) return;

        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        })

        const post = await prisma.post.findUnique({
            where: {id: postId },
            select: {authorId: true}
        })

        if(!post) throw new Error("Post Not Found");

        if(existingLike) {
            // UnLike

            await prisma.like.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId
                    }
                }
            })
        } else {
            await prisma.$transaction([
                prisma.like.create({
                    data: {
                        userId,
                        postId,
                    }
                }),
                ...(post.authorId !== userId 
                    ? [
                        prisma.notification.create({
                            data: {
                                type: 'LIKE',
                                userId: post.authorId,
                                creatorId: userId,
                                postId,
                            }
                        })
                    ]
                    : []
                )
            ])
        }
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.log("Failed to toggle like: ", error)
        return { success: false, error: "Failed to toggle like" }
    }
}


export const createComment = async (postId: string, content: string) => {
    try {
        const userId = await getDbUserId()

        if(!userId) return;
        if(!content) throw new Error("Content is Required");

        const post = await prisma.post.findUnique({
            where: {id: postId},
            select: {authorId: true}
        })

        if(!post) throw new Error("Post Not Found");

        const [comment] = await prisma.$transaction(async (tx) => {

            const newComment = await tx.comment.create({
                data:{
                    content,
                    authorId: userId,
                    postId
                }
            });

            if(post.authorId !== userId) {
                await tx.notification.create({
                    data: {
                        type: 'COMMENT',
                        userId: post.authorId,
                        creatorId: userId,
                        postId,
                        commentId: newComment.id
                    }
                });
            }

            return [newComment]
        });

        revalidatePath('/');
        return { success: true, comment }
    } catch (error) {
        console.log("Failed to create comment: ", error);
        return { success: false, error: "Failed to create comment" }
    }
}

export const deletePost = async (postId: string) => {
    try {
        const userId = await getDbUserId();

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true }
        });

        if(!post) throw new Error("Post Not Found");
        if (post.authorId !== userId) throw new Error("Unauthorized - no delete permission");

        await prisma.post.delete({
            where: { id: postId },
        })

        revalidatePath('/')
        return {success: true}
    } catch (error) {
        console.log("Failed to delete post: ", error);
        return { success: false, error: "Failed to delete post" }
    }
}