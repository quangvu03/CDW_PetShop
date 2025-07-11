
import api from './axiosConfig'; 
/**
 * Lấy TOÀN BỘ danh sách Pet theo loài.
 * KHÔNG gửi page/size.
 * @param {string} speciesName Tên loài.
 * @returns {Promise<AxiosResponse<any>>} Promise chứa response (dự kiến là MẢNG PetDTO[]).
 */
export const getPetsBySpecies = (speciesName) => {
    const encodedSpeciesName = encodeURIComponent(speciesName);
    console.log(`CLIENT-SIDE FETCH: Requesting ALL pets for species: /pet/species/${encodedSpeciesName}`);
    // Chỉ gửi tên loài, không gửi page=...&size=...
    return api.get(`/pet/species/${encodedSpeciesName}`);
  };
  
  /**
   * Lấy danh sách tất cả các tên loài duy nhất.
   * @returns {Promise<AxiosResponse<any>>} Promise chứa response (dự kiến là mảng string).
   */
  export const getAllSpecies = () => {
    console.log("CLIENT-SIDE FETCH: Requesting all species: /pet/species");
    return api.get('/pet/species');
  };

  export const getPetById = (id) => {
    console.log(`CLIENT-SIDE FETCH: Requesting pet by ID: /pet/${id}`);
    return api.get(`/pet/${id}`);
  };

export const findPetByName = (name) => {
  console.log(`CLIENT-SIDE FETCH: Requesting pet by name: ${name}`);
  return api.get(`/pet/findByName`, { params: { name } });
};
