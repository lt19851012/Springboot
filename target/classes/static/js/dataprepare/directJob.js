var tableData = {}
var dataItems;
var dataItems2;
let templateMainName;
$(function () {
  // init date tables
  var role = sessionStorage.getItem('role')
  var user = sessionStorage.getItem('user')
  var userId = sessionStorage.getItem('userId')

  $('#projectId2 option[value=' + projectId + ']').prop('selected', true)
  $('#projectId2').change()

  //根据projectId获取对应的test_case数据

  var tempMainTableData2 = $('#template_list2').dataTable({
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
        obj.start = d.start
        obj.projectId = $("select[name='projectId2']").val()
        obj.testCaseId = $("select[name='testCaseId2']").val()
        obj.templateMainName = $("input[name='templateMainName']").val()
        obj.length = d.length
        return obj
      },
    },
    searching: false,
    ordering: false,
    //"scrollX": true,	// scroll x，close self-adaption
    columns: [
      {
        data: 'name',
        visible: true,
        width: '25%',
      },
      {
        data: 'descripe',
        visible: true,
        width: '25%',
      },
      {
        data: 'id',
        visible: true,
        width: '15%',
        render: function (data, type, row) {
          tempMainTableData2['key' + row.id] = row
          var html = '<div class="btn-group" _id="' +
              row.id +
              '">\n' +
              '<a href="javascript:void(0);" class="create2" >' +
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
          $('#createDataItems2').html('')
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

              $('#createDataItems2').append(formItem)
              $('#createDataItems2').validate()

              if (dataItems[n].required == 1) {
                console.log('id' + n)
                console.log($('#id' + n))
                setTimeout(function (){
                  $('#id' + n).rules('add', {
                    required: true,
                    messages: {
                      required: value.name + '不能为空',
                    },
                  })
                },0)
              }
              if (dataItems[n].defaultValue != null) {
                $('#id' + n).val(dataItems[n].defaultValue)
              }

              $('#createDataModal').modal('show')


            }
          })

        } else {
          layer.alert(data.msg || '获取模板失败')
        }
      },
    })


  })

  $('#template_list2 ').on('click', '.create2', function () {
    let id = $(this).parents('div').attr('_id')
    let row = tempMainTableData2['key' + id]

    //回填名称和描述
    $("#directModal input[name='name2']").val(row.name)
    $("#directModal input[name='id2']").val(row.id)

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
          $('#createDataItems2').html('')
          dataItems2 = data
          $.each(dataItems2, function (n, value) {
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

              $('#createDataItems2').append(formItem)
              $('#createDataItems2').validate()

              if (dataItems2[n].required == 1) {
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
              if (dataItems2[n].defaultValue != null) {
                $('#id' + n).val(dataItems2[n].defaultValue)
              }

              $('#directModal').modal('show')


            }
          })

        } else {
          layer.alert(data.msg || '获取模板失败')
        }
      },
    })


  })

  jQuery.validator.addMethod("positiveinteger",function (value,element){
     let val = parseInt(value);
     return val>0 && (val+"") == value;
  },"请输入正整数")

  var addModalValidate = $('#createDataForm').validate({
    errorElement: 'span',
    errorClass: 'help-block',
    focusInvalid: true,
    rules: {
      name: {
        required: true,
        maxlength: 50,
      }
    },
    messages: {
      name: {
        required: '请输入名称',
      }
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
      dataSample.templateMainId = $("#createDataForm input[name='id']").val()//模板id
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

  $('#directModal .form').validate({
    errorElement: 'span',
    errorClass: 'help-block',
    focusInvalid: true,
    rules: {
      name2: {
        required: true,
        maxlength: 50,
      },
      number:{
        required:true,
        number:true,
        positiveinteger:true
      }

    },
    messages: {
      name2: {
        required: '请输入名称',
      },
      number: {
        required: '请输入数字',
        number: '只支持数字',
        positiveinteger:"只支持正整数"
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
      var id = $("#directModal input[name='id2']").val()
      var row = tempMainTableData2['key' + id]

      var itemObject = new Object()

      for (var i = 0; i < dataItems2.length; i++) {
        if (dataItems2[i].inputType == 0 || dataItems2[i].inputType == null) {
          itemObject[dataItems2[i].id] = $(
              "#directModal input[name='" + i + "']"
          ).val()
        } else {
          itemObject[dataItems2[i].id] = $(
              "#directModal select[name='" + i + "']"
          ).val()
        }
      }

      var data = JSON.stringify({
        id:row.id,//当前数据id
        name: $("#directModal input[name='name2']").val(),
        number: $("#directModal input[name='number']").val(),
        params:itemObject
      })

      $.ajax({
        type: 'POST',
        async: false, // async, avoid js invoke pagelist before jobId data init
        url: base_url + '/dataprepare/directSubmitJob',
        data: data,
        contentType: 'application/json',
        dataType:'JSON',
        success: function (data) {
          if (data.code == 200) {
            layer.msg('创建任务成功')
            $('#directModal').modal('hide')
            tempMainTableData2.fnDraw()
          } else {
            layer.msg(data.msg || '创建任务失败')
          }
        }
      });
    },
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


  $('#projectId2').on('change', function () {
    var projectIdCur = $(this).children('option:selected').val()
    $(this).val($(this).children('option:selected').val())

    $('#testCaseId2').html('')
    var testCaseExisted = false
    $.each(testCaseArray, function (n, value) {
      if (value.projectId == projectIdCur) {
        testCaseExisted = true
        $('#testCaseId2').append(
            '<option value="' + value.id + '" >' + value.testName + '</option>'
        )
        projectid = value.projectId;
        testCaseId = value.id;
      }
    })

    tempMainTableData2.fnDraw()

  })


  $('#testCaseId2').on('change', function () {
    var testCaseIdCur = $(this).children('option:selected').val()
    $(this).val($(this).children('option:selected').val())

    var testCaseExisted = false
    $.each(testCaseArray, function (n, value) {
      if (value.testCaseId == testCaseIdCur) {
        testCaseExisted = true
        $("select[name='testCaseId2']").val(testCaseId)
      }
    })
    tempMainTableData2.fnDraw()

  })


  $('#templateMainName').on('blur', function () {
      templateMainName = $("input[name='templateMainName']").val();
      tempMainTableData2.fnDraw()
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

    $('#cronTime').val(row.cron)
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

