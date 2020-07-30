let testcasetemplateTable
let editor
let testCaseId
$(function () {
  var role = sessionStorage.getItem('role')
  var user = sessionStorage.getItem('user')
  var userId = sessionStorage.getItem('userId')
  console.log('role' + role)
  console.log('user' + user)

  // init date tables
  var testCaseTable = $('#testcase_list').dataTable({
    dom:
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-4'l><'col-sm-4'i><'col-sm-4'p>>",
    deferRender: true,
    processing: false,
    serverSide: true,
    pagingType: 'full_numbers',
    ajax: {
      url: base_url + '/project/testCasePageList',
      type: 'post',
      data: function (d) {
        var obj = {}
        obj.searchInfo = $('#searchInfo').val()
        obj.user = user
        obj.role = role
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
        data: 'testName',
        visible: true,
        width: '25%',
      },
      {
        data: 'projectName',
        visible: true,
        width: '15%',
      },
      {
        data: 'status',
        visible: true,
        width: '10%',
      },
      {
        data: 'modifyUser',
        visible: true,
        width: '10%',
      },
      {
        data: 'modifyTime',
        width: '15%',
        visible: true,
        render: function (data, type, row) {
          return data
            ? moment(new Date(data)).format('YYYY-MM-DD HH:mm:ss')
            : ''
        },
      },
      {
        data: 'id',
        visible: true,
        width: '23%',
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
            '</a>\n'

          //if(row.purpose == "数据准备") {
          if (row.purpose == '数据准备') {
            html +=
              '<a href="javascript:void(0);" class="openShutteringArea" >' +
              '参数项管理' +
              '</a>\n' +
              '</div>'
            return html
          } else {
            html +=
              '<a href="javascript:void(0);" class="openTestDatas" >' +
              '参数项管理' +
              '</a>\n' +
              '</div>'
            return html
          }

          /*}else if(row.purpose == "回归测试") {
              html +=
                  '<a href="javascript:void(0);" class="openTestDatas" >' +
                  '测试数据' +
                  '</a>\n' +
                  '</div>'
              return html
            }
            /*}else if(row.purpose == "回归测试") {
                html +=
                    '<a href="javascript:void(0);" class="openTestDatas" >' +
                    '测试数据' +
                    '</a>\n' +
                    '</div>'
                return html
            }*/
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

  var tableData = {}

  $('#searchBtn').on('click', function (e) {
    e.preventDefault()
    testCaseTable.fnDraw()
  })

  $('#clear').on('click', function () {
    $('#searchForm')[0].reset()
  })

  $('#addTestCase').on('click', function () {
    // init-cronGen
    var executorHandler = $('#add-modal .form').find("select[name='status']")
    var projectId = $('#add-modal .form').find("select[name='projectId']").val()
    console.log('init' + projectId)
    for (let i = 0; i < projectArray.length; i++) {
      if (projectArray[i].id == projectId) {
        if ('私有' == projectArray[i].status) {
          console.log('private')
          executorHandler.val('私有')
          executorHandler.attr('disabled', true)
        }
      }
    }

    $('#add-modal').modal('show')
  })

  var addModalValidate = $('#add-modal .form').validate({
    errorElement: 'span',
    errorClass: 'help-block',
    focusInvalid: true,
    rules: {
      testName: {
        required: true,
        maxlength: 50,
      },
      testClass: {
        required: true,
        maxlength: 255,
      },
    },
    messages: {
      testName: {
        required: '请输入用例名称',
      },
      testClass: {
        required: '请输入用例类名',
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
      var executorHandler = $('#add-modal .form').find("select[name='status']")
      executorHandler.removeAttr('disabled')
      $.post(
        base_url + '/project/addTestCase',
        $('#add-modal .form').serialize(),
        function (data, status) {
          if (data.code == '200') {
            $('#add-modal').modal('hide')
            layer.open({
              title: '系统提示',
              btn: ['确定'],
              content: '创建用例成功',
              icon: '1',
              end: function (layero, index) {
                //$(window).unbind('beforeunload');
                testCaseTable.fnDraw()
              },
            })
          } else {
            layer.alert(data.msg || '创建用例失败')
          }
        }
      )
    },
  })

  $('#add-modal').on('hide.bs.modal', function () {
    addModalValidate.resetForm()
    $('#add-modal .form')[0].reset()
    $('#add-modal .form .form-group').removeClass('has-error')
  })

  // update
  $('#testcase_list').on('click', '.update', function () {
    // show
    var id = $(this).parents('div').attr('_id')
    var row = tableData['key' + id]
    $("#update-modal .form input[name='id']").val(row.id)
    $("#update-modal .form input[name='testName']").val(row.testName)
    $("#update-modal .form textarea[name='description']").val(row.description)
    $("#update-modal .form select[name='projectId']").val(row.projectId)
    $("#update-modal .form select[name='status']").val(row.status)
    $("#update-modal .form input[name='testClass']").val(row.testClass)
    $("#update-modal .form input[name='createUser']").val(row.createUser)
    $("#update-modal .form input[name='createTime']").val(row.createTime)
    $("#update-modal .form input[name='deleted']").val(row.deleted)
    $("#update-modal .form input[name='templateExisted']").val(
      row.templateExisted
    )

    var executorHandler = $('#update-modal .form').find("select[name='status']")
    var projectId = row.projectId
    for (let i = 0; i < projectArray.length; i++) {
      if (projectArray[i].id == projectId) {
        if ('私有' == projectArray[i].status) {
          console.log('private')
          executorHandler.val('私有')
          executorHandler.attr('disabled', 'disabled')
        }
      }
    }
    $('#update-modal').modal('show')
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
      testClass: {
        required: true,
        maxlength: 255,
      },
    },
    messages: {
      name: {
        required: '请输入用例名称',
      },
      testClass: {
        required: '请输入用例类',
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
      var executorHandler = $('#update-modal .form').find(
        "select[name='status']"
      )
      executorHandler.removeAttr('disabled')
      $.post(
        base_url + '/project/updateTestCase',
        $('#update-modal .form').serialize(),
        function (data, status) {
          if (data.code == '200') {
            $('#update-modal').modal('hide')
            layer.msg('修改用例成功')
            testCaseTable.fnDraw()
          } else {
            layer.msg(data.msg || '修改用例失败')
          }
        }
      )
    },
  })
  $('#update-modal').on('hide.bs.modmal', function () {
    updateModalValidate.resetForm()
    $('#updateModal .form')[0].reset()
    $('#updateModal .form .form-group').removeClass('has-error')
  })

  $('#testcase_list').on('click', '.remove', function () {
    var id = $(this).parents('div').attr('_id')

    layer.confirm(
      '确认删除此用例?',
      {
        icon: 3,
        title: '系统提示',
        btn: ['确定', '取消'],
      },
      function (index) {
        layer.close(index)

        $.ajax({
          type: 'POST',
          url: base_url + '/project/deleteTestCase',
          data: {
            id: id,
          },
          dataType: 'json',
          success: function (data) {
            if (data.code == 200) {
              layer.msg('删除用例成功')
              testCaseTable.fnDraw()
            } else {
              layer.msg(data.msg || '删除用例失败')
            }
          },
        })
      }
    )
  })

  $('.project-id').change(function () {
    // executorHandler
    var executorHandler = $(this).parents('form').find("select[name='status']")
    var projectId = $(this).val()

    for (let i = 0; i < projectArray.length; i++) {
      if (projectArray[i].id == projectId) {
        if ('私有' == projectArray[i].status) {
          console.log('private')
          executorHandler.val('私有')
          executorHandler.attr('disabled', 'disabled')
          return
        }
      }
    }
    executorHandler.removeAttr('disabled')
  })

  /************************模板模块开始************************/

  /**
   * 打开模板列表界面
   */
  $('#testcase_list').on('click', '.openShutteringArea', function () {
    //显示模板列表页面
    $('#mainArea').css('display', 'none')
    $('#testDatasArea').css('display', 'none')
    $('#shuttingArea').css('display', 'block')
    //设置testcase的值
    testCaseId = $(this).parents('div').attr('_id')
    $("input[name='testCaseId']").val(testCaseId)
    $("input[name='mainId']").val('')
    $("input[name='mainId']").val(testCaseId)

    testcasetemplateTable = $('#testcasetemplate_list').DataTable({
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
        url: base_url + '/project/testCaseTemplatePageList',
        type: 'post',
        data: function (d) {
          var obj = {}
          obj.testCaseId = testCaseId
          //obj.start = d.start
          //obj.length = d.length
          return obj
        },
      },
      searching: false,
      ordering: false,
      columns: [
        {
          data: 'itemIndex',
          bSortable: false,
          visible: true,
          width: '7%',
        },
        {
          data: 'name',
          visible: true,
          width: '10%',
        },
        {
          data: 'id',
          visible: true,
          width: '10%',
          render: function (data, type, row) {
            tempTableData['key' + row.id] = row
            var html =
              '<div class="btn-group" _id1="' +
              row.id +
              '">\n' +
              '   <a href="javascript:void(0);" class="update" >' +
              '修改' +
              '</a>\n' +
              '<a href="javascript:void(0);" class="remove" >' +
              '删除' +
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
    testcasetemplateTable.on('row-reorder', function (e, diff, edit) {
      $('#reorder').removeAttr('disabled')
    })
  })

  $('#reorder').click(function () {
    var itemArray = new Array()
    testcasetemplateTable.data().each(function (d) {
      var itemObject = new Object()
      itemObject.id = d.id
      itemObject.itemIndex = d.itemIndex
      itemArray.push(itemObject)
    })
    var reorderData = {}
    reorderData.reorderInfo = JSON.stringify(itemArray)
    reorderData.testCaseId = testCaseId

    console.log('testCaseId' + testCaseId)
    $.ajax({
      type: 'POST',
      url: base_url + '/project/reorderTestCaseTemplate',
      data: reorderData,
      dataType: 'json',
      success: function (data) {
        if (data.code == 200) {
          layer.msg('输入项重新排序成功')
          testcasetemplateTable.ajax.reload()
        } else {
          layer.msg(data.msg || '输入项重新排序失败')
        }
      },
    })
  })

  $('#testcase_list').on('click', '.openShutteringArea', function () {
    //显示模板列表页面
    $('#mainArea').css('display', 'none')
    $('#testDatasArea').css('display', 'none')
    $('#shuttingArea').css('display', 'block')
    //设置testcase的值
    testCaseId = $(this).parents('div').attr('_id')
    $("input[name='testCaseId']").val(testCaseId)
    $("input[name='mainId']").val('')
    $("input[name='mainId']").val(testCaseId)

    testcasetemplateTable = $('#testcasetemplate_list').DataTable({
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
        url: base_url + '/project/testCaseTemplatePageList',
        type: 'post',
        data: function (d) {
          var obj = {}
          obj.testCaseId = testCaseId
          //obj.start = d.start
          //obj.length = d.length
          return obj
        },
      },
      searching: false,
      ordering: false,
      columns: [
        {
          data: 'itemIndex',
          bSortable: false,
          visible: true,
          width: '7%',
        },
        {
          data: 'name',
          visible: true,
          width: '10%',
        },
        {
          data: 'id',
          visible: true,
          width: '10%',
          render: function (data, type, row) {
            tempTableData['key' + row.id] = row
            var html =
              '<div class="btn-group" _id1="' +
              row.id +
              '">\n' +
              '   <a href="javascript:void(0);" class="update" >' +
              '修改' +
              '</a>\n' +
              '<a href="javascript:void(0);" class="remove" >' +
              '删除' +
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
    testcasetemplateTable.on('row-reorder', function (e, diff, edit) {
      $('#reorder').removeAttr('disabled')
    })
  })

  $('#reorder').click(function () {
    var itemArray = new Array()
    testcasetemplateTable.data().each(function (d) {
      var itemObject = new Object()
      itemObject.id = d.id
      itemObject.itemIndex = d.itemIndex
      itemArray.push(itemObject)
    })
    var reorderData = {}
    reorderData.reorderInfo = JSON.stringify(itemArray)
    reorderData.testCaseId = testCaseId

    console.log('testCaseId' + testCaseId)
    $.ajax({
      type: 'POST',
      url: base_url + '/project/reorderTestCaseTemplate',
      data: reorderData,
      dataType: 'json',
      success: function (data) {
        if (data.code == 200) {
          layer.msg('输入项重新排序成功')
          testcasetemplateTable.ajax.reload()
        } else {
          layer.msg(data.msg || '输入项重新排序失败')
        }
      },
    })
  })

  /**
   * 返回
   */
  $('#reback').click(function () {
    testCaseTable.fnDraw()
  })

  /**
   * 返回
   */
  $('#backToMain').click(function () {
    console.log('back')
    $('#mainArea').css('display', 'block')
    $('#testDatasArea').css('display', 'none')
    $('#shuttingArea').css('display', 'none')
    testCaseTable.fnDraw()
  })

  /**
   * 打开模板列表界面
   */
  $('#addShutting').click(function () {
    $("#shuttering-modal .form input[name='selectOptions']").val('')

    $('#sign').hide()
    $('#shuttering-modal').modal('show')
  })

  /**
   * 类型选中下拉列表时出现类型标识选项
   */
  $('#inputType').bind('change', function () {
    var val = $(this).val()
    if (val == 1) {
      $('#sign').show()
    } else {
      $('#sign').hide()
    }
  })

  //保存模板数据

  var shuttingModalValidate = $('#shuttering-modal .form').validate({
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
        required: '请输入输入项名称',
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
        base_url + '/project/addTestCaseTemplate',
        $('#shuttering-modal .form').serialize(),
        function (data, status) {
          if (data.code == '200') {
            $('#shuttering-modal').modal('hide')
            layer.msg('创建模板成功')
            testcasetemplateTable.ajax.reload()
          } else {
            layer.msg(data.msg || '创建模板失败')
          }
        }
      )
    },
  })

  $('#shuttering-modal').on('hide.bs.modal', function () {
    shuttingModalValidate.resetForm()
    $('#shuttering-modal .form')[0].reset()
    $('#shuttering-modal .form .form-group').removeClass('has-error')
  })

  var tempTableData = {}
  // update
  $('#testcasetemplate_list').on('click', '.update', function () {
    $('#updateOptions').empty()
    $("#shuttering-update-modal .form input[name='selectOptions']").val(null)

    // show
    var id = $(this).parents('div').attr('_id1')
    var row = tempTableData['key' + id]
    console.log('defaultValue' + row.defaultValue)
    console.log('tip' + row.tip)
    $("#shuttering-update-modal .form input[name='id']").val(row.id)
    $("#shuttering-update-modal .form input[name='itemIndex']").val(
      row.itemIndex
    )
    $("#shuttering-update-modal .form input[name='name']").val(row.name)

    $("#shuttering-update-modal .form input[name='testCaseId']").val(
      row.testCaseId
    )

    $('#shuttering-update-modal').modal('show')
  })

  var updateShuttingModalValidate = $(
    '#shuttering-update-modal .form'
  ).validate({
    errorElement: 'span',
    errorClass: 'help-block',
    focusInvalid: true,
    rules: {
      name: {
        required: true,
        maxlength: 50,
      },
      tip: {
        maxlength: 240,
      },
      placeHolder: {
        maxlength: 50,
      },
      defaultValue: {
        maxlength: 50,
      },
    },
    messages: {
      name: {
        required: '请输入输入项名称',
        maxlength: '长度不能超过50',
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
        base_url + '/project/updateTestCaseTemplate',
        $('#shuttering-update-modal .form').serialize(),
        function (data, status) {
          if (data.code == '200') {
            $('#shuttering-update-modal').modal('hide')
            layer.msg('更新模板成功')
            testcasetemplateTable.ajax.reload()
          } else {
            layer.msg(data.msg || '更新模板失败')
          }
        }
      )
    },
  })

  $('#shuttering-update-modal').on('hide.bs.modmal', function () {
    updateShuttingModalValidate.resetForm()
    $('#shuttering-update-modal .form')[0].reset()
    $('#shuttering-update-modal .form .form-group').removeClass('has-error')
  })

  /*delete*/
  $('#testcasetemplate_list').on('click', '.remove', function () {
    var id = $(this).parents('div').attr('_id1')

    layer.confirm(
      '确认删除此输入项?',
      {
        icon: 3,
        title: '系统提示',
        btn: ['确定', '取消'],
      },
      function (index) {
        layer.close(index)

        $.ajax({
          type: 'POST',
          url: base_url + '/project/deleteTestCaseTemplate',
          data: {
            id: id,
          },
          dataType: 'json',
          success: function (data) {
            if (data.code == 200) {
              layer.msg('删除输入项成功')
              testcasetemplateTable.ajax.reload()
            } else {
              layer.msg(data.msg || '删除输入项失败')
            }
          },
        })
      }
    )
  })

  /**
   * 类型选中下拉列表时出现类型标识选项
   */
  $('#updateType').bind('change', function () {
    $('#updateOptions').empty()
    var val = $(this).val()
    if (val == 1) {
      $('#updateSign').show()
      /*$.ajax({
                url: base_url + "/system/getDictionaryList",
                type: "POST",
                async: false,
                success: function(data) {
                    for (var i = 0; i < data.length; i++) {
                        var id = data[i].id;
                        var rows = "<option value='"+id+"'>" + data[i].categoryMain + "</option>";

                        $("#updateOptions").append(rows);
                    }
                },
                error: function (response, ajaxOptions, thrownError) {
                }
            });*/
    } else {
      $('#updateSign').hide()
    }
  })

  /************************模板模块结束************************/

  /************************回归测试用例开始************************/
  $('#testcase_list').on('click', '.openTestDatas', function () {
    //显示模板列表页面
    $('#mainArea').css('display', 'none')
    $('#testDatasArea').css('display', 'block')
    $('#shuttingArea').css('display', 'none')
    testCaseId = $(this).parents('div').attr('_id')
    console.log('testCaseId' + testCaseId)
    $.ajax({
      url: base_url + '/project/getTestCaseData',
      data: { testCaseId: testCaseId },
      type: 'post',
      dataType: 'json',
      success: function (data) {
        if (data.code == '200') {
          console.log('data.content' + data.content)
          if (data.content != '') {
            excelInfo = JSON.parse(data.content)
            showCaseInfo(excelInfo)
          }
        }
      },
    })

    // data = [
    //   ['a', 2001, 2000, 2000],
    //   ['b', 2002, 2000, 2000],
    //   ['c', 2003, 2000, 2000],
    //   ['d', 2004, 2000, 2000],
    // ]

    // $('#my').jexcel({
    //   data: data,
    //   colHeaders: ['a', 'b', 'c', 'd'],
    //   colWidths: [300, 80, 100, 100],
    //   columns: [
    //     { type: 'text' },
    //     { type: 'numberic' },
    //     { type: 'numberic' },
    //     { type: 'numberic' },
    //   ],
    // })
  })

  $('#importExcel').on('click', function () {
    $('#import-excel .form')[0].reset()
    $('#import-excel').modal('show')
  })

  var addModalValidate = $('#import-excel .form').validate({
    errorElement: 'span',
    errorClass: 'help-block',
    focusInvalid: true,
    rules: {
      file: {
        required: true,
      },
      startRow: {
        number: true,
      },
      endRow: {
        number: true,
      },
      endRow: {
        number: true,
      },
      caseName: {
        required: true,
      },
    },
    messages: {
      file: {
        required: '请选择excel文件',
      },
      caseName: {
        required: '请输入案例名称所在列名',
      },
      startRow: {
        number: '数据开始行只能为数字',
      },
      endRow: {
        number: '数据结束行只能为数字',
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
      var formData = new FormData()
      formData.append('file', $('#caseFile')[0].files[0])
      formData.append('testCaseId', testCaseId)
      formData.append('startRow', $("input[name='startRow']").val())
      formData.append('endRow', $("input[name='endRow']").val())
      formData.append('caseName', $("input[name='caseName']").val())

      $.ajax({
        url: base_url + '/project/importExcelData',
        type: 'POST',
        async: false,
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
          if (data.code == '200') {
            $('#import-excel').modal('hide')
            layer.msg('导入案例表成功')
            console.log('data.content' + data.content)
            excelInfo = JSON.parse(data.content)
            showCaseInfo(excelInfo)
          } else {
            layer.alert(data.msg || '导入案例表失败')
          }
        },
      })
    },
  })

  /**
   * 打开新建测试数据模块
   */
  $('#addTestData').click(function () {
    $("#test-data-modal .form input[name='selectOptions']").val('')
    $('#sign').hide()
    $('#test-data-modal').modal('show')
  })
})

function openImport() {
  if (
    testcasetemplateTable != undefined &&
    testcasetemplateTable.data().length > 0
  ) {
    layer.confirm(
      '导入后将覆盖现有输入项，确定导入?',
      {
        icon: 3,
        title: '系统提示',
        btn: ['确定', '取消'],
      },
      function (index) {
        layer.close(index)

        $('#file').trigger('click')
      }
    )
  } else {
    $('#file').trigger('click')
  }
}

/*导入*/
function important() {
  console.log('hi')
  var fileDir = $('#file').val()
  var suffix = fileDir.substr(fileDir.lastIndexOf('.'))
  if ('.xls' != suffix && '.xlsx' != suffix) {
    layer.alert('请选择excel文件')
    return
  }

  var formData = new FormData()
  formData.append('file', $('#file')[0].files[0])
  formData.append('mainId', $("input[name='mainId']").val())
  formData.append('suffix', suffix)

  $.ajax({
    url: base_url + '/project/importTestCaseTemplate',
    type: 'POST',
    async: false,
    data: formData,
    processData: false,
    contentType: false,
    success: function (data) {
      testcasetemplateTable.ajax.reload()
      layer.msg(data.msg)
      $('#file').val('')
    },
  })
}

function openExcel() {
  $('#excel').trigger('click')
}

/*导入*/
function writeExcel(obj) {
  var wb //读取wan'cheng
  var rABS = false //是否将文件读取成为二进制字符串
  if (!obj.files) {
    return
  }
  var fileDir = $('#excel').val()
  var suffix = fileDir.substr(fileDir.lastIndexOf('.'))
  if ('.xls' != suffix && '.xlsx' != suffix) {
    layer.alert('请选择excel文件')
    return
  }

  var f = obj.files[0]
  var reader = new FileReader()
  reder.onload = function (e) {
    var data = e.target.result
  }

  alert('选择文件')

  /*var formData = new FormData()
    formData.append('file', $('#excel')[0].files[0])
    formData.append('testCaseId', $("input[name='testCaseId']").val())

    $.ajax({
        url: base_url + '/excel/writeExcel',
        type: 'POST',
        async: false,
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {

        },
    })*/
}

function showCaseInfo(excelInfo) {
  var title = []
  var excelData = []
  for (var i = 0; i < excelInfo.length; i++) {
    var rowData = []

    var jsonObj = excelInfo[i]
    var j = 0
    if (i == 0) {
      for (var key in jsonObj) {
        if (key != 'rowIndex') {
          title.push({ type: 'text', title: key, width: 120 })
        }
      }
    }
    for (var key in jsonObj) {
      if (key != 'rowIndex') {
        rowData[j] = jsonObj[key]
      }
      j++
    }

    excelData[i] = rowData
  }
  $('#paramsInfo').html('')
  jexcel(document.getElementById('paramsInfo'), {
    minDimensions: [title.length, 10],
    tableOverflow: true,
    tableWidth: '900px',
    tableHeight: '600px',
    data: excelData,
    columns: title,
  })
}
