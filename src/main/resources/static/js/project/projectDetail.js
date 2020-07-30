var projectId = ''
var userIds = []
var projectIds = []
$(function () {
  var role = sessionStorage.getItem('role')
  var user = sessionStorage.getItem('user')
  var userId = sessionStorage.getItem('userId')


  console.log('role' + role)
  console.log('user' + user)
  console.log('userId' + userId)

  if (role == 0 || role == 1) {
    $('#addButton').css('display', 'block')
  }


  // init date tables
  var jobTable = $('#job_list').dataTable({
    dom:
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-4'l><'col-sm-4'i><'col-sm-4'p>>",
    deferRender: true,
    processing: false,
    serverSide: true,
    pagingType: 'full_numbers',
    ajax: {
      url: base_url + '/dataprepare/jobPageList',
      type: 'post',
      data: function (d) {
        var obj = {}
        obj.projectId = projectId
        obj.start = d.start
        obj.length = d.length
        return obj
      },
    },
    searching: false,
    ordering: false,
    //"scrollX": true,	// scroll x，close self-adaption
    columns: [
      {
        data: 'id',
        bSortable: false,
        visible: true,
        width: '5%',
      },
      {
        data: 'name',
        visible: true,
        width: '25%',
      },
      {
        data: 'dataSetStatus',
        visible: true,
        width: '20%',
      },
      {
        data: 'startTime',
        width: '15%',
        visible: true,
        render: function (data, type, row) {
          return data
              ? moment(new Date(data)).format('YYYY-MM-DD HH:mm:ss')
              : ''
        },
      },
      {
        data: 'status',
        visible: true,
        width: '10%',
      },
      {
        data: 'userName',
        visible: true,
        width: '10%',
      }/*,
      {
        data: 'id',
        visible: true,
        width: '15%',
        render: function (data, type, row) {
          tableData['key' + row.id] = row
          var logHref = base_url + '/dataprepare/jobDetail?jobId=' + row.id
          var html =
              '<div class="btn-group" _id="' +
              row.id +
              '">\n' +
              '   <a href="' +
              logHref +
              '">查看</a>\n' +
              '<a  href="' +
              base_url +
              '/dataprepare/reCreateJob?jobId=' +
              row.id +
              '" >' +
              '重新提交' +
              '</a><div>'
          var existed = false
          if ((role == 0 || row.userName == user) && row.endTime !== null) {
            existed = true
            html = html + '<div class="btn-group" _id="' + row.id + '">\n'
            html =
                html +
                '<a href="javascript:void(0);" class="remove" >' +
                '删除' +
                '</a>\n'
          }
          if ((role == 0 || row.userName == user) && row.endTime === null) {
            if (!existed) {
              html = html + '<div class="btn-group" _id="' + row.id + '">\n'
              existed = true
            }
            html =
                html +
                '<a href="javascript:void(0);" class="stopJob" >' +
                '中止' +
                '</a>\n'
          }
          if (row.userName == user && row.type == 1 && row.endTime === null) {
            if (!existed) {
              html = html + '<div class="btn-group" _id="' + row.id + '">\n'
              existed = true
            }
            html =
                html +
                '<a href="javascript:void(0);" class="modifyTime" >' +
                '修改定时时间' +
                '</a>'
          }
          if (existed) {
            html = html + '</div>'
          }

          return html
        },
      },*/
    ],

    language: {
      sProcessing: '处理中...',
      sLengthMenu: '每页 _MENU_ 条',
      sZeroRecords: '没有匹配结果',
      sInfo: '第 _PAGE_ 页 ( 总共 _PAGES_ 页，_TOTAL_ 条记录 )',
      sInfoEmpty: '无记录',
      sInfoFiltered: '(由 _MAX_ 项结果过滤)',
      sInfoPostFix: '',
      sSearch: '搜索',
      sUrl: '',
      sEmptyTable: '表中数据为空',
      sLoadingRecords: '载入中...',
      sInfoThousands: ',',
      oPaginate: {
        sFirst: '<<',
        sPrevious: '<',
        sNext: '>',
        sLast: '>>',
      },
      oAria: {
        sSortAscending: ': 以升序排列此列',
        sSortDescending: ': 以降序排列此列',
      },
    },
  })

  selectTable = $('#select_list').DataTable({
    dom:
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-4'l><'col-sm-4'><'col-sm-4'p>>",
    deferRender: true,
    processing: false,
    paging: false,
    /*rowReorder: {
      dataSrc: 'itemIndex',
    },*/
    ajax: {
      url: base_url + '/project/projectPageList',
      type: 'post',
      data: function (d) {
        var obj = {}
        obj.name = $('#projectName').val()
        obj.user = user
        obj.role = role
        obj.userId = userId
        return obj
      },
    },
    searching: false,
    ordering: false,
    columns: [
      {
        data: 'name',
        visible: true,
        width: '25%',
      },
      {
        data: 'scriptType',
        visible: true,
        width: '10%',
      },
      {
        data: 'purpose',
        visible: true,
        width: '10%',
      },
      {
        data: 'status',
        visible: true,
        width: '10%',
      },
      {
        data: 'id',
        visible: true,
        width: '30%',
        render: function (data, type, row) {
          let html=' <div class="progress-group">'+
              '<span class="progress-number"><b>80%</b></span>'+
              '<div class="progress sm">'+
              '<div class="progress-bar progress-bar-aqua" style="width: 80%;height: 8px;border-radius: 200px;padding-left:5px;padding-right: 5px "></div>'+
              '</div>'+
              '</div>';
          return html;
        }
      },
    ],
    language: {
      sProcessing: '处理中...',
      sLengthMenu: '每页 _MENU_ 条',
      sZeroRecords: '没有匹配结果',
      sInfo: '第 _PAGE_ 页 ( 总共 _PAGES_ 页，_TOTAL_ 条记录 )',
      sInfoEmpty: '无记录',
      sInfoFiltered: '(由 _MAX_ 项结果过滤)',
      sInfoPostFix: '',
      sSearch: '搜索',
      sUrl: '',
      sEmptyTable: '表中数据为空',
      sLoadingRecords: '载入中...',
      sInfoThousands: ',',
      oPaginate: {
        sFirst: '<<',
        sPrevious: '<',
        sNext: '>',
        sLast: '>>',
      },
      oAria: {
        sSortAscending: ': 以升序排列此列',
        sSortDescending: ': 以降序排列此列',
      },
    },
  })


})