// jQuery và jQuery UI
import $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';

// DataTables
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
$.extend(true, $.fn.dataTable.defaults, {
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Vietnamese.json'
    }
  });
