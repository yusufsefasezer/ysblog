$(function () {

  'use strict';

  // bootstrap WYSIHTML5 - text editor
  $('.textarea').wysihtml5();

  // Post list data table
  $('#post_list').DataTable({
    'ordering': false
  });

  // Category data table
  $('#category_list').DataTable({
    'paging': true,
    'lengthChange': false,
    'searching': true,
    'ordering': true,
    'info': true,
    'autoWidth': false
  });

  //Initialize Select2 Elements
  $('.select2').select2();

});