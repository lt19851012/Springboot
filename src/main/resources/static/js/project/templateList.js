let projectId
let testCaseId
let tempMainTableData
let status
let mainId
$(function () {
  var role = sessionStorage.getItem('role')
  var user = sessionStorage.getItem('user')
  var userId = sessionStorage.getItem('userId')
  var exist = sessionStorage.getItem('exist')

  if (role == '0' || role == '1' || (role == '2' && exist == true)) {
    $('#addButton').css('display', 'block')
  }

  tempMainTableData = $('#template_list').dataTable({
    dom:
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-4'l><'col-sm-4'i><'col-sm-4'p>>",
    deferRender: true,
    processing: false,
    serverSide: true,
    pagingType: 'full_numbers',
    ajax: {
      url: base_url + '/project/templateMainPageList',
      type: 'post',
      data: function (d) {
        var obj = {}
        obj.searchInfo = $('#searchInfo').val()
        obj.start = d.start
        obj.length = d.length
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
        width: '10%',
      },
      {
        data: 'descripe',
        visible: true,
        width: '10%',
      },
      {
        data: 'projectName',
        visible: true,
        width: '10%',
      },
      {
        data: 'testCaseName',
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
        width: '10%',
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
        width: '10%',
        render: function (data, type, row) {
          tempMainTableData['key' + row.id] = row
          var html =
            '<div class="btn-group" _id="' +
            row.id +
            '">\n' +
            '   <a href="javascript:void(0);" class="update" >' +
            '修改' +
            '</a>\n' +
            '<a href="javascript:void(0);" class="preview" >' +
            '预览' +
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

  /*查询*/
  $('#searchBtn').on('click', function (e) {
    e.preventDefault()
    tempMainTableData.fnDraw()
  })

  /*重置*/
  $('#clear').on('click', function () {
    $('#searchForm')[0].reset()
  })

  /*取消*/
  $('#cancelDataSample').on('click', function () {
    $('#mainArea').show()
    $('#dataSample').hide()
    tempMainTableData.fnDraw()
  })

  /*新增窗口*/
  $('#addDataSample').on('click', function () {
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
      $('#createDataSample').removeAttr('disabled')
    } else {
      $('#createDataSample').attr('disabled', 'disabled')
    }
  })


  /*添加窗口过滤提交*/
  var addModalValidate = $('#dataSampleForm').validate({
    errorElement: 'span',
    errorClass: 'help-block',
    focusInvalid: true,
    rules: {
      name: {
        required: true,
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
      var templates = new Array()

      var rows = testcasetemplateTable.rows()
      for (var i = 0; i < rows[0].length; i++) {
        console.log('rows.row(i).data()' + JSON.stringify(rows.row(i).data()))
        var param = rows.row(i).data()
        var id = param['id']

        var requiredId = 're' + id
        if ($('#' + requiredId).is(':checked')) {
          param['required'] = 1
        } else {
          param['required'] = 0
        }

        var displayId = 'di' + id
        if ($('#' + displayId).is(':checked')) {
          param['display'] = 1
        } else {
          param['display'] = 0
        }
        if (status == '新建') {
          param['testCaseTemplateId'] = id
          param['id'] = null
          param['inputType'] = 0;
        }

        var template = new Object()
        template = param
        console.log('template' + JSON.stringify(template))
        templates.push(template)
      }

      if (status == '新建') {
        mainId = null
      }

      $.ajax({
        url: base_url + '/project/saveTemplate',
        type: 'POST',
        data: {
          templates: JSON.stringify(templates),
          name: $("#dataSample input[name='name']").val(),
          descripe: $("#dataSample input[name='descripe']").val(),
          testCaseId: $('#testCaseId').children('option:selected').val(),
          projectId: $('#projectId').children('option:selected').val(),
          mainId: mainId,
        },
        dataType: 'json',
        traditional: true,
        success: function (data) {
          $('#add-modal').modal('hide')
          status = null
          mainId = null

          if (data.code == 200) {
            layer.msg('模板配置成功')
            $('#dataSample').hide()
            $('#mainArea').show()
            tempMainTableData.fnDraw()
          } else {
            layer.msg(data.msg || '模板配置失败')
            $('#dataSample').hide()
            $('#mainArea').show()
          }
        },
      })
    },
  })

  /*配置模板*/
  $('#createDataSample').on('click', function () {
    $('#add-modal').modal('hide')
    $('#dataSampleForm')[0].reset()
    testCaseId = $('#testCaseId').children('option:selected').val()
    $('#mainArea').hide()
    $('#dataSample').show()
    var data = function (d) {
      var obj = {}
      obj.testCaseId = $('#testCaseId').val()
      //obj.start = d.start
      //obj.length = d.length
      return obj
    }
    loadTemplate(0, data, null, null, null)
  })

  // update
  $('#template_list').on('click', '.update', function () {
    // show
    var id = $(this).parents('div').attr('_id')
    var row = tempMainTableData['key' + id]
    $('#mainArea').hide()
    $('#dataSample').show()
    var data = function (d) {
      var obj = {}
      obj.mainId = id
      return obj
    }
    loadTemplate(1, data, row.name, row.descripe, id) //编辑数据
  })

  $('#template_list').on('click', '.remove', function () {
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
          url: base_url + '/project/deleteTemplate',
          data: {
            id: id,
          },
          dataType: 'json',
          success: function (data) {
            if (data.code == 200) {
              layer.msg('删除数据成功')
              tempMainTableData.fnDraw()
            } else {
              layer.msg(data.msg || '删除数据失败')
            }
          },
        })
      }
    )
  })

  $('#template_list').on('click', '.preview', function () {
    var id = $(this).parents('div').attr('_id')
    $('#preview-modal').modal('show')
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
          $('#updateDataSampleFormItems').html('')
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
              $('#updateDataSampleFormItems').append(formItem)
              $('#updateDataSampleFormItems').validate()

              if (dataItems[n].required == 1) {
                console.log('id' + n)
                console.log($('#id' + n))
                setTimeout(function (){
                  $('#id' + n).rules('add', {
                    required: true,
                    messages: {
                      required: value.name + '不能为空',
                    },
                  },0)
                })
              }
              if (dataItems[n].defaultValue != null) {
                $('#id' + n).val(dataItems[n].defaultValue)
              }
            }
          })
        } else {
          layer.alert(data.msg || '获取模板失败')
        }
      },
    })
  })

  var updateModalValidate = $('#previewTemplate').validate({
    errorElement: 'span',
    errorClass: 'help-block',
    focusInvalid: true,

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
    submitHandler: function (form) {},
  })
})

function loadTemplate(num, data, name, descripe, id) {
  //num:0 新增数据  num:1编辑数据
  //清除掉之前的data
  $('#data').html('')
  let table =
    '<table id="testcasetemplate_list" class="table table-bordered table-striped" width="100%" >' +
    '<thead>' +
    '<tr>' +
    '<th name="id" >是否显示</th>' +
    '<th name="name" >输入项名称</th>' +
    '<th name="required" >是否必填</th>' +
    '<th name="defaultValue" >默认值</th>' +
    '<th name="inputType" >类型</th>' +
    '<th name="selectOptions" >下拉选项</th>' +
    '<th name="modifyUser" >提示信息</th>' +
    '<th name="modifyTime" >placeHolder</th>' +
    '</tr></thead><tbody></tbody> <tfoot></tfoot></table>'

  $('#data').append(table)

  var url = ''
  if (num == 0) {
    status = '新建'
    url = base_url + '/project/testCaseTemplatePageList'
  } else if (num == 1) {
    status = '编辑'
    mainId = id
    $("input[name='name']").val(name)
    $("input[name='descripe']").val(descripe)

    url = base_url + '/project/getTemplateListByMainId'
  }

  testcasetemplateTable = $('#testcasetemplate_list').DataTable({
    dom:
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-4'l><'col-sm-4'><'col-sm-4'p>>",
    deferRender: true,
    processing: false,
    ordering: false,
    paging: false,
    ajax: {
      url: url,
      type: 'post',
      data: data,
    },
    searching: false,

    columns: [
      {
        data: 'itemIndex',
        bSortable: false,
        visible: true,
        width: '5%',
        render: function (data, type, row) {
          let str =
            '<input type="checkbox" name="display" id="di' + row.id + '">'
          let id = 'di' + row.id
          if (num == 1) {
            if (row.display == 1) $('#' + id).attr('checked', 'checked')
          }
          return str
        },
      },
      {
        data: 'name',
        visible: true,
        width: '15%',
      },
      {
        data: 'required',
        visible: true,
        width: '5%',
        render: function (data, type, row) {
          let str =
            '<input type="checkbox" name="required" id="re' + row.id + '">'
          if (num == 1) {
            let id = 're' + row.id
            if (row.required == 1) {
              $('#' + id).attr('checked', 'checked')
            }
          }
          return str
        },
      },
      {
        data: 'defaultValue',
        visible: true,
        width: '15%',
      },
      {
        data: 'inputType',
        visible: true,
        width: '10%',
        render: function (data, type, row) {
          if (data == 1) {
            return '下拉列表'
          } else {
            return '输入框'
          }
        },
      },
      {
        data: 'selectOptions',
        visible: true,
        width: '20%',
      },
      {
        data: 'tip',
        width: '15%',
        visible: true,
      },
      {
        data: 'placeHolder',
        width: '15%',
        visible: true,
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

  testcasetemplateTable.MakeCellsEditable({
    onUpdate: myCallbackFunction,
    inputCss: 'my-input-class',
    columns: [3, 4, 5, 6, 7],
    allowNulls: {
      columns: [3, 4, 5, 6, 7],
      errorClass: 'error',
    },
    listenToKeys: true,
    inputTypes: [
      {
        column: 3,
        type: 'text',
        options: null,
      },
      {
        column: 4,
        type: 'list',
        options: [
          { value: '0', display: '输入框' },
          { value: '1', display: '下拉列表' },
        ],
      },
      {
        column: 5,
        type: 'textarea',
        options: null,
      },
      {
        column: 6,
        type: 'textarea',
        options: null,
      },
      {
        column: 7,
        type: 'textarea',
        options: null,
      },
      // Nothing specified for column 3 so it will default to text
    ],
  })
}

function myCallbackFunction(updatedCell, updatedRow, oldValue) {
  console.log('The new value for the cell is: ' + updatedCell.data())
  console.log('The old value for that cell was: ' + oldValue)
  console.log('The values for each cell in that row are: ' + updatedRow.data())
}
