import api from './axiosConfig';

/**
 * Lấy TOÀN BỘ danh sách bình luận bị báo cáo.
 * @returns {Promise<AxiosResponse<any>>} Promise chứa response (dự kiến là mảng CommentResponse[]).
 */
export const getAllReportedComments = () => {
  console.log('CLIENT-SIDE FETCH: Requesting all reported comments: /reported');
  return api.get('/comment/reported');
};

/**
 * Bỏ báo cáo cho một bình luận cụ thể.
 * @param {number} commentId - ID của bình luận cần bỏ báo cáo.
 * @returns {Promise<AxiosResponse<any>>} Promise chứa response.
 */
export const unreportComment = (commentId) => {
  console.log(`CLIENT-SIDE PUT: Unreporting comment with ID: ${commentId}`);
  return api.put(`/comment/unreport/${commentId}`);
};