import { useCommentStore } from "../store/useCommentStore";

export const useSaveComment = () => {
    const createComment = useCommentStore((state) => state.createComment);
    const updateComment = useCommentStore((state) => state.updateComment);

    const saveComment = async (data, commentId = null) => {
        const payload = {
            review: Number(data.review),
            comment: data.comment,

            restaurantId: data.restaurantId || undefined,
            dishId: data.dishId || undefined
        };

        if (commentId) {
            await updateComment(commentId, payload);
        } else {
            await createComment(payload);
        }
    };

    return { saveComment };
};