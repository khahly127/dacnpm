import { supabase } from '../config/supabaseClient';

export const qrModel = {
    async saveQRCodeToDB(tableId: number, imageUrl: string) {
        const { data: existingQR, error: findError } = await supabase
            .from('maqr')
            .select('qr_id')
            .eq('ma_ban', tableId)
            .maybeSingle();

        if (findError) {
            throw new Error(findError.message);
        }

        if (existingQR) {
            const { data, error } = await supabase
                .from('maqr')
                .update({ image_url: imageUrl })
                .eq('ma_ban', tableId)
                .select();

            if (error) {
                throw new Error(error.message);
            }

            return data;
        }

        const { data, error } = await supabase
            .from('maqr')
            .insert([{ ma_ban: tableId, image_url: imageUrl }])
            .select();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },
};
