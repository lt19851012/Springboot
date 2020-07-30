var jobInfo
var jobItemTable
var tableData = {}
$(function () {
  $.ajax({
    type: 'POST',
    url: base_url + '/system/getDictionarySubByCategorySign',
    data: {
      categorySign: 'dic_pro',
    },
    dataType: 'json',
    success: function (data) {
      console.log(data)
      for (var i = 0; i < data.length; i++) {
        $('#productName1').append(
          '<option value="' +
            data[i].categorySubName +
            '" >' +
            data[i].categorySubName +
            '</option>'
        )
      }
    },
  })
  // init date tables
  var openRows = new Set([])
  jobItemTable = $('#jobitem_list').DataTable({
    dom:
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-4'l><'col-sm-4'i><'col-sm-4'p>>",
    deferRender: true,
    processing: false,
    serverSide: true,
    bStateSave: true,
    pagingType: 'full_numbers',

    createdRow: function (row, data, index) {
      //if (data.type !== '') {
      //  $(row).addClass('colored-row')
      //}

      console.log('set1')
      for (var rows of openRows) {
        console.log(rows)
      }
      console.log('set2')
      //alert(openRows)
      console.log(data.id)
      if (openRows.has(data.id)) {
        var tr = jobItemTable.row(row)
        var tdi = $('td', row).eq(0).find('i.fa')
        tr.child(format(data)).show()
        $(row).addClass('shown')
        tdi.first().removeClass('fa-plus-square')
        //tdi.first().removeClass('fa-plus-square')
        tdi.first().addClass('fa-minus-square')
        //openRows.add(row.data().id)
      }
    },

    ajax: {
      url: base_url + '/dataprepare/jobItemPageList',
      type: 'post',
      data: function (d) {
        var obj = {}
        obj.jobId = jobId
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
        className: 'details-control',
        orderable: false,
        data: null,
        defaultContent: '',
        render: function () {
          return '<i class="fa fa-plus-square" aria-hidden="true" style="color:forestgreen"></i>'
        },
        width: '15px',
      },
      {
        data: 'caseIndex',
        bSortable: false,
        visible: true,
        width: '7%',
      },
      {
        data: 'name',
        visible: true,
        width: '25%',
      },

      {
        data: 'startTime',
        visible: true,
        width: '13%',
        render: function (data, type, row) {
          return data
            ? moment(new Date(data)).format('YYYY-MM-DD HH:mm:ss')
            : ''
        },
      },
      {
        data: 'endTime',
        visible: true,
        width: '10%',
        render: function (data, type, row) {
          return data
            ? moment(new Date(data)).format('YYYY-MM-DD HH:mm:ss')
            : ''
        },
      },
      {
        data: 'status',
        width: '10%',
        visible: true,
      },
      {
        data: 'runStatus',
        width: '15%',
        visible: true,
      },

      {
        data: 'id',
        visible: true,
        width: '10%',
        render: function (data, type, row) {
          tableData['key' + row.id] = row
          var html =
            '<div class="btn-group" _id="' +
            row.id +
            '">\n' +
            '   <a href="javascript:void(0);" class="update" >' +
            '修改' +
            '</a>\n' +
            '<a href="javascript:void(0);" class="remove" >' +
            '删除' +
            '</a>\n' +
            '</div>'

          //var logHref = base_url + '/dataprepare/jobItemDetail?jobItemId=' + row.id
          var html =
            '<div class="btn-group" _id="' +
            row.id +
            '">\n' +
            '<a href="javascript:void(0);" class="showParams" >' +
            '查看参数' +
            '</a>\n'
          if (isProjectOwner == 1 && row.endTime && row.status == '失败') {
            html =
              html +
              '<a href="javascript:void(0);" onclick="openFRWin(' +
              row.id +
              ')">分析</a>'
          }
          html = html + '</div>'
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

  function format(d) {
    var statusHtml = '<table class="table  table-no-border"  width="100%">'
    var runResult = d.runResult
    if (runResult) {
      var jsonResult = JSON.parse(runResult)
      if (jsonResult['runTimes'] == 1) {
        var testResult = jsonResult['result'][0]
        var stepResults = testResult['stepResult']
        for (var i = 0; i < stepResults.length; i++) {
          var stepResult = stepResults[i]
          statusHtml =
            statusHtml + '<tr><td width="15%" style="border-top:0px"></td>'

          if (stepResult.status == '成功') {
            statusHtml =
              statusHtml +
              '<td class="step-correct" style="border-top:0px" width="5%"><i class="fa fa-check-circle-o fa-lg" aria-hidden="true"></i></td>'
          } else {
            statusHtml =
              statusHtml +
              '<td class="step-wrong" width="5%" style="border-top:0px" ><i class="fa fa-times-circle-o fa-lg" aria-hidden="true"></i></td>'
          }
          statusHtml =
            statusHtml +
            '<td width="80%" style="border-top:0px">' +
            stepResult.stepName
          if (stepResult.count > 0) {
            statusHtml = statusHtml + '第' + stepResult.count + '重试'
          } else {
            statusHtml = statusHtml + '执行'
          }
          statusHtml =
            statusHtml +
            stepResult.status +
            ' <a   target="_blank" href="' +
            stepResult.logFile +
            '">日志</a>'
          if (stepResult.screenShotHtml) {
            statusHtml =
              statusHtml +
              ' <a   target="_blank" href="' +
              stepResult.screenShotHtml +
              '">截图</a>'
          }
          if (stepResult.mp4File) {
            statusHtml =
              statusHtml +
              ' <a   target="_blank" href="' +
              stepResult.mp4File +
              '">视频</a>'
          }
          statusHtml = statusHtml + '</td></tr>'
        }
      } else {
        var testResults = jsonResult['result']

        for (var j = 0; j < testResults.length; j++) {
          var testResult = testResults[j]
          statusHtml =
            statusHtml +
            '<tr><td width="15%" style="border-top:0px"></td><td width="85%" style="border-top:0px" colspan="2">第' +
            testResult.runTimes +
            '次运行结果</td></tr>'
          var stepResults = testResult['stepResult']
          for (var i = 0; i < stepResults.length; i++) {
            var stepResult = stepResults[i]
            statusHtml =
              statusHtml + '<tr><td width="15%" style="border-top:0px"></td>'

            if (stepResult.status == '成功') {
              statusHtml =
                statusHtml +
                '<td class="step-correct" style="border-top:0px" width="5%"><i class="fa fa-check-circle-o fa-lg" aria-hidden="true"></i></td>'
            } else {
              statusHtml =
                statusHtml +
                '<td class="step-wrong" width="5%" style="border-top:0px" ><i class="fa fa-times-circle-o fa-lg" aria-hidden="true"></i></td>'
            }
            statusHtml =
              statusHtml +
              '<td width="80%" style="border-top:0px">' +
              stepResult.stepName
            if (stepResult.count > 0) {
              statusHtml = statusHtml + '第' + stepResult.count + '次重试'
            } else {
              statusHtml = statusHtml + '执行'
            }
            statusHtml =
              statusHtml +
              stepResult.status +
              ' <a   target="_blank" href="' +
              stepResult.logFile +
              '">日志</a>'
            if (stepResult.screenShotHtml) {
              statusHtml =
                statusHtml +
                ' <a   target="_blank" href="' +
                stepResult.screenShotHtml +
                '">截图</a>'
            }
            if (stepResult.mp4File) {
              statusHtml =
                statusHtml +
                ' <a   target="_blank" href="' +
                stepResult.mp4File +
                '">视频</a>'
            }
            statusHtml = statusHtml + '</td></tr>'
          }
        }
      }
    }
    statusHtml = statusHtml + '</table>'
    console.log('statusHtml' + statusHtml)
    // `d` is the original data object for the row
    return statusHtml
  }

  $('#jobitem_list tbody').on('click', 'td.details-control', function () {
    var tr = $(this).closest('tr')
    var tdi = tr.find('i.fa')
    var row = jobItemTable.row(tr)

    if (row.child.isShown()) {
      // This row is already open - close it
      row.child.hide()
      tr.removeClass('shown')
      tdi.first().removeClass('fa-minus-square')
      tdi.first().addClass('fa-plus-square')
      openRows.delete(row.data().id)
    } else {
      // Open this row
      row.child(format(row.data())).show()
      tr.addClass('shown')
      tdi.first().removeClass('fa-plus-square')
      tdi.first().addClass('fa-minus-square')
      openRows.add(row.data().id)
    }
  })

  var interval = setInterval(startRequest, 10000)

  function startRequest() {
    console.log('jobId1' + jobId)
    $.ajax({
      url: base_url + '/dataprepare/refreshJobDetail',
      type: 'POST',
      async: true,
      data: { jobId: jobId },

      success: function (data) {
        for (var key in data) {
          console.log('data' + data[key])
        }
        jobInfo = data.content
        if (jobInfo.startTime) {
          $('#startTime').text(
            moment(new Date(jobInfo.startTime)).format('YYYY-MM-DD HH:mm:ss')
          )
        }
        if (jobInfo.endTime) {
          $('#endTime').text(
            moment(new Date(jobInfo.endTime)).format('YYYY-MM-DD HH:mm:ss')
          )
        }
        if (jobInfo.startTime && jobInfo.endTime) {
          $('#runTime').text(
            timeDiff(
              moment(new Date(jobInfo.startTime)).format('YYYY-MM-DD HH:mm:ss'),
              moment(new Date(jobInfo.endTime)).format('YYYY-MM-DD HH:mm:ss')
            )
          )
        }
        console.log('sucNumber' + jobInfo.sucNumber)
        console.log('difNumber' + jobInfo.difNumber)
        console.log('difNumber' + jobInfo.sucNumber && jobInfo.difNumber)
        if (jobInfo.sucNumber !== null && jobInfo.difNumber !== null) {
          $('#runStatus').text(
            '成功数:' + jobInfo.sucNumber + ' 失败数:' + jobInfo.difNumber
          )
        }
        if (jobInfo.endTime) {
          $('#stopJob').hide()
          $('#option_win').show()
          if (jobInfo.difNumber && jobInfo.difNumber > 0) {
            $('#retry').show()
          }
          clearInterval(interval)
        }
        $('#status').text(jobInfo.status)
        if (jobInfo.zipFile) {
          $('#screenShot').attr('href', jobInfo.zipFile)
          $('#screenShotLable').show()
          $('#screenShot').show()
        }
      },
    })
    if (jobInfo && jobInfo.startTime) {
      $.ajax({
        url: base_url + '/dataprepare/getLog',
        type: 'post',
        dataType: 'json',
        data: { jobId: jobId },
        success: function (data) {
          var content = data.content
          // var newcontent=content.replace(new RegExp(/<xmp style='white-space: normal;'>预期与实际不一致<\/xmp>/g), "<xmp style='white-space: normal;color:red;'>预期与实际不一致</xmp>");
          if (content != '') {
            $('#message').html(content)
          }
        },
      })
    }

    console.log('1')
    jobItemTable.draw(false)
  }

  $('#stopJob').on('click', function () {
    console.log('stopJob')
    $.ajax({
      url: base_url + '/dataprepare/stopJob',
      type: 'post',
      dataType: 'json',
      data: { jobId: jobId },
      success: function (data) {
        var content = data.content
        // var newcontent=content.replace(new RegExp(/<xmp style='white-space: normal;'>预期与实际不一致<\/xmp>/g), "<xmp style='white-space: normal;color:red;'>预期与实际不一致</xmp>");
        if (data.code == '200') {
          layer.msg('中止任务成功')

          startRequest()
        } else {
          layer.alert(data.msg || '中止任务失败')
        }
      },
    })
  })
})

$('#option_win').on('click', function () {
  $('#option-modal').modal('show')
})

//分析失败原因窗口
function openFRWin(id) {
  $('#failType').html('')
  $("input[name='jobItemId']").val(id)
  //查询失败原因下拉列表
  $.ajax({
    type: 'POST',
    url: base_url + '/system/getDictionarySubByCategorySign',
    data: {
      categorySign: 'dic_fail',
    },
    dataType: 'json',
    success: function (data) {
      console.log(data)
      for (var i = 0; i < data.length; i++) {
        $('#failType').append(
          '<option value="' +
            data[i].categorySubName +
            '" >' +
            data[i].categorySubName +
            '</option>'
        )
      }
    },
  })
  $('#fail-reason-modal').modal('show')
}

function saveFailReason() {
  var jobItemId = $("input[name='jobItemId']").val()
  var failType = $("select[name='failType']").val()
  var failComment = $("textarea[name='failComment']").val()
  //更新jobItem
  $.ajax({
    type: 'POST',
    url: base_url + '/dataprepare/updateJobItem',
    data: {
      jobItemId: jobItemId,
      failType: failType,
      failComment: failComment,
    },
    dataType: 'json',
    success: function (data) {
      $('#fail-reason-modal').modal('hide')
      if (data.code == '200') {
        $('#update-modal').modal('hide')
        layer.msg('修改数据成功')
        jobItemTable.fnDraw()
      } else {
        layer.alert(data.msg || '修改数据失败')
      }
    },
  })

  $('#export').on('click', function () {
    console.log('export')
    var arr = []
    var title = []
    $('input[name="option"]:checked').each(function () {
      arr.push($(this).val())
      if ($(this).val() == 'name') {
        title.push('描述')
      } else if ($(this).val() == 'start_time') {
        title.push('开始时间')
      } else if ($(this).val() == 'end_time') {
        title.push('结束时间')
      } else if ($(this).val() == 'status') {
        title.push('状态')
      } else if ($(this).val() == 'final_result') {
        title.push('数据准备结果')
      } else if ($(this).val() == 'case_index') {
        title.push('序号')
      }
    })

    if (arr.length == 0) {
      layer.msg('请选择导出项')
      return
    }

    var list = []
    console.log('export1')
    for (var i = 0; i < arr.length; i++) {
      list[i] = arr[i]
    }

    var jobId = $('#jobId').val()

    $.ajax({
      url: base_url + '/dataprepare/getDataFromJobItem',
      type: 'POST',
      data: { list: list, jobId: jobId },
      traditional: true,
      success: function (data) {
        console.log('data' + data)
        var excelData = []
        excelData[0] = title
        for (var i = 0; i < data.length; i++) {
          var rowData = []
          for (var j = 0; j < arr.length; j++) {
            if (arr[j] == 'start_time' || arr[j] == 'end_time') {
              if (data[i][arr[j]]) {
                rowData[j] = moment(new Date(data[i][arr[j]])).format(
                  'YYYY-MM-DD HH:mm:ss'
                )
              } else {
                rowData[j] = data[i][arr[j]]
              }
            } else {
              rowData[j] = data[i][arr[j]]
            }
          }
          excelData[i + 1] = rowData
        }

        var aoa = excelData
        console.log('aoa' + aoa)

        var ws = XLSX.utils.aoa_to_sheet(aoa)
        var html_string = XLSX.utils.sheet_to_html(ws, { id: 'data-table' })
        document.getElementById('container').innerHTML = html_string
        var elt = document.getElementById('data-table')
        var wb = XLSX.utils.table_to_book(elt, { sheet: '数据准备结果' })
        XLSX.write(wb, { bookSST: true, type: 'base64' })
        XLSX.writeFile(wb, '任务详情.' + 'xlsx')
        document.getElementById('container').innerHTML = ''
        $('#option-modal').modal('hide')
      },
    })
  })
}

$('#fillInfoBtn').on('click', function () {
  var productName = $('#productName1').val()
  if (!productName || productName == '') {
    layer.msg('请输入产品线名称')
    return
  }
  var tmsId = $('#tmsId1').val()
  if (!tmsId || tmsId == '') {
    layer.msg('请输入TMS ID')
    return
  }

  var jobId = $('#jobId').val()

  $.ajax({
    url: base_url + '/dataprepare/fillInfo',
    type: 'POST',
    data: { productName: productName, tmsId: tmsId, jobId: jobId },
    traditional: true,
    success: function (data) {
      console.log('data' + data)
      if (data.code == '200') {
        $('#fillInfo').modal('hide')
        $('#tmsId').text(tmsId)
        $('#productName').text(productName)
        window.location.href = window.location.href
        layer.msg('更新任务信息成功')
      } else {
        layer.alert(data.msg || '更新任务信息失败')
      }
    },
  })
})

function exportParams() {
  var excelData = []
  var title = []

  $.ajax({
    url: base_url + '/dataprepare/getJobItemList',
    type: 'POST',
    data: { jobId: jobId },
    traditional: true,
    success: function (data) {
      console.log('data' + data)
      var excelData = []
      excelData[0] = title
      for (var i = 0; i < data.length; i++) {
        var rowData = []
        var param = data[i].params
        var jsonObj = JSON.parse(param)
        var j = 0
        for (var key in jsonObj) {
          //alert(title.hasOwnProperty(key));
          if (!title.includes(key)) {
            title.push(key)
          }
          rowData[j] = jsonObj[key]
          j++
        }
        excelData[0] = title
        excelData[i + 1] = rowData
      }

      var aoa = excelData
      console.log('aoa' + aoa)

      var ws = XLSX.utils.aoa_to_sheet(aoa)
      var html_string = XLSX.utils.sheet_to_html(ws, { id: 'data-table' })
      document.getElementById('container').innerHTML = html_string
      var elt = document.getElementById('data-table')
      var wb = XLSX.utils.table_to_book(elt, { sheet: 'params' })
      XLSX.write(wb, { bookSST: true, type: 'base64' })
      XLSX.writeFile(wb, '参数.' + 'xlsx')
      document.getElementById('container').innerHTML = ''
    },
  })
}

$('#jobitem_list').on('click', '.showParams', function () {
  // show
  var id = $(this).parents('div').attr('_id')
  var row = tableData['key' + id]
  var paramJson = JSON.parse(row.params)
  var formItem = ''
  for (var item in paramJson) {
    $('#paramsInfo').html('')
    if (item != 'rowIndex') {
      formItem =
        formItem +
        '<div class="form-group">' +
        '<label for="' +
        item +
        '" class="col-sm-3 control-label">' +
        item +
        '</label>' +
        '<div class="col-sm-8">' +
        '<input disabled name="' +
        item +
        '" value="' +
        paramJson[item] +
        '" type="text" class="form-control"/>' +
        '</div>' +
        '</div>'
    }
  }
  $('#paramsInfo').append(formItem)
  $('#params-modal').modal('show')
})
