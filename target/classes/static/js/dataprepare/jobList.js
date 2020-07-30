var tableData = {}
$(function () {
  // init date tables
  var role = sessionStorage.getItem('role')
  var user = sessionStorage.getItem('user')
  var userId = sessionStorage.getItem('userId')

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
        obj.searchInfo = $('#searchInfo').val()
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
      },
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

  $('#searchBtn').on('click', function (e) {
    e.preventDefault()
    console.log(searchBtn)
    jobTable.fnDraw()
  })

  $('#createJob').on('click', function () {
    // init-cronGen

    $('#projectId option[value=' + projectId + ']').prop('selected', true)
    $('#projectId').change()
    $('#add-modal').modal('show')
  })

  $('#projectId').on('change', function () {
    var projectIdCur = $(this).children('option:selected').val()
    $(this).val($(this).children('option:selected').val())

    $('#testCaseId').html('')
    var testCaseExisted = false
    $.each(testCaseArray, function (n, value) {
      if (value.projectId == projectIdCur) {
        testCaseExisted = true
        $('#testCaseId').append(
          '<option value="' + value.id + '" >' + value.testName + '</option>'
        )
      }
    })

    if (testCaseExisted) {
      $('#chooseTestCase').removeAttr('disabled')
    } else {
      $('#chooseTestCase').attr('disabled', 'disabled')
    }
  })

  $('#chooseTestCase').on('click', function () {
    // init-cronGen
    window.location.href =
      base_url +
      '/dataprepare/createJob?projectId=' +
      $('#projectId').children('option:selected').val() +
      '&testCaseId=' +
      $('#testCaseId').children('option:selected').val()
  })

  $('#job_list').on('click', '.remove', function () {
    var id = $(this).parents('div').attr('_id')
    layer.confirm(
      '确认删除此任务?',
      {
        icon: 3,
        title: '系统提示',
        btn: ['确定', '取消'],
      },
      function (index) {
        layer.close(index)

        $.ajax({
          type: 'POST',
          url: base_url + '/dataprepare/deleteJob',
          data: {
            id: id,
          },
          dataType: 'json',
          success: function (data) {
            if (data.code == 200) {
              layer.msg('删除数据成功')
              jobTable.fnDraw()
            } else {
              layer.msg(data.msg || '删除数据失败')
            }
          },
        })
      }
    )
  })

  $('#job_list').on('click', '.modifyTime', function () {
    var id = $(this).parents('div').attr('_id')
    var row = tableData['key' + id]

    $('#cron').val(row.cron)
    $('#cronId').val(id)
    $('#modify-time-modal').modal('show')
  })

  $('#clear').on('click', function () {
    $('#searchForm')[0].reset()
  })

  $('#modifyCron').on('click', function () {
    $.ajax({
      type: 'POST',
      url: base_url + '/dataprepare/modifyTime',
      data: {
        id: $('#cronId').val(),
        newTime: $('#cron').val(),
      },
      dataType: 'json',
      success: function (data) {
        $('#modify-time-modal').modal('hide')
        if (data.code == 200) {
          layer.msg('修改时间成功')
        } else {
          layer.msg(data.msg || '修改时间失败')
        }
      },
    })
  })

  $('#job_list').on('click', '.stopJob', function () {
    var id = $(this).parents('div').attr('_id')
    var row = tableData['key' + id]
    layer.confirm(
      '确认中止该任务?',
      {
        icon: 3,
        title: '系统提示',
        btn: ['确定', '取消'],
      },
      function (index) {
        layer.close(index)

        $.ajax({
          type: 'POST',
          url: base_url + '/dataprepare/stopJob',
          data: {
            jobId: id,
          },
          dataType: 'json',
          success: function (data) {
            if (data.code == 200) {
              layer.msg('中止任务成功')
              jobTable.fnDraw()
            } else {
              layer.msg(data.msg || '中止任务失败')
            }
          },
        })
      }
    )
  })
})
