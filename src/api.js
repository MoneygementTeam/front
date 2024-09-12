import axios from 'axios';

export const getMonsterInventoryDataByUserId = async (userId) => {
  try {
    const response = await axios.get('https://moneygement.o-r.kr/cards', {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching monster inventory data:', error);
    throw error;
  }
};
