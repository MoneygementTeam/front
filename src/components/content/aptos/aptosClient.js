import axios from "axios";
import {API_SERVER} from "../../../client/RequestQueryClient.js";

const api = axios.create({
    baseURL: API_SERVER ,
    withCredentials: false, // 필요한 경우 (쿠키를 포함해야 하는 경우)
});

export const createCard = async ({userId, nftId, cardUrl}) => {
    const response = await api.post('/api/cards', {
        userId: userId,
        nftId: nftId,
        cardUrl: cardUrl
    });
    return response;
}