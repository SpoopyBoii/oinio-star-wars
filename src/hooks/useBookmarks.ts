import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserBookmarks, saveBookmark, deleteBookmark } from '../services/bookmarks.service';
import type { BookmarkRecord } from '../services/bookmarks.service';
import { useAuth } from '../context/AuthContext';

export const useBookmarks = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch bookmarks only if the user is logged in
    const bookmarksQuery = useQuery({
        queryKey: ['bookmarks', user?.id],
        queryFn: getUserBookmarks,
        enabled: !!user,
    });

    const saveMutation = useMutation({
        mutationFn: (record: Omit<BookmarkRecord, 'id' | 'user_id'>) => {
            if (!user) throw new Error('Must be logged in to save');
            return saveBookmark({ ...record, user_id: user.id });
        },
        onSuccess: () => {
            // Invalidate the cache to trigger a UI refresh immediately after saving
            queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (entityUrl: string) => deleteBookmark(entityUrl),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.id] });
        },
    });

    return {
        bookmarks: bookmarksQuery.data || [],
        isLoading: bookmarksQuery.isLoading,
        saveBookmark: saveMutation.mutateAsync,
        deleteBookmark: deleteMutation.mutateAsync,
        isSaving: saveMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};