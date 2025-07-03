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

/**
 * Lấy thông tin thú cưng theo ID.
 * @param {number} id ID của thú cưng.
 * @returns {Promise<AxiosResponse<any>>} Promise chứa response (dự kiến là PetDTO).
 */
export const getPetById = (id) => {
    console.log(`CLIENT-SIDE FETCH: Requesting pet by ID: /pet/${id}`);
    return api.get(`/pet/${id}`);
};

/**
 * Tìm kiếm thú cưng theo tên.
 * @param {string} name Tên thú cưng.
 * @returns {Promise<AxiosResponse<any>>} Promise chứa response (dự kiến là mảng PetDTO[]).
 */
export const findPetByName = (name) => {
    console.log(`CLIENT-SIDE FETCH: Requesting pet by name: ${name}`);
    return api.get(`/pet/findByName`, { params: { name } });
};

/**
 * Lấy danh sách thú cưng mới nhất theo thời gian tạo.
 * @returns {Promise<AxiosResponse<any>>} Promise chứa response (dự kiến là mảng PetDTO[]).
 */
export const getLatestPets = () => {
    console.log("CLIENT-SIDE FETCH: Requesting latest pets: /pet/latest");
    return api.get('/pet/latest');
};

/**
 * Lấy danh sách thú cưng bán chạy nhất cùng với số lượng đã bán.
 * @returns {Promise<AxiosResponse<any>>} Promise chứa response (dự kiến là mảng { quantitySold: number, pet: PetDTO }[]).
 */
export const getBestSellingPets = () => {
    console.log("CLIENT-SIDE FETCH: Requesting best-selling pets: /pet/best-selling-with-quantity");
    return api.get('/pet/best-selling-with-quantity');
};

/**
 * Lấy danh sách thú cưng được xem nhiều nhất cùng với số lượt xem.
 * @returns {Promise<AxiosResponse<any>>} Promise chứa response (dự kiến là mảng { viewCount: number, pet: PetDTO }[]).
 */
export const getMostViewedPets = () => {
    console.log("CLIENT-SIDE FETCH: Requesting most-viewed pets: /pet/most-viewed-with-count");
    return api.get('/pet/most-viewed-with-count');
};