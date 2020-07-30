var editor
var rowLength = 0
$(function () {
  var role = sessionStorage.getItem('role')
  var user = sessionStorage.getItem('user')

  // init date tables
  var userTable = $('#user_list').dataTable({
    dom:
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-4'l><'col-sm-4'i><'col-sm-4'p>>",
    deferRender: true,
    processing: false,
    serverSide: true,
    pagingType: 'full_numbers',
    ajax: {
      url: base_url + '/user/userPageList',
      type: 'post',
      data: function (d) {
        var obj = {}
        obj.username = $('#userName').val()
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
        width: '7%',
      },
      {
        data: 'username',
        visible: true,
        width: '15%',
      },
      {
        data: 'role',
        visible: true,
        width: '15%',
        render: function (data, type, row) {
          var roleTmp = ''
          if (data == 0) {
            roleTmp = '超级管理员'
          } else if (data == 1) {
            roleTmp = '项目管理员'
          } else if (data == 2) {
            roleTmp = '普通用户'
          }
          return roleTmp
        },
      },
      {
        data: 'createUser',
        visible: true,
        width: '10%',
      },
      {
        data: 'createTimeLong',
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
          var html = ''
          console.log('role' + role)
          if (role == 0 || row.createUser == user) {
            html =
              '<div class="btn-group" _id="' +
              row.id +
              '">\n' +
              '<a href="javascript:void(0);" class="remove" >' +
              '删除' +
              '</a>\n'
          }
          if (role == 0) {
            html +=
              '<a href="javascript:void(0);" class="openJurisdiction" >' +
              '角色分配' +
              '</a>\n' +
              '<a href="javascript:void(0);" class="resetPassword" >' +
              '重置密码' +
              '</a>\n'
            ;('</div>')
          }
          html += '</div>'
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
    console.log(searchBtn)
    userTable.fnDraw()
  })

  $('#clear').on('click', function () {
    $('#searchForm')[0].reset()
  })

  $('#addUser').on('click', function () {
    $('#add-modal').modal('show')
  })

  var addModalValidate = $('#add-modal .form').validate({
    errorElement: 'span',
    errorClass: 'help-block',
    focusInvalid: true,
    rules: {
      username: {
        required: true,
        maxlength: 50,
      },
    },
    messages: {
      name: {
        required: '请输入用户名称',
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
      if (role == 1) {
        $("#add-modal .form input[name='role']").val(2)
      } else {
        $("#add-modal .form input[name='role']").val(role)
      }
      $.post(
        base_url + '/user/addUser',
        $('#add-modal .form').serialize(),
        function (data, status) {
          $('#add-modal').modal('hide')
          if (data.code == 200) {
            layer.msg('创建用户成功')
          } else {
            layer.msg(data.msg || '创建用户失败')
          }
          userTable.fnDraw(false)
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
  $('#user_list').on('click', '.update', function () {
    // show
    var id = $(this).parents('div').attr('_id')
    var row = tableData['key' + id]
    $("#update-modal .form input[name='id']").val(row.id)
    $("#update-modal .form input[name='username']").val(row.username)

    $('#update-modal').modal('show')
  })

  $('#user_list').on('click', '.resetPassword', function () {
    // show
    var id = $(this).parents('div').attr('_id')
    var row = tableData['key' + id]
    layer.confirm(
      '确认重置该用户的密码?',
      {
        icon: 3,
        title: '系统提示',
        btn: ['确定', '取消'],
      },
      function (index) {
        layer.close(index)

        $.ajax({
          type: 'POST',
          url: base_url + '/user/resetPassword',
          data: {
            userId: id,
          },
          dataType: 'json',
          success: function (data) {
            if (data.code == 200) {
              layer.msg('重置密码成功')
              userTable.fnDraw(false)
            } else {
              layer.msg(data.msg || '重置密码失败')
            }
          },
        })
      }
    )
  })

  var updateModalValidate = $('#update-modal .form').validate({
    errorElement: 'span',
    errorClass: 'help-block',
    focusInvalid: true,

    rules: {
      username: {
        required: true,
        maxlength: 50,
      },
    },
    messages: {
      name: {
        required: '请输入用户名称',
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
      $.post(
        base_url + '/user/updateUser',
        $('#update-modal .form').serialize(),
        function (data, status) {
          if (data.code == '200') {
            $('#update-modal').modal('hide')
            layer.msg('修改用户成功')

            userTable.fnDraw(false)
          } else {
            layer.msg(data.msg || '修改用户失败')
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

  $('#user_list').on('click', '.remove', function () {
    var id = $(this).parents('div').attr('_id')
    bootbox.setDefaults('locale', 'zh_CN')

    layer.confirm(
      '确认删除此用户?',
      {
        icon: 3,
        title: '系统提示',
        btn: ['确定', '取消'],
      },
      function (index) {
        layer.close(index)
        $.ajax({
          type: 'POST',
          url: base_url + '/user/deleteUser',
          data: {
            id: id,
          },
          dataType: 'json',
          success: function (data) {
            if (data.code == 200) {
              layer.msg('删除用户成功')
              userTable.fnDraw(false)
            } else {
              layer.msg(data.msg || '删除用户失败')
            }
          },
        })
      }
    )
  })

  $('#user_list').on('click', '.openJurisdiction', function () {
    var id = $(this).parents('div').attr('_id')
    var row = tableData['key' + id]
    $("#jurisdiction-modal .form input[name='id']").val(row.id)
    $("#jurisdiction-modal .form input[name='username']").val(row.username)

    $("#jurisdiction-modal .form select[name='roleName']").val(row.role)

    $('#jurisdiction-modal').modal('show')
  })

  $("select[name='roleName']").on('change', function () {
    var role = $("select[name='roleName']").val()
    $("input[name='role']").val(role)
  })

  var jurisdictionModalValidate = $('#jurisdiction-modal .form').validate({
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
    submitHandler: function (form) {
      if (
        $("input[name='role']").val() == -1 ||
        $("input[name='role']").val() == null ||
        $("input[name='role']").val() == ''
      ) {
        bootbox.alert('请选择角色')
        return
      }
      // post
      $.post(
        base_url + '/user/updateRole',
        $('#jurisdiction-modal .form').serialize(),
        function (data, status) {
          if (data.code == '200') {
            $('#jurisdiction-modal').modal('hide')
            layer.msg('角色分配成功')
            userTable.fnDraw(false)
          } else {
            layer.msg(data.msg || '角色分配失败')
          }
        }
      )
    },
  })
})
