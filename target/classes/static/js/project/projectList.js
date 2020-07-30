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
  var projectTable = $('#project_list').dataTable({
    dom:
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-4'l><'col-sm-4'i><'col-sm-4'p>>",
    deferRender: true,
    processing: false,
    serverSide: true,
    pagingType: 'full_numbers',
    ajax: {
      url: base_url + '/project/projectPageList',
      type: 'post',
      data: function (d) {
        var obj = {}
        obj.name = $('#projectName').val()
        obj.user = user
        obj.role = role
        obj.userId = userId
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
        data: 'scriptType',
        visible: true,
        width: '8%',
      },
      {
        data: 'purpose',
        visible: true,
        width: '8%',
      },
      {
        data: 'status',
        visible: true,
        width: '8%',
      },
      {
        data: 'createUser',
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
          var logHref = base_url + '/dataprepare/jobDetail?jobId=' + row.id
          tableData['key' + row.id] = row
          var html = '<div class="btn-group" _id="' +
              row.id +
              '">\n';
          if (role == 0 || (role == 1 && row.createUser == user)) {
              html+=
              '   <a href="javascript:void(0);" class="update" >' +
              '修改' +
              '</a>\n' +
              '<a href="javascript:void(0);" class="remove" >' +
              '删除' +
              '</a>\n' +
              '<a href="javascript:void(0);" class="member" >' +
              '成员管理' +
              '</a>\n';


          }
          if (role == 2 || (role == 1 && row.createUser != user)) {
            html +=
              '   <a href="javascript:void(0);" class="see" >' +
              '查看' +
              '</div>'

          }
          html+=
          '<a onclick="openProjectDetail('+row.id+')" >' +
          '项目详情' +
          '</a>\n'+'</div>';
          return html;
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
    projectTable.fnDraw()
  })

  $('#clear').on('click', function () {
    $('#searchForm')[0].reset()
  })

  $('#addProject').on('click', function () {
    // init-cronGen
    console.log(1)
    $('#add-modal').modal('show')
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
        required: '请输入项目名称',
      },
      gitposition: {
        required: '请输入项目git地址',
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
      if (role == 0 || role == 1) {
        $.post(
          base_url + '/project/addProject',
          $('#add-modal .form').serialize(),
          function (data, status) {
            if (data.code == '200') {
              $('#add-modal').modal('hide')
              layer.open({
                title: '系统提示',
                btn: ['确定'],
                content: '创建项目成功',
                icon: '1',
                end: function (layero, index) {
                  //$(window).unbind('beforeunload');
                  projectTable.fnDraw()
                },
              })
              //bootbox.alert('创建项目成功', function () {
              //  projectTable.fnDraw()
              //})
            } else {
              layer.open({
                title: '系统提示',
                btn: ['确定'],
                content: data.msg || '创建项目失败',
                icon: '2',
              })
            }
          }
        )
      }
    },
  })

  $('#add-modal').on('hide.bs.modal', function () {
    addModalValidate.resetForm()
    $('#add-modal .form')[0].reset()
    $('#add-modal .form .form-group').removeClass('has-error')
  })

  // update
  $('#project_list').on('click', '.update', function () {
    // show
    var id = $(this).parents('div').attr('_id')
    var row = tableData['key' + id]
    $("#update-modal .form input[name='id']").val(row.id)
    $("#update-modal .form input[name='name']").val(row.name)
    $("#update-modal .form input[name='description']").val(row.description)
    $("#update-modal .form select[name='scriptType']").val(row.scriptType)
    $("#update-modal .form select[name='purpose']").val(row.purpose)
    $("#update-modal .form select[name='testType']").val(row.testType)
    $("#update-modal .form select[name='status']").val(row.status)
    $("#update-modal .form input[name='gitposition']").val(row.gitposition)
    $("#update-modal .form input[name='deleted']").val(row.deleted)
    $('#update-modal').modal('show')
  })

  // update
  $('#project_list').on('click', '.see', function () {
    // show
    var id = $(this).parents('div').attr('_id')
    var row = tableData['key' + id]
    $("#see-modal .form input[name='id']").val(row.id)
    $("#see-modal .form input[name='name']").val(row.name)
    $("#see-modal .form input[name='description']").val(row.description)
    $("#see-modal .form select[name='scriptType']").val(row.scriptType)
    $("#see-modal .form select[name='purpose']").val(row.purpose)
    $("#see-modal .form select[name='testType']").val(row.testType)
    $("#see-modal .form select[name='status']").val(row.status)
    $("#see-modal .form input[name='gitposition']").val(row.gitposition)
    $("#see-modal .form input[name='createUser']").val(row.createUser)
    $("#see-modal .form input[name='createTime']").val(row.createTime)
    $("#see-modal .form input[name='deleted']").val(row.deleted)
    $('#see-modal').modal('show')
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
      gitposition: {
        required: true,
      },
    },
    messages: {
      name: {
        required: '请输入项目名称',
      },
      gitposition: {
        required: '请输入项目git地址',
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
          base_url + '/project/updateProject',
          $('#update-modal .form').serialize(),
          function (data, status) {
            if (data.code == '200') {
              $('#update-modal').modal('hide')
              layer.msg('修改项目成功')
              projectTable.fnDraw()
            } else {
              layer.msg(data.msg || '修改项目失败')
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

  $('#project_list').on('click', '.remove', function () {
    console.log(9)
    var id = $(this).parents('div').attr('_id')
    layer.confirm(
      '确认删除此项目?',
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
            url: base_url + '/project/deleteProject',
            data: {
              id: id,
            },
            dataType: 'json',
            success: function (data) {
              if (data.code == 200) {
                layer.msg('删除项目成功')
                projectTable.fnDraw()
              } else {
                layer.msg(data.msg || '删除项目失败')
              }
            },
          })
        }
      }
    )
  })

  /*成员列表窗口*/
  $('#project_list').on('click', '.member', function () {
    if (role == 0 || role == 1) {
      // show
      projectId = $(this).parents('div').attr('_id')
      $('#member-modal').modal('show')

      userIds = []
      projectIds = []

      //获取已有成员数据
      loadMember()
    }
  })
})

var memberData = null

/*获取当前项目已有成员*/
function loadMember() {
  $.ajax({
    type: 'POST',
    url: base_url + '/projectUser/projectUserList',
    data: JSON.stringify({
      projectId: projectId,
    }),
    contentType: 'application/json',
    dataType: 'JSON',
    success: function (data) {
      $('#member_list').empty()
      memberData = data

      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          var rows =
            "<a id='" +
            data[i].id +
            "' onclick='removeMember(" +
            data[i].id +
            ")' style='display: flex;width: 100%'><span style='width: 100%;padding:5px;border-bottom:1px solid #d2d6de;color:black'>" +
            data[i].username +
            '</span>'
          $('#member_list').append(rows)
        }
      } else {
        $('#member_list').append('暂无数据')
      }

      //获取成员列表数据
      loadUser()
    },
  })
}

/*获取用户列表  成员列表*/
function loadUser() {
  $.ajax({
    type: 'POST',
    url: base_url + '/user/getUserList',
    success: function (data) {
      var add = true
      $('#user_list').empty()
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          add = true
          if (memberData != null && memberData.length > 0) {
            for (var j = 0; j < memberData.length; j++) {
              if (data[i].id == memberData[j].userId) {
                add = false
              }
            }
          }

          if (add == true) {
            var rows =
              "<div id='" +
              data[i].id +
              "' onclick='addMember(" +
              data[i].id +
              ")' style='display: flex;width: 100%'><span style='width: 100%;padding:5px;border-bottom:1px solid #d2d6de;color:black'>" +
              data[i].username +
              '</span></div>'
            $('#user_list').append(rows)
          }
        }
      } else {
        $('#user_list').append('暂无数据')
      }
    },
  })
}

function addMember(id) {
  var addClass = 0 //添加样式
  var idspan = '#' + id
  idspan = idspan + ' span'
  if (userIds.length > 0) {
    for (var i = 0; i < userIds.length; i++) {
      if (userIds[i] == id) {
        addClass = 1 //移除样式
      }
    }

    if (addClass == 0) {
      $(idspan).css('background-color', '#3c8dbc')
      $(idspan).css('color', 'white')
      userIds.push(id)
    } else if (addClass == 1) {
      $(idspan).css('background-color', 'white')
      $(idspan).css('color', 'black')
      userIds.splice(userIds.indexOf(id), 1)
    }
  } else {
    $(idspan).css('background-color', '#3c8dbc')
    $(idspan).css('color', 'white')
    userIds.push(id)
  }
}

var removeIds = []
function removeMember(id) {
  var removeClass = 0 //添加样式
  var idspan = '#' + id
  idspan = idspan + ' span'
  if (removeIds.length > 0) {
    for (var i = 0; i < removeIds.length; i++) {
      if (removeIds[i] == id) {
        removeClass = 1 //移除样式
      }
    }

    if (removeClass == 0) {
      $(idspan).css('background-color', '#3c8dbc')
      $(idspan).css('color', 'white')
      removeIds.push(id)
    } else if (removeClass == 1) {
      $(idspan).css('background-color', 'white')
      $(idspan).css('color', 'black')
      removeIds.splice(removeIds.indexOf(id), 1)
    }
  } else {
    $('#' + id).css('background-color', '#3c8dbc')
    $(idspan).css('color', 'white')
    removeIds.push(id)
  }
}

/*新增*/
$('#member_add').on('click', function () {
  if (userIds.length <= 0) {
    bootbox.alert('请选择要添加的成员', function () {
      return
    })
  }

  projectIds.push(projectId)
  $.ajax({
    type: 'POST',
    url: base_url + '/projectUser/addProjectUser',
    data: JSON.stringify({
      projectIds: projectIds,
      userIds: userIds,
    }),
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      if (data.code == 200) {
        userIds = []
        projectIds = []
        removeIds = []
        loadMember()
        loadUser()
      } else {
        bootbox.alert('新增成员失败')
      }
    },
  })
})

/*移除*/
$('#member_remove').on('click', function () {
  if (removeIds.length <= 0) {
    bootbox.alert('请选择要移除的成员', function () {
      return
    })
  }
  $.ajax({
    type: 'POST',
    url: base_url + '/projectUser/deleteProjectUser',
    data: JSON.stringify({
      removeIds: removeIds,
    }),
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      if (data.code == 200) {
        userIds = []
        projectIds = []
        removeIds = []
        loadMember()
        loadUser()
      } else {
        bootbox.alert('移除成员失败')
      }
    },
  })
})

function openProjectDetail(id){
  window.location.href=base_url+"/project/projectDetail?projectId="+id;
}