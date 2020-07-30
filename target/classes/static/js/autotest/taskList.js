var tableData = {}
var runHistoryData = {}
var taskId
var memberData = null
var projectIdCur
var testCaseTable
$(function () {
  // init date tables
  var role = sessionStorage.getItem('role')
  var user = sessionStorage.getItem('user')
  var userId = sessionStorage.getItem('userId')

  var taskTable = $('#task_list').dataTable({
    dom:
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-4'l><'col-sm-4'i><'col-sm-4'p>>",
    deferRender: true,
    processing: false,
    serverSide: true,
    pagingType: 'full_numbers',
    ajax: {
      url: base_url + '/autotest/taskPageList',
      type: 'post',
      data: function (d) {
        var obj = {}
        obj.searchInfo = $('#searchInfo').val()
        obj.start = d.start
        obj.length = d.length
        obj.role = role
        obj.userId = userId
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
        data: 'lastRunTime',
        visible: true,
        width: '15%',
        render: function (data, type, row) {
          return data
            ? moment(new Date(data)).format('YYYY-MM-DD HH:mm:ss')
            : ''
        },
      },

      {
        data: 'id',
        visible: true,
        width: '30%',
        render: function (data, type, row) {
          tableData['key' + row.id] = row
          var logHref = base_url + '/dataprepare/jobDetail?jobId=' + row.id
          var html =
            '<div class="btn-group" _id="' +
            row.id +
            '">\n' +
            '<a href="javascript:void(0);" class="run" >' +
            '提交任务' +
            '</a>\n' +
            '<a class="history" href="' +
            base_url +
            '/autotest/runHistoryList?taskId=' +
            row.id +
            '"  >' +
            '任务列表' +
            '</a>\n' +
            '   <a href="javascript:void(0);" class="testcase" >' +
            '用例详情' +
            '</a>\n' +
            '</div>'

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
    taskTable.fnDraw()
  })

  $('#addTask').on('click', function () {
    // init-cronGen
    $('#add-modal').modal('show')
  })

  $('#task_list').on('click', '.update', function () {
    // show
    var id = $(this).parents('div').attr('_id')
    var row = tableData['key' + id]
    $("#update-modal .form input[name='id']").val(row.id)
    $("#update-modal .form input[name='name']").val(row.name)
    $("#update-modal .form input[name='description']").val(row.description)
    $('#update-modal').modal('show')
  })

  var addModalValidate = $('#add-modal .form').validate({
    errorElement: 'span',
    errorClass: 'help-block',
    focusInvalid: true,
    rules: {
      name: {
        required: true,
        maxlength: 50,
      },
      gitposition: {
        required: true,
      },
    },
    messages: {
      name: {
        required: '请输入任务名称',
        maxlength: '长度不能大于50',
      },
    },
    onfocusout: function (element) {
      $(element).valid()
    },
    onkeyup: function (element) {
      $(element).valid()
    },
    highlight: function (element) {
      $(element).closest('.form-group').addClass('has-error')
    },
    success: function (label) {
      label.closest('.form-group').removeClass('has-error')
      label.remove()
    },
    errorPlacement: function (error, element) {
      element.parent('div').append(error)
    },
    submitHandler: function (form) {
      $.post(
        base_url + '/autotest/addTask',
        $('#add-modal .form').serialize(),
        function (data, status) {
          if (data.code == '200') {
            $('#add-modal').modal('hide')
            layer.msg('创建任务成功')
            taskTable.fnDraw()
            //bootbox.alert('创建项目成功', function () {
            //  projectTable.fnDraw()
            //})
          } else {
            layer.msg(data.msg || '创建任务失败')
          }
        }
      )
    },
  })

  var updateModalValidate = $('#update-modal .form').validate({
    errorElement: 'span',
    errorClass: 'help-block',
    focusInvalid: true,

    rules: {
      name: {
        required: true,
        maxlength: 50,
      },
    },
    messages: {
      name: {
        required: '请输入项目名称',
        maxlength: '长度不能大于50',
      },
    },
    onfocusout: function (element) {
      $(element).valid()
    },
    onkeyup: function (element) {
      $(element).valid()
    },
    highlight: function (element) {
      $(element).closest('.form-group').addClass('has-error')
    },
    success: function (label) {
      label.closest('.form-group').removeClass('has-error')
      label.remove()
    },
    errorPlacement: function (error, element) {
      element.parent('div').append(error)
    },
    submitHandler: function (form) {
      // post
      if (role == 0 || role == 1) {
        $.post(
          base_url + '/autotest/updateTask',
          $('#update-modal .form').serialize(),
          function (data, status) {
            if (data.code == '200') {
              $('#update-modal').modal('hide')
              layer.msg('修改任务成功')
              taskTable.fnDraw()
            } else {
              layer.msg(data.msg || '修改任务失败')
            }
          }
        )
      }
    },
  })
  $('#update-modal').on('hide.bs.modmal', function () {
    updateModalValidate.resetForm()
    $('#updateModal .form')[0].reset()
    $('#updateModal .form .form-group').removeClass('has-error')
  })

  $('#add-modal').on('hide.bs.modal', function () {
    addModalValidate.resetForm()
    $('#add-modal .form')[0].reset()
    $('#add-modal .form .form-group').removeClass('has-error')
  })

  $('#task_list').on('click', '.remove', function () {
    console.log(9)
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
        if (role == 0 || role == 1) {
          $.ajax({
            type: 'POST',
            url: base_url + '/autotest/deleteTask',
            data: {
              id: id,
            },
            dataType: 'json',
            success: function (data) {
              if (data.code == 200) {
                layer.msg('删除任务成功')
                taskTable.fnDraw()
              } else {
                layer.msg(data.msg || '删除任务失败')
              }
            },
          })
        }
      }
    )
  })

  $('#task_list').on('click', '.testcase', function () {
    //显示模板列表页面
    taskId = $(this).parents('div').attr('_id')
    getTestCaseList()
    $('#mainArea').hide()
    $('#shuttingArea').show()
  })

  testCaseTable = $('#test_case_table').DataTable({
    dom: "<'row'<'col-sm-12'tr>>",
    deferRender: true,
    processing: false,
    serverSide: true,
    paging: false,

    ajax: {
      url: base_url + '/autotest/testCasePageList',
      type: 'post',
      data: function (d) {
        var obj = {}
        obj.taskId = taskId
        console.log('testCaseTable')
        return obj
      },
    },
    searching: false,
    ordering: false,
    //"scrollX": true,	// scroll x，close self-adaption
    columns: [
      {
        data: 'testName',
        visible: true,
        width: '20%',
        render: function (data, type, row) {
          var html = '<input name="show" id="se' + row.id + '"type="checkbox">'

          return html
        },
      },
      {
        data: 'testName',
        visible: true,
        width: '80%',
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

  $('#task_list').on('click', '.run', function () {
    taskId = $(this).parents('div').attr('_id')
    console.log('taskId' + taskId)
    $('#createJobForm')[0].reset()
    testCaseTable.ajax.reload()
    $('#mainArea').hide()
    $('#runArea').show()
  })

  $('#task_list').on('click', '.history', function () {
    taskId = $(this).parents('div').attr('_id')
    console.log('taskId' + taskId)
    $('#mainArea').hide()
    runHistoryTable.draw()
    $('#historyArea').show()
  })

  $('#reback').click(function () {
    $('#mainArea').show()
    $('#shuttingArea').hide()
  })

  $('#rebackMain').click(function () {
    $('#mainArea').show()
    $('#runArea').hide()
  })

  $('#historyToMain').click(function () {
    $('#mainArea').show()
    $('#historyArea').hide()
  })

  // $('#testCaseManage').on('click', function () {
  //   // show

  //   $('#test-case-modal').modal('show')
  //   projectIdCur = $('#projectId').children('option:selected').val()
  //   testCaseIds = []
  //   taskIds = []

  //   //获取已有成员数据
  //   loadMember()

  //   // loadUser()
  // })

  // $('#projectId').on('change', function () {
  //   projectIdCur = $(this).children('option:selected').val()
  //   loadInfo()
  // })

  // function loadInfo() {
  //   $('#test_case_all_list').empty()
  //   if (testCaseArray.length > 0) {
  //     console.log('testCaseArray' + testCaseArray.length)
  //     console.log('memberData' + memberData.length)
  //     for (var i = 0; i < testCaseArray.length; i++) {
  //       console.log(testCaseArray[i].projectId + '' + projectIdCur)
  //       if (testCaseArray[i].projectId == projectIdCur) {
  //         add = true
  //         if (memberData != null && memberData.length > 0) {
  //           for (var j = 0; j < memberData.length; j++) {
  //             if (testCaseArray[i].id == memberData[j].testCaseId) {
  //               add = false
  //             }
  //           }
  //         }
  //         console.log('add' + add)
  //         if (add == true) {
  //           var rows =
  //             "<div id='" +
  //             testCaseArray[i].id +
  //             "' onclick='addMember(" +
  //             testCaseArray[i].id +
  //             ")' style='display: flex;width: 100%'><span style='width: 100%;padding:5px;border-bottom:1px solid #d2d6de;color:black'>" +
  //             testCaseArray[i].testName +
  //             '</span></div>'
  //           $('#test_case_all_list').append(rows)
  //         }
  //       }
  //     }
  //   } else {
  //     $('#test_case_all_list').append('暂无数据')
  //   }

  //   $('#test_case_list').empty()
  //   if (memberData != null && memberData.length > 0) {
  //     console.log('memberData' + memberData.length)
  //     for (var i = 0; i < memberData.length; i++) {
  //       if (memberData[i].projectId == projectIdCur) {
  //         var rows =
  //           "<a id='" +
  //           memberData[i].id +
  //           "' onclick='removeMember(" +
  //           memberData[i].id +
  //           ")' style='display: flex;width: 100%'><span style='width: 100%;padding:5px;border-bottom:1px solid #d2d6de;color:black'>" +
  //           memberData[i].name +
  //           '</span>'
  //         $('#test_case_list').append(rows)
  //       }
  //     }
  //   } else {
  //     $('#test_case_list').append('暂无数据')
  //   }
  // }

  // function loadMember() {
  //   console.log('taskId' + taskId)
  //   $.ajax({
  //     type: 'POST',
  //     url: base_url + '/autotest/testCaseList',
  //     data: JSON.stringify({
  //       taskId: taskId,
  //     }),
  //     contentType: 'application/json',
  //     dataType: 'JSON',
  //     success: function (data) {
  //       $('#test_case_list').empty()
  //       memberData = data
  //       loadInfo()
  //       // console.log('loadMember' + data.length)
  //       // if (data.length > 0) {
  //       //   for (var i = 0; i < data.length; i++) {
  //       //     if (memberData[i].projectId == projectIdCur) {
  //       //       var rows =
  //       //         "<a id='" +
  //       //         data[i].id +
  //       //         "' onclick='removeMember(" +
  //       //         data[i].id +
  //       //         ")' style='display: flex;width: 100%'><span style='width: 100%;padding:5px;border-bottom:1px solid #d2d6de;color:black'>" +
  //       //         data[i].name +
  //       //         '</span>'
  //       //       $('#test_case_list').append(rows)
  //       //     }
  //       //   }
  //       // } else {
  //       //   $('#test_case_list').append('暂无数据')
  //       // }

  //       //获取成员列表数据
  //     },
  //   })
  // }

  $('#submitTask').on('click', function () {
    $('#createJobForm').submit()
  })

  $('#type').on('change', function () {
    var typeCur = $(this).children('option:selected').val()
    console.log('typeCur' + typeCur)
    if (typeCur == 0) {
      $('#cronTimeDiv').hide()
      $('#cronTimeLabel').hide()
      $('#cron').rules('remove', 'required')
    } else {
      $('#cronTimeDiv').show()
      $('#cronTimeLabel').show()
      $('#cron').rules('add', {
        required: true,
        messages: { required: '请输入执行时间' },
      })
    }
  })

  var createJobValidate = $('#createJobForm').validate({
    errorElement: 'span',
    errorClass: 'help-block',
    focusInvalid: true,

    rules: {
      name: {
        required: true,
        maxlength: 50,
      },
      timeout: {
        number: true,
      },
    },
    messages: {
      name: {
        required: '请输入任务名称',
      },
      timeout: {
        number: '超时时间必须为数字',
      },
    },
    onfocusout: function (element) {
      $(element).valid()
    },
    onkeyup: function (element) {
      $(element).valid()
    },
    highlight: function (element) {
      $(element).closest('div').addClass('has-error')
    },
    success: function (label) {
      label.closest('div').removeClass('has-error')
      label.remove()
    },
    errorPlacement: function (error, element) {
      element.parent('div').append(error)
    },
    submitHandler: function (form) {
      var name = $("#createJobForm input[name='name']").val()
      var timeout = $("#createJobForm input[name='timeout']").val()
      var type = $("#createJobForm select[name='type']")
        .children('option:selected')
        .val()
      console.log('type' + type)
      var cron = $("#createJobForm input[name='cron']").val()
      var rows = testCaseTable.rows()
      var testCaseIds = new Array()
      for (var i = 0; i < rows.length; i++) {
        var param = rows.row(i).data()
        var id = param['id']
        var checkId = 'se' + id
        if ($('#' + checkId).is(':checked')) {
          testCaseIds.push(id)
        }
      }
      if (testCaseIds.length == 0) {
        layer.alert('请选择用例')
        return
      }
      $('#loadingModal').modal({ backdrop: 'static', keyboard: false })
      $.ajax({
        url: base_url + '/autotest/submitTask',
        type: 'POST',
        data: {
          testCaseIds: testCaseIds.toString(),
          name: name,
          taskId: taskId,
          type: type,
          cron: cron,
          timeout: timeout,
        },
        dataType: 'json',
        traditional: true,
        success: function (data) {
          $('#loadingModal').modal('hide')
          if (data.code == 200) {
            layer.msg('提交任务成功')
            window.location.href =
              base_url + '/autotest/runHistoryList?taskId=' + taskId
          } else {
            layer.alert(data.msg || '提交任务失败')
          }
        },
      })
    },
  })

  /*新增*/
  // $('#test_case_add').on('click', function () {
  //   console.log('test_case_add' + testCaseIds)
  //   if (testCaseIds.length <= 0) {
  //     layer.alert('请选择要添加的用例')
  //     return
  //   }

  //   taskIds.push(taskId)
  //   $.ajax({
  //     type: 'POST',
  //     url: base_url + '/autotest/addTestCase',
  //     data: JSON.stringify({
  //       taskIds: taskIds,
  //       testCaseIds: testCaseIds,
  //     }),
  //     dataType: 'json',
  //     contentType: 'application/json',
  //     success: function (data) {
  //       if (data.code == 200) {
  //         memberData = data.content
  //         console.log('data.content' + data.content)
  //         loadInfo()
  //         getTestCaseList()
  //         testCaseIds = []
  //         taskIds = []
  //         removeIds = []
  //       } else {
  //         layer.alert('新增用例失败')
  //       }
  //     },
  //   })
  // })

  /*移除*/
  // $('#test_case_remove').on('click', function () {
  //   if (removeIds.length <= 0) {
  //     layer.alert('请选择要移除的用例')
  //     return
  //   }
  //   taskIds.push(taskId)
  //   $.ajax({
  //     type: 'POST',
  //     url: base_url + '/autotest/deleteTestCase',
  //     data: JSON.stringify({
  //       taskIds: taskIds,
  //       removeIds: removeIds,
  //     }),
  //     dataType: 'json',
  //     contentType: 'application/json',
  //     success: function (data) {
  //       if (data.code == 200) {
  //         memberData = data.content
  //         loadInfo()
  //         getTestCaseList()
  //         testCaseIds = []
  //         taskIds = []
  //         removeIds = []
  //       } else {
  //         layer.alert('移除用例失败')
  //       }
  //     },
  //   })
  // })

  // $('#projectId').on('change', function () {
  //   var projectIdCur = $(this).children('option:selected').val()
  //   $(this).val($(this).children('option:selected').val())

  //   $('#testCaseId').html('')
  //   var testCaseExisted = false
  //   $.each(testCaseArray, function (n, value) {
  //     if (value.projectId == projectIdCur) {
  //       testCaseExisted = true
  //       $('#testCaseId').append(
  //         '<option value="' + value.id + '" >' + value.testName + '</option>'
  //       )
  //     }
  //   })

  //   if (testCaseExisted) {
  //     $('#chooseTestCase').removeAttr('disabled')
  //   } else {
  //     $('#chooseTestCase').attr('disabled', 'disabled')
  //   }
  // })

  // $('#chooseTestCase').on('click', function () {
  //   // init-cronGen
  //   window.location.href =
  //     base_url +
  //     '/dataprepare/createJob?projectId=' +
  //     $('#projectId').children('option:selected').val() +
  //     '&testCaseId=' +
  //     $('#testCaseId').children('option:selected').val()
  // })

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
              taskTable.fnDraw()
            } else {
              layer.msg(data.msg || '删除数据失败')
            }
          },
        })
      }
    )
  })
})

// function addMember(id) {
//   var addClass = 0 //添加样式
//   var idspan = '#' + id
//   idspan = idspan + ' span'
//   if (testCaseIds.length > 0) {
//     for (var i = 0; i < testCaseIds.length; i++) {
//       if (testCaseIds[i] == id) {
//         addClass = 1 //移除样式
//       }
//     }

//     if (addClass == 0) {
//       $(idspan).css('background-color', '#3c8dbc')
//       $(idspan).css('color', 'white')
//       testCaseIds.push(id)
//     } else if (addClass == 1) {
//       $(idspan).css('background-color', 'white')
//       $(idspan).css('color', 'black')
//       testCaseIds.splice(testCaseIds.indexOf(id), 1)
//     }
//   } else {
//     $(idspan).css('background-color', '#3c8dbc')
//     $(idspan).css('color', 'white')
//     testCaseIds.push(id)
//   }
// }

// var removeIds = []
// function removeMember(id) {
//   var removeClass = 0 //添加样式
//   var idspan = '#' + id
//   idspan = idspan + ' span'
//   if (removeIds.length > 0) {
//     for (var i = 0; i < removeIds.length; i++) {
//       if (removeIds[i] == id) {
//         removeClass = 1 //移除样式
//       }
//     }

//     if (removeClass == 0) {
//       $(idspan).css('background-color', '#3c8dbc')
//       $(idspan).css('color', 'white')
//       removeIds.push(id)
//     } else if (removeClass == 1) {
//       $(idspan).css('background-color', 'white')
//       $(idspan).css('color', 'black')
//       removeIds.splice(removeIds.indexOf(id), 1)
//     }
//   } else {
//     $('#' + id).css('background-color', '#3c8dbc')
//     $(idspan).css('color', 'white')
//     removeIds.push(id)
//   }
// }

// $('#test').click(function () {
//   //Find the box parent
//   console.log('collapse')
//   var box = $(this).parents('.box').first()
//   //Find the body and the footer
//   var bf = box.find('.box-body, .box-footer')
//   if (!box.hasClass('collapsed-box')) {
//     box.addClass('collapsed-box')
//     bf.slideUp()
//   } else {
//     box.removeClass('collapsed-box')
//     bf.slideDown()
//   }
// })

// function collapse(element) {
//   // init-cronGen
//   console.log('collapse')
//   var box = $(element).parents('.box').first()
//   //Find the body and the footer
//   var bf = box.find('.box-body, .box-footer')
//   if (!box.hasClass('collapsed-box')) {
//     box.addClass('collapsed-box')
//     bf.slideUp()
//   } else {
//     box.removeClass('collapsed-box')
//     bf.slideDown()
//   }
// }

function showInfo(testCaseId) {
  console.log('testCaseId' + testCaseId)
  $('#testCaseDetail').html('')

  $.ajax({
    type: 'POST',
    url: base_url + '/autotest/getTestCaseDetail',
    data: {
      testCaseId: testCaseId,
    },
    dataType: 'JSON',
    success: function (data) {
      if (data.code == 200) {
        memberData = data.content
        var html =
          '<table class="table table-bordered table-striped" width="100%"><th>序号</th><th>案例描述</th>'
        var caseInfos = JSON.parse(data.content)
        for (var i = 0; i < caseInfos.length; i++) {
          html =
            html +
            '<tr><td>' +
            (i + 1) +
            '</td><td>' +
            caseInfos[i] +
            '</td></tr>'
        }
        html = html + '</table>'
        $('#testCaseDetail').append(html)
      }
    },
  })
}

function getTestCaseList() {
  $.ajax({
    type: 'POST',
    url: base_url + '/autotest/testCaseList',
    data: {
      taskId: taskId,
    },
    dataType: 'json',
    success: function (data) {
      $('#test_case_info').empty()
      memberData = data
      if (data.length > 0) {
        var html = ''

        html = html + '<div class="box box-solid">'

        html = html + '  <div class="box-body no-padding">'
        html = html + '    <ul class="nav nav-pills nav-stacked">'
        for (var i = 0; i < data.length; i++) {
          html =
            html +
            '    <li><a href="#" onclick="showInfo(' +
            data[i].id +
            ')">' +
            data[i].testName +
            '</a></li>'
        }
        html = html + '  </ul>  </div>'
        html = html + '  </div>'

        $('#test_case_info').append(html)
      }
    },
  })
}
