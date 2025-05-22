import { useEffect, useState } from 'react';
import DateRangePicker from '../../components/common/DateRangePicker';
import axios from 'axios';
import $ from 'jquery';

const AdminChatboxManager = () => {
  const [messages, setMessages] = useState([]);
  const [responseMap, setResponseMap] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [startDate, endDate]);

  useEffect(() => {
    $('#chatboxTable').DataTable();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/admin/chatbot-messages', {
        params: { startDate, endDate },
      });
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching chatbot messages:', error);
    }
  };

  const handleResponseChange = (id, value) => {
    setResponseMap({ ...responseMap, [id]: value });
  };

  const handleReply = async (id) => {
    try {
      await axios.put(`/api/admin/chatbot-messages/${id}`, {
        response: responseMap[id],
      });
      fetchMessages();
    } catch (error) {
      console.error('Error replying to message:', error);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <h5 className="mb-3">Quản lý Chatbot / Liên hệ</h5>

        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        <div className="card mt-3">
          <div className="card-body">
            <div className="table-responsive">
              <table id="chatboxTable" className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Người dùng</th>
                    <th>Tin nhắn</th>
                    <th>Phản hồi</th>
                    <th>Thời gian</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg, idx) => (
                    <tr key={msg.id}>
                      <td>{idx + 1}</td>
                      <td>{msg.user_id}</td>
                      <td>{msg.message}</td>
                      <td>
                        {msg.response ? (
                          msg.response
                        ) : (
                          <input
                            type="text"
                            className="form-control"
                            value={responseMap[msg.id] || ''}
                            onChange={(e) =>
                              handleResponseChange(msg.id, e.target.value)
                            }
                          />
                        )}
                      </td>
                      <td>{new Date(msg.created_at).toLocaleString()}</td>
                      <td>
                        {!msg.response && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleReply(msg.id)}
                          >
                            Trả lời
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatboxManager;
