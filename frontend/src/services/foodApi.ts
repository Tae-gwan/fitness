import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface Food {
  id: number;
  foodName: string;
  servingSizeString: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}

export const searchFoods = async (keyword: string): Promise<Food[]> => {
  if (!keyword.trim()) return [];
  
  try {
    const response = await axios.get(`${API_URL}/foods/search`, {
      params: { keyword }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching foods:', error);
    return [];
  }
};
