import { supabase } from '../lib/supabase';

export interface BookmarkRecord {
    id?: string;
    user_id?: string;
    entity_type: 'people' | 'planets' | 'starships';
    entity_url: string;
    notes: string;
    rating?: number;
    created_at?: string;
}

// Fetch all saved records for the logged-in user
export const getUserBookmarks = async (): Promise<BookmarkRecord[]> => {
    const { data, error } = await supabase
        .from('user_bookmarks')
        .select('*');

    if (error) throw error;
    return data || [];
};

// Insert or update a record
export const saveBookmark = async (
    record: Omit<BookmarkRecord, 'id' | 'user_id'> & { user_id: string }
) => {
    // We use upsert with the unique constraint to either create a new record or update existing notes
    const { data, error } = await supabase
        .from('user_bookmarks')
        .upsert(record, { onConflict: 'user_id, entity_url' })
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Remove a record completely
export const deleteBookmark = async (entityUrl: string) => {
    const { error } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('entity_url', entityUrl);

    if (error) throw error;
    return true;
};

// Update only the rating for a specific record
export const updateBookmarkRating = async (entityUrl: string, rating: number) => {
    const { data, error } = await supabase
        .from('user_bookmarks')
        .update({ rating })
        .eq('entity_url', entityUrl)
        .select()
        .single();

    if (error) throw error;
    return data;
};