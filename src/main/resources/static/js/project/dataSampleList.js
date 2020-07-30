$(function () {
  var dataItems = {}

  var role = sessionStorage.getItem('role')
  var user = sessionStorage.getItem('user')
  var userId = sessionStorage.getItem('userId')
  var exist = sessionStorage.getItem('exist')

  if (role == '0' || role == '1' || (role == '2' && exist == true)) {
    $('#addButton').css('display', 'block')
  }

  // init date tables
  var dataSampleTable = $('#data_sample_list').dataTable({
    dom:
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-4'l><'col-sm-4'i><'col-sm-4'p>>",
    deferRender: true,
    processing: false,
    serverSide: true,
    pagingType: 'full_numbers',
    ajax: {
      url: base_url + '/project/dataSamplePageList',
      type: 'post',
      data: function (d) {
        var obj = {}
        obj.name = $('#name').val()
        obj.start = d.start
        obj.length = d.length
        obj.user = user
        obj.role = role
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
        width: '20%',
      },
      {
        data: 'testCaseName',
        visible: true,
        width: '20%',
      },
      {
        data: 'projectName',
        visible: true,
        width: '15%',
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
        width: '20%',
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

  var tableData = {}

  $('#searchBtn').on('click', function (e) {
    e.preventDefault()
    dataSampleTable.fnDraw()
  })

  $('#clear').on('click', function () {
    $('#searchForm')[0].reset()
  })

  $('#cancelDataSample').on('click', function () {
    $('#mainArea').show()
    $('#dataSample').hide()
    dataSampleTable.fnDraw()
  })

  $('#cancelUpdateDataSample').on('click', function () {
    $('#mainArea').show()
    $('#updateDataSample').hide()
    dataSampleTable.fnDraw()
  })

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

  var addModalValidate = $('#dataSampleForm').validate({
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
            "#dataSampleForm input[name='" + i + "']"
          ).val()
        } else {
          itemObject[dataItems[i].id] = $(
            "#dataSampleForm select[name='" + i + "']"
          ).val()
        }
      }

      var dataSample = new Object()
      dataSample.name = $("#dataSampleForm input[name='name']").val()
      dataSample.description = $(
        "#dataSampleForm input[name='description']"
      ).val()
      dataSample.tag = $("#dataSampleForm input[name='tag']").val()
      dataSample.data = JSON.stringify(itemObject)
      dataSample.projectId = $('#projectId').val()
      dataSample.testCaseId = $('#testCaseId').val()
      $.post(
        base_url + '/project/addDataSample',

        dataSample,
        function (data, status) {
          if (data.code == '200') {
            $('#dataSampleForm').modal('hide')
            layer.msg('创建数据成功')
            $('#mainArea').show()
            $('#dataSample').hide()
            dataSampleTable.fnDraw()
          } else {
            layer.alert(data.msg || '创建数据失败')
          }
        }
      )
    },
  })

  // $('#add-modal').on('click', function () {
  //   $('#add-modal .form')[0].reset()
  //   $('#add-modal .form .form-group').removeClass('has-error')
  // })

  $('#createDataSample').on('click', function () {
    $('#add-modal').modal('hide')
    $('#dataSampleForm')[0].reset()
    testCaseId = $('#testCaseId').children('option:selected').val()
    $.ajax({
      type: 'POST',
      async: false, // async, avoid js invoke pagelist before jobId data init
      url: base_url + '/project/getTestCaseTemplate',
      data: { testCaseId: testCaseId },
      dataType: 'json',
      success: function (data) {
        if (data.code == 200) {
          $('#dataSampleFormItems').html('')
          dataItems = data.content
          $.each(data.content, function (n, value) {
            var formItem =
              '<div class="form-group">' +
              '<label for="' +
              n +
              '" class="col-sm-3 control-label">' +
              value.name
            if (value.tip != null && value.tip != '') {
              formItem =
                formItem +
                '<span  data-widget="remove" data-toggle="tooltip" title="' +
                value.tip +
                '">' +
                '&nbsp;<i class="fa fa-question-circle-o"></i></span>'
            }
            formItem = formItem + '</label><div class="col-sm-6">'
            if (value.inputType == 0) {
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
            $('#dataSampleFormItems').append(formItem)
            if (value.required == 0) {
              //如果为必填项
              setTimeout(function (){
                $('#id' + n).rules('add', {
                  required: true,
                  messages: {
                    required: value.name + '不能为空',
                  },
                })
              },0)
            }
          })

          $('#mainArea').hide()
          $('#dataSample').show()
        } else {
          layer.alert(data.msg || '获取数据模板失败')
        }
      },
    })
  })

  // update
  $('#data_sample_list').on('click', '.update', function () {
    // show
    var id = $(this).parents('div').attr('_id')
    var row = tableData['key' + id]

    testCaseId = row.testCaseId
    $.ajax({
      type: 'POST',
      async: false, // async, avoid js invoke pagelist before jobId data init
      url: base_url + '/project/getTestCaseTemplate',
      data: { testCaseId: testCaseId },
      dataType: 'json',
      success: function (data) {
        if (data.code == 200) {
          dataCur = JSON.parse(row.data)
          $('#updateDataSampleFormItems').html('')
          dataItems = data.content
          $.each(data.content, function (n, value) {
            var formItem =
              '<div class="form-group">' +
              '<label for="' +
              n +
              '" class="col-sm-3 control-label">' +
              value.name
            if (value.tip != null && value.tip != '') {
              formItem =
                formItem +
                '<span  data-widget="remove" data-toggle="tooltip" title="' +
                value.tip +
                '">' +
                '&nbsp;<i class="fa fa-question-circle-o"></i></span>'
            }
            formItem = formItem + '</label><div class="col-sm-6">'
            if (value.inputType == 0) {
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

            if (dataItems[n].required == 0) {
              console.log('id' + n)
              console.log($('#id' + n))
              setTimeout(function(){
                $('#id' + n).rules('add', {
                  required: true,
                  messages: {
                    required: value.name + '不能为空',
                  },
                })
              },0)
            }
            if (dataCur.hasOwnProperty(dataItems[n].id)) {
              $('#id' + n).val(dataCur[dataItems[n].id])
            }
          })

          $("#updateDataSampleForm input[name='id']").val(row.id)
          $("#updateDataSampleForm input[name='name']").val(row.name)
          $("#updateDataSampleForm input[name='description']").val(
            row.description
          )
          console.log('tag' + row.tag)
          $("#updateDataSampleForm input[name='tag']").tagsinput('add', row.tag)
          $('#mainArea').hide()
          $('#updateDataSample').show()
        } else {
          layer.alert(data.msg || '获取数据模板失败')
        }
      },
    })
  })

  var updateModalValidate = $('#updateDataSampleForm').validate({
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
      var itemObject = new Object()

      var id = $("#updateDataSampleForm input[name='id']").val()
      var row = tableData['key' + id]

      var dataSample = new Object()
      for (var i = 0; i < dataItems.length; i++) {
        if (dataItems[i].inputType == 0 || dataItems[i].inputType == null) {
          itemObject[dataItems[i].id] = $(
            "#updateDataSampleForm input[name='" + i + "']"
          ).val()
        } else {
          itemObject[dataItems[i].id] = $(
            "#updateDataSampleForm select[name='" + i + "']"
          ).val()
        }
      }
      dataSample.name = $("#updateDataSampleForm input[name='name']").val()
      dataSample.description = $(
        "#updateDataSampleForm input[name='description']"
      ).val()
      dataSample.tag = $("#updateDataSampleForm input[name='tag']").val()
      dataSample.data = JSON.stringify(itemObject)
      dataSample.projectId = row.projectId
      dataSample.testCaseId = row.testCaseId
      dataSample.id = row.id
      dataSample.createUser = row.createUser
      dataSample.modifyUser = row.modifyUser
      dataSample.createTime = row.createTime
      $.post(
        base_url + '/project/updateDataSample',

        dataSample,
        function (data, status) {
          if (data.code == '200') {
            location.reload()
            $('#dataSampleForm').modal('hide')
            layer.msg('修改数据成功')
            $('#mainArea').show()
            $('#updateDataSample').hide()
            dataSampleTable.fnDraw()
          } else {
            layer.alert(data.msg || '修改数据失败')
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

  $('#data_sample_list').on('click', '.remove', function () {
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
          url: base_url + '/project/deleteDataSample',
          data: {
            id: id,
          },
          dataType: 'json',
          success: function (data) {
            if (data.code == 200) {
              layer.msg('删除数据成功')
              dataSampleTable.fnDraw()
            } else {
              layer.msg(data.msg || '删除数据失败')
            }
          },
        })
      }
    )
  })

  testcasetemplateTable = $('#testcasetemplate_list').DataTable({
    dom:
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-4'l><'col-sm-4'><'col-sm-4'p>>",
    deferRender: true,
    processing: false,
    ordering: false,
    paging: false,
    ajax: {
      url: base_url + '/project/testCaseTemplatePageList',
      type: 'post',
      data: function (d) {
        var obj = {}
        obj.testCaseId = $('#testCaseId').val()
        //obj.start = d.start
        //obj.length = d.length
        return obj
      },
    },
    searching: false,

    columns: [
      {
        data: 'itemIndex',
        bSortable: false,
        visible: true,
        width: '5%',
        render: function (data, type, row) {
          return '<input name="show" type="checkbox">'
        },
      },
      {
        data: 'name',
        visible: true,
        width: '10%',
      },
      {
        data: 'required',
        visible: true,
        width: '5%',
        render: function (data, type, row) {
          if (data == 0) {
            return '必填'
          } else {
            return '可选'
          }
        },
      },
      {
        data: 'defaultValue',
        visible: true,
        width: '10%',
      },
      {
        data: 'inputType',
        visible: true,
        width: '5%',
        render: function (data, type, row) {
          if (data == 0) {
            return '输入框'
          } else {
            return '下拉列表'
          }
        },
      },
      {
        data: 'selectOptions',
        visible: true,
        width: '25%',
      },
      {
        data: 'tip',
        width: '20%',
        visible: true,
      },
      {
        data: 'placeHolder',
        width: '20%',
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

  function createCombox(data) {
    var _html = '<select class="form-control" name="inputType">'
    data.forEach(function (ele, index) {
      _html += '<option ' + ele.key + '>' + ele.value + '</option>'
    })
    _html += '</select>'
    return _html
  }
  comboData = {
    '2': [
      { key: 0, value: '输入框' },
      { key: 0, value: '下拉列表' },
    ],
    '3': [
      { key: 0, value: '是' },
      { key: 1, value: '否' },
    ],
    '4': ['String', 'Long', 'Integer', 'Boolean', 'Date', '当前实体'],
  }

  var table = $('#myTable').DataTable()

  table.MakeCellsEditable({
    onUpdate: myCallbackFunction,
  })
  function myCallbackFunction(updatedCell, updatedRow, oldValue) {
    console.log('The new value for the cell is: ' + updatedCell.data())
    console.log('The old value for that cell was: ' + oldValue)
    console.log(
      'The values for each cell in that row are: ' + updatedRow.data()
    )
  }

  testcasetemplateTable.MakeCellsEditable({
    onUpdate: myCallbackFunction,
    inputCss: 'my-input-class',
    columns: [0, 1, 2, 3, 4, 5, 6, 7],
    allowNulls: {
      columns: [3, 5, 6, 7],
      errorClass: 'error',
    },
    listenToKeys: true,
    inputTypes: [
      {
        column: 1,
        type: 'text',
        options: null,
      },

      {
        column: 2,
        type: 'text',
        type: 'list',
        options: [
          { value: '0', display: '必填' },
          { value: '1', display: '可选' },
        ],
      },
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

  function myCallbackFunction(updatedCell, updatedRow, oldValue) {
    console.log('The new value for the cell is: ' + updatedCell.data())
    console.log('The old value for that cell was: ' + oldValue)
    console.log(
      'The values for each cell in that row are: ' + updatedRow.data()
    )
  }

  function destroyTable() {
    if ($.fn.DataTable.isDataTable('#myAdvancedTable')) {
      table.destroy()
      table.MakeCellsEditable('destroy')
    }
  }

  $('#checkAll').on('click', function () {
    console.log('checkAll')
    $("input[name='show']").each(function () {
      this.checked = true
    })
    var table = $('#testcasetemplate_list').dataTable()
    //获取表中所有行
    var rows = table.fnGetNodes()
    //遍历每一行数据：
    for (var i = 0; i < rows.length; i++) {
      //获取每行中每列的具体数据
      console.log(testcasetemplateTable.row(i).data())
    }
  })

  $('#saveDataSample').on('click', function () {
    var table = $('#testcasetemplate_list').dataTable()
    //获取表中所有行
    var rows = table.fnGetNodes()
    //遍历每一行数据：
    for (var i = 0; i < rows.length; i++) {
      //获取每行中每列的具体数据
      console.log(testcasetemplateTable.row(i).data())
    }
  })
})
