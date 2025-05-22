import { useEffect } from 'react';
import $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';

const DateRangePicker = ({ startId = 'startDate', endId = 'endDate' }) => {
  useEffect(() => {
    $(`#${startId}, #${endId}`).datepicker({
      dateFormat: 'dd-mm-yy',
    });
  }, [startId, endId]);

  return (
    <div className="row">
      <div className="col-lg-3">
        <label htmlFor={startId}>Từ ngày:</label>
        <input type="text" id={startId} name={startId} className="form-control" />
      </div>
      <div className="col-lg-3">
        <label htmlFor={endId}>Đến ngày:</label>
        <input type="text" id={endId} name={endId} className="form-control" />
      </div>
    </div>
  );
};

export default DateRangePicker;
