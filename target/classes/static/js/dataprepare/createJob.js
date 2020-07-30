var dataTable
$(function () {
  //查询产品线下拉列表
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
        $('#productName').append(
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
  var dataItems = {}
  var role = sessionStorage.getItem('role')
  var user = sessionStorage.getItem('user')
  console.log('jobTmpId1' + jobTmpId)
  var tableData = {}
  dataTable = $('#data_list').DataTable({
    dom:
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-4'l><'col-sm-4'i><'col-sm-4'p>>",

    deferRender: true,
    processing: false,
    serverSide: true,
    pagingType: 'full_numbers',
    ajax: {
      url: base_url + '/dataprepare/jobItemTmpPageList',
      type: 'post',
      data: function (d) {
        var obj = {}
        obj.jobTmpId = jobTmpId

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
        data: 'caseIndex',
        bSortable: false,
        visible: true,
        width: '10%',
      },
      {
        data: 'name',
        visible: true,
        width: '60%',
      },

      {
        data: 'id',
        visible: true,
        width: '30%',
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
            '<a href="javascript:void(0);" class="copy" >' +
            '复制当前数据' +
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
      formData.append('file', $('#file')[0].files[0])
      formData.append('testCaseId', testCaseId)
      formData.append('startRow', $("input[name='startRow']").val())
      formData.append('endRow', $("input[name='endRow']").val())
      formData.append('caseName', $("input[name='caseName']").val())
      formData.append('jobTmpId', jobTmpId)

      $.ajax({
        url: base_url + '/dataprepare/importExcelData',
        type: 'POST',
        async: false,
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
          if (data.code == '200') {
            console.log('jobTmpId ' + data.content)
            jobTmpId = data.content
            $('#import-excel').modal('hide')
            if (jobTmpId) {
              $('#createJob').removeAttr('disabled')
              $('#preview').removeAttr('disabled')
            } else {
              $('#createJob').attr('disabled', 'disabled')
              $('#preview').attr('disabled', 'disabled')
            }
            layer.msg('导入数据成功')

            dataTable.draw()
          } else {
            layer.alert(data.msg || '导入数据失败')
          }
        },
      })
    },
  })

  $('#add-modal').on('hide.bs.modal', function () {
    addModalValidate.resetForm()
    $('#add-modal .form')[0].reset()
    $('#add-modal .form .form-group').removeClass('has-error')
  })

  $('#file').on('change', function () {
    var fileName = $('#file').val()
    if (fileName && fileName != '') {
      $('#file').valid()
    }
  })

  $('#data_list').on('click', '.remove', function () {
    var id = $(this).parents('div').attr('_id')
    layer.confirm(
      '确认删除此数据?',
      {
        icon: 3,
        title: '系统提示',
        btn: ['确定', '取消'],
      },
      function (index) {
        layer.close(index)

        $.ajax({
          type: 'POST',
          url: base_url + '/dataprepare/deleteJobItemTmp',
          data: {
            id: id,
          },
          dataType: 'json',
          success: function (data) {
            if (data.code == 200) {
              layer.msg('删除数据成功')
              dataTable.draw()
            } else {
              layer.msg(data.msg || '删除数据失败')
            }
          },
        })
      }
    )
  })

  $('#data_list').on('click', '.update', function () {
    // show
    var id = $(this).parents('div').attr('_id')
    var row = tableData['key' + id]
    $("#createDataForm input[name='id']").val(row.id)
    console.log(row.id)
    var params = row.params
    var paramJson = JSON.parse(params)
    console.log('params' + params)
    var formItem = ''
    $('#updateDataItems').html('')
    if (templateExisted) {
      $.ajax({
        type: 'POST',
        async: false, // async, avoid js invoke pagelist before jobId data init
        url: base_url + '/project/getTemplateListByMainId',
        data: { mainId: row.templateMainId },
        dataType: 'json',
        success: function (data) {
          data = data.data
          console.log('data' + JSON.stringify(data))
          if (data.length > 0) {
            $('#templateWin').modal('hide')
            $('#createDataItems').html('')
            dataItems = data
            $.each(dataItems, function (n, value) {
              if (value.display == 1) {
                formItem =
                  '<div class="form-group">' +
                  '<label for="' +
                  n +
                  '" class="col-sm-3 control-label">' +
                  value.name
                if (value.required == 1) {
                  formItem = formItem + '&nbsp;*&nbsp;'
                }
                if (value.tip != null && value.tip != '') {
                  formItem =
                    formItem +
                    '<span  data-widget="remove" data-toggle="tooltip" title="' +
                    value.tip +
                    '">' +
                    '&nbsp;<i class="fa fa-question-circle-o"></i></span>'
                }
                formItem = formItem + '</label><div class="col-sm-6">'
                if (value.inputType == null || value.inputType == 0) {
                  formItem =
                    formItem +
                    '<input class="form-control" name="' +
                    n +
                    '" id="id' +
                    n +
                    '" placeholder="' +
                    (value.placeHolder == null ? '' : value.placeHolder) +
                    '">'
                } else {
                  formItem =
                    formItem +
                    '<select class="form-control" name="' +
                    n +
                    '" id="id' +
                    n +
                    '">'
                  var selectOptions = value.selectOptions
                  if (selectOptions != null && selectOptions != '') {
                    selectOptionsArray = selectOptions.split(',')
                    for (selectOption in selectOptionsArray) {
                      formItem =
                        formItem +
                        '<option value="' +
                        selectOptionsArray[selectOption] +
                        '">' +
                        selectOptionsArray[selectOption] +
                        '</option>'
                    }
                  }
                  formItem = formItem + '</select>'
                }
                formItem = formItem + '</div>' + '</div>'
                $('#updateDataItems').append(formItem)
                $('#updateDataItems').validate()

                if (dataItems[n].required == 1) {
                  console.log('id' + n)
                  console.log($('#id' + n))
                  setTimeout(function () {
                    $('#id' + n).rules('add', {
                      required: true,
                      messages: {
                        required: value.name + '不能为空',
                      },
                    })
                  }, 0)
                }
                if (paramJson.hasOwnProperty(dataItems[n].id)) {
                  $('#id' + n).val(paramJson[dataItems[n].id])
                }
              }
            })
          } else {
            layer.alert(data.msg || '获取数据模板失败')
          }
        },
      })
    } else {
      for (var item in paramJson) {
        if (item != 'rowIndex') {
          formItem =
            formItem +
            '<div class="form-group">' +
            '<label for="' +
            item +
            '" class="col-sm-3 control-label">' +
            item +
            '</label>' +
            '<div class="col-sm-9">' +
            '<input name="' +
            item +
            '" value="' +
            paramJson[item] +
            '" type="text" class="form-control"/>' +
            '</div>' +
            '</div>'
        }
      }
      $('#updateDataItems').append(formItem)
    }

    $("#updateDataForm input[name='id']").val(row.id)
    $("#updateDataForm input[name='name']").val(row.name)
    $('#update-modal').modal('show')
  })

  $('#data_list').on('click', '.copy', function () {
    // show
    $('#copy-modal .form')[0].reset()
    $('#copy-modal .form .form-group').removeClass('has-error')

    var id = $(this).parents('div').attr('_id')
    var row = tableData['key' + id]
    console.log(row.id)
    $("#copyDataForm input[name='id']").val(row.id)
    $('#copy-modal').modal('show')
  })

  $("input[name='copyNumber']").on('blur', '.copy', function () {
    alert('输入的数量：' + $("input[name='copyNumber']").val())
  })

  var updateModalValidate = $('#updateDataForm').validate({
    errorElement: 'span',
    errorClass: 'help-block',
    focusInvalid: true,

    rules: {},
    messages: {},
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
      var itemObject = new Object()

      var id = $("#updateDataForm input[name='id']").val()
      var name = $("#updateDataForm input[name='name']").val()
      var row = tableData['key' + id]

      var dataSample = new Object()

      var params = row.params
      var paramJson = JSON.parse(params)
      var formItem = ''
      if (templateExisted) {
        for (var i = 0; i < dataItems.length; i++) {
          if (dataItems[i].inputType == 0 || dataItems[i].inputType == null) {
            itemObject[dataItems[i].id] = $(
              "#updateDataForm input[name='" + i + "']"
            ).val()
          } else {
            itemObject[dataItems[i].id] = $(
              "#updateDataForm select[name='" + i + "']"
            ).val()
          }
        }
      } else {
        for (var item in paramJson) {
          itemObject[item] = $(
            "#updateDataForm input[name='" + item + "']"
          ).val()
        }
      }

      dataSample.id = id
      dataSample.caseIndex = row.caseIndex
      dataSample.params = JSON.stringify(itemObject)
      dataSample.jobId = jobTmpId
      dataSample.name = name

      $.post(
        base_url + '/dataprepare/updateJobItemTmp',

        dataSample,
        function (data, status) {
          if (data.code == '200') {
            $('#update-modal').modal('hide')
            layer.msg('修改数据成功')

            dataTable.draw()
          } else {
            layer.alert(data.msg || '修改数据失败')
          }
        }
      )
    },
  })

  $('#deleteJob').on('click', function () {
    layer.confirm(
      '确认清空数据?',
      {
        icon: 3,
        title: '系统提示',
        btn: ['确定', '取消'],
      },
      function (index) {
        layer.close(index)

        $.ajax({
          type: 'POST',
          url: base_url + '/dataprepare/deleteJobTmp',
          data: {
            id: jobTmpId,
          },
          dataType: 'json',
          success: function (data) {
            if (data.code == 200) {
              layer.msg('清空数据成功')
              jobTmpId = ''
              $('#createJob').attr('disabled', 'disabled')
              dataTable.draw()
            } else {
              layer.msg(data.msg || '清空数据失败')
            }
          },
        })
      }
    )
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

  $('#createJob').on('click', function () {
    $('#createJobForm').submit()
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
      projectId: {
        required: true,
      },
      testCaseId: {
        required: true,
      },
      timeout: {
        number: true,
      },
    },
    messages: {
      name: {
        required: '请输入任务描述',
      },
      projectId: {
        required: '请选择脚本所属项目',
      },
      testCaseId: {
        required: '请选择脚本',
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
      $('#projectName').val(projectName)
      $('#testCaseName').val(testCaseName)
      $('#testCaseId').val(testCaseId)
      $('#projectId').val(projectId)

      if (jobTmpId == '') {
        layer.alert(
          '任务数据为空，?',
          {
            icon: 3,
            title: '系统提示',
            btn: ['确定', '取消'],
          },
          function (index) {
            layer.close(index)
            $('#loadingModal').modal({ backdrop: 'static', keyboard: false })
            $.post(
              base_url + '/dataprepare/submitJob',
              $('#createJobForm').serialize(),
              function (data, status) {
                $('#loadingModal').modal('hide')
                if (data.code == '200') {
                  layer.msg('创建任务成功')
                  window.location.href =
                    base_url + '/dataprepare/jobDetail?jobId=' + data.content
                } else {
                  layer.msg(data.msg || '创建任务失败')
                }
              }
            )
          }
        )
      } else {
        $('#jobTmpId').val(jobTmpId)
        $('#loadingModal').modal({ backdrop: 'static', keyboard: false })
        $.post(
          base_url + '/dataprepare/submitJob',
          $('#createJobForm').serialize(),
          function (data, status) {
            $('#loadingModal').modal('hide')
            if (data.code == '200') {
              layer.msg('创建任务成功')
              window.location.href =
                base_url + '/dataprepare/jobDetail?jobId=' + data.content
            } else {
              layer.msg(data.msg || '创建任务失败')
            }
          }
        )
      }
    },
  })

  /*$('#cancelDataSample').on('click', function () {
    window.history.back();
  })*/

  $('#cancel').on('click', function () {
    window.location.href = base_url + '/dataprepare/directJob'
  })

  // var dataSampleTable = $('#data_sample_list').DataTable({
  //   dom:
  //       "<'row'<'col-sm-12'tr>>" +
  //       "<'row'<'col-sm-4'l><'col-sm-4'i><'col-sm-4'p>>",
  //   columnDefs: [
  //     {
  //       orderable: false,
  //       className: 'select-checkbox',
  //       targets: 0,
  //       defaultContent: '',
  //     },
  //   ],
  //   select: {
  //     style: 'multi',
  //   },
  //   deferRender: true,
  //   processing: false,
  //   serverSide: true,
  //   pagingType: 'full_numbers',
  //   ajax: {
  //     url: base_url + '/project/dataSamplePageList',
  //     type: 'post',
  //     data: function (d) {
  //       var obj = {}

  //       obj.projectName = projectName
  //       obj.testCaseName = testCaseName
  //       obj.start = d.start
  //       obj.length = d.length
  //       obj.user = user
  //       obj.role = role
  //       return obj
  //     },
  //   },
  //   searching: false,
  //   ordering: false,
  //   //"scrollX": true,	// scroll x，close self-adaption
  //   columns: [
  //     {
  //       data: null,
  //       visible: true,
  //       width: '7%',
  //     },
  //     {
  //       data: 'id',
  //       bSortable: false,
  //       visible: true,
  //       width: '7%',
  //     },
  //     {
  //       data: 'name',
  //       visible: true,
  //       width: '25%',
  //     },
  //   ],
  //   language: {
  //     sProcessing: '处理中...',
  //     sLengthMenu: '每页 _MENU_ 条',
  //     sZeroRecords: '没有匹配结果',
  //     sInfo: '第 _PAGE_ 页 ( 总共 _PAGES_ 页，_TOTAL_ 条记录 )',
  //     sInfoEmpty: '无记录',
  //     sInfoFiltered: '(由 _MAX_ 项结果过滤)',
  //     sInfoPostFix: '',
  //     sSearch: '搜索',
  //     sUrl: '',
  //     sEmptyTable: '表中数据为空',
  //     sLoadingRecords: '载入中...',
  //     sInfoThousands: ',',
  //     oPaginate: {
  //       sFirst: '<<',
  //       sPrevious: '<',
  //       sNext: '>',
  //       sLast: '>>',
  //     },
  //     oAria: {
  //       sSortAscending: ': 以升序排列此列',
  //       sSortDescending: ': 以降序排列此列',
  //     },
  //   },
  // })

  $('#importSample').on('click', function () {
    console.log('importSample')
    $('#importDataSample').modal('show')
    dataSampleTable.draw()
  })

  $('#chooseDataSample').on('click', function () {
    var rows = dataSampleTable.rows({ selected: true }).data().toArray()
    var ids = new Array()
    for (var i = 0; i < rows.length; i++) {
      ids.push(rows[i].id)
    }
    var idString = ids.toString()

    console.log(idString + 'ids')
    $.ajax({
      url: base_url + '/dataprepare/importDataSample',
      type: 'POST',
      async: false,
      data: { ids: idString, testCaseId: testCaseId, jobTmpId: jobTmpId },
      dataType: 'json',
      success: function (data) {
        if (data.code == '200') {
          console.log('jobTmpId ' + data.content)
          jobTmpId = data.content
          if (jobTmpId) {
            $('#createJob').removeAttr('disabled')
          } else {
            $('#createJob').attr('disabled', 'disabled')
          }
          $('#importDataSample').modal('hide')
          layer.msg('导入数据成功')

          dataTable.draw()
        } else {
          layer.alert(data.msg || '导入数据失败')
        }
      },
    })
  })

  $('#createData').on('click', function () {
    //打开选择模板弹框
    $('#templateWin').modal('show')

    tempMainTableData = $('#template_list').dataTable({
      dom:
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-4'l><'col-sm-4'i><'col-sm-4'p>>",
      deferRender: true,
      processing: false,
      serverSide: true,
      ordering: false,
      pagingType: 'full_numbers',
      destroy: true,
      ajax: {
        url: base_url + '/project/templateMainPageList',
        type: 'post',
        data: function (d) {
          var obj = {}
          obj.projectId = projectId
          obj.testCaseId = testCaseId
          obj.start = d.start
          obj.length = d.length
          return obj
        },
      },
      searching: false,
      columns: [
        {
          data: 'name',
          visible: true,
          width: '10%',
        },
        {
          data: 'descripe',
          visible: true,
          width: '10%',
        },
        {
          data: 'id',
          visible: true,
          width: '10%',
          render: function (data, type, row) {
            tempMainTableData['key' + row.id] = row
            var html =
              '<div class="btn-group" _id="' +
              row.id +
              '">\n' +
              '<a href="javascript:void(0);" class="create" >' +
              '创建' +
              '</a>\n'
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
  })

  $('#template_list').on('click', '.create', function () {
    let id = $(this).parents('div').attr('_id')
    let row = tempMainTableData['key' + id]

    //回填名称和描述
    $("#createDataForm input[name='name']").val(row.name)
    $("#createDataForm input[name='descripe']").val(row.descripe)
    $("#createDataForm input[name='id']").val(row.id)

    $.ajax({
      type: 'POST',
      async: false, // async, avoid js invoke pagelist before jobId data init
      url: base_url + '/project/getTemplateListByMainId',
      data: { mainId: id },
      dataType: 'json',
      success: function (data) {
        data = data.data
        console.log('data' + JSON.stringify(data))
        if (data.length > 0) {
          $('#templateWin').modal('hide')
          $('#createDataItems').html('')
          $('#updateDataItems').html('')

          dataItems = data
          $.each(dataItems, function (n, value) {
            if (value.display == 1) {
              var formItem =
                '<div class="form-group">' +
                '<label for="' +
                n +
                '" class="col-sm-3 control-label">' +
                value.name
              if (value.required == 1 && value.inputType != 0) {
                formItem = formItem + ' * '
              }
              if (value.tip != null && value.tip != '') {
                formItem =
                  formItem +
                  '<span  data-widget="remove" data-toggle="tooltip" title="' +
                  value.tip +
                  '">' +
                  '&nbsp;<i class="fa fa-question-circle-o"></i></span>'
              }
              formItem = formItem + '</label><div class="col-sm-6">'
              if (value.inputType == null || value.inputType == 0) {
                if (value.placeHolder == null) {
                  value.placeHolder = ''
                }
                formItem =
                  formItem +
                  '<input class="form-control" name="' +
                  n +
                  '" id="id' +
                  n +
                  '" placeholder="' +
                  value.placeHolder +
                  '">'
              } else {
                formItem =
                  formItem +
                  '<select class="form-control" name="' +
                  n +
                  '" id="id' +
                  n +
                  '">'
                var selectOptions = value.selectOptions
                if (selectOptions != null && selectOptions != '') {
                  selectOptionsArray = selectOptions.split(',')
                  for (selectOption in selectOptionsArray) {
                    formItem =
                      formItem +
                      '<option value="' +
                      selectOptionsArray[selectOption] +
                      '">' +
                      selectOptionsArray[selectOption] +
                      '</option>'
                  }
                }
                formItem = formItem + '</select>'
              }
              formItem = formItem + '</div>' + '</div>'

              $('#createDataItems').append(formItem)
              $('#createDataModal').modal('show')
              if (dataItems[n].required == 1) {
                console.log('id' + n)
                console.log($('#id' + n))
                setTimeout(function () {
                  $('#id' + n).rules('add', {
                    required: true,
                    messages: {
                      required: value.name + '不能为空',
                    },
                  })
                }, 0)
              }

              if (dataItems[n].defaultValue != null) {
                console.log(
                  'defaultValue ' + n + ': ' + dataItems[n].defaultValue
                )
                console.log($('#id' + n))
                $('#id' + n).val(dataItems[n].defaultValue)
              }
            }
          })
        } else {
          layer.alert(data.msg || '获取模板失败')
        }
      },
    })

    var addModalValidate = $('#createDataForm').validate({
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
          required: '请输入名称',
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
        var itemObject = new Object()

        for (var i = 0; i < dataItems.length; i++) {
          if (dataItems[i].inputType == 0 || dataItems[i].inputType == null) {
            itemObject[dataItems[i].id] = $(
              "#createDataForm input[name='" + i + "']"
            ).val()
          } else {
            itemObject[dataItems[i].id] = $(
              "#createDataForm select[name='" + i + "']"
            ).val()
          }
        }

        var dataSample = new Object()
        dataSample.name = $("#createDataForm input[name='name']").val()
        dataSample.params = JSON.stringify(itemObject)
        dataSample.templateMainId = $("#createDataForm input[name='id']").val() //模板id
        dataSample.testCaseId = testCaseId

        dataSample.jobTmpId = jobTmpId
        $.post(base_url + '/dataprepare/createData', dataSample, function (
          data,
          status
        ) {
          if (data.code == '200') {
            $('#createDataModal').modal('hide')
            layer.msg('创建数据成功')
            jobTmpId = data.content
            if (jobTmpId) {
              $('#createJob').removeAttr('disabled')
            } else {
              $('#createJob').attr('disabled', 'disabled')
            }
            dataTable.draw()
          } else {
            layer.alert(data.msg || '创建数据失败')
          }
        })
      },
    })
  })

  $('#preview').on('click', function () {
    document.getElementById('paramsInfo').innerHTML = ''

    var title = []

    $.ajax({
      url: base_url + '/dataprepare/getJobItemTmpList',
      type: 'POST',
      data: { jobTmpId: jobTmpId },
      success: function (data) {
        console.log('data' + data)
        var excelData = []
        excelData[0] = title
        for (var i = 0; i < data.length; i++) {
          var rowData = []

          var param = data[i].params
          var jsonObj = JSON.parse(param)
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
        jexcel(document.getElementById('paramsInfo'), {
          tableOverflow: true,
          minDimensions: [title.length, 10],
          tableWidth: '700px',
          tableHeight: '350px',
          data: excelData,
          columns: title,
        })

        $('#params-modal').modal('show')
      },
    })
  })

  var updateModalValidate = $('#copy-modal .form').validate({
    errorElement: 'span',
    errorClass: 'help-block',
    focusInvalid: true,

    rules: {
      copyNumber: {
        required: true,
        number: true,
      },
    },
    messages: {
      copyNumber: {
        required: '请输入复制数量',
        number: 'must be number',
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
      // $.ajax({
      //   url: base_url + '/dataprepare/copyRow',
      //   type: 'post',
      //   dataType: 'json',
      //   data: {
      //     copyNumber: copyNumber,
      //     id: id,
      //   },
      //   success: function (data) {
      //     $('#copy-modal').modal('hide')
      //     if (data.code == 200) {
      //       layer.msg('复制数据成功')
      //       dataTable.draw()
      //     } else {
      //       layer.msg(data.msg || '复制数据失败')
      //     }
      //   },
      // })
      $.post(
        base_url + '/dataprepare/copyRow',
        $('#copy-modal .form').serialize(),
        function (data, status) {
          if (data.code == '200') {
            $('#copy-modal').modal('hide')
            layer.msg('复制数据成功')
            dataTable.draw()
            //bootbox.alert('创建项目成功', function () {
            //  projectTable.fnDraw()
            //})
          } else {
            layer.msg(data.msg || '复制数据失败')
          }
        }
      )
    },
  })
})
