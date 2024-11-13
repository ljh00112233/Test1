import axios from 'axios';
import { API_KEY, API_BASE_URL } from './apiKey';

const lostArkApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const getCharacterInfo = async (characterName) => {
  try {
    const encodedName = encodeURIComponent(characterName);
    const response = await lostArkApi.get(`/${encodedName}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};