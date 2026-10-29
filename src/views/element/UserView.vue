<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="formInline.user" placeholder="请输入用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询用户</el-button>
        <el-button type="success" @click="handleAdd">添加用户</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="filteredData" style="width: 100%">
      <el-table-column label="创建日期" width="150">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="160">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>用户名: {{ scope.row.username }}</p>
            <p>活动区域: {{ scope.row.region === 'shanghai' ? '区域一' : '区域二' }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.username }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="密码" width="140">
        <template slot-scope="scope">
          <span>******</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="filteredData.length"
      :current-page.sync="currentPage"
    ></el-pagination>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="480px" top="8vh" :close-on-click-modal="false">
      <el-form ref="userForm" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码（6-16位）"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" show-password placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="region">
          <el-select v-model="form.region" placeholder="请选择活动区域" style="width: 100%">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserView',
  data() {
    const validateConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      formInline: {
        user: ''
      },
      tableData: [
        { date: '2026-10-09', username: '张伟', password: 'zw135246', region: 'shanghai' },
        { date: '2026-10-10', username: '李娜', password: 'ln246813', region: 'beijing' },
        { date: '2026-10-11', username: '王强', password: 'wq975318', region: 'shanghai' },
        { date: '2026-10-12', username: '刘婷', password: 'lt864209', region: 'beijing' }
      ],
      pageSize: 10,
      currentPage: 1,
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      editRow: null,
      form: { username: '', password: '', confirmPassword: '', region: '' },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度为 6 到 16 位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validateConfirm, trigger: 'blur' }
        ],
        region: [{ required: true, message: '请选择活动区域', trigger: 'change' }]
      }
    }
  },
  computed: {
    filteredData() {
      const kw = this.formInline.user.trim()
      if (!kw) return this.tableData
      return this.tableData.filter(item => item.username.indexOf(kw) !== -1)
    }
  },
  methods: {
    onSubmit() {
      this.currentPage = 1
      if (this.filteredData.length === 0) {
        this.$message.warning('没有找到符合条件的用户')
      } else {
        this.$message.success('查询完成，共找到 ' + this.filteredData.length + ' 位用户')
      }
    },
    handleAdd() {
      this.dialogTitle = '添加用户'
      this.isEdit = false
      this.editRow = null
      this.form = { username: '', password: '', confirmPassword: '', region: '' }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate()
      })
    },
    handleEdit(row) {
      this.dialogTitle = '编辑用户'
      this.isEdit = true
      this.editRow = row
      this.form = { username: row.username, password: row.password, confirmPassword: '', region: row.region }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate()
      })
    },
    handleSave() {
      this.$refs.userForm.validate(valid => {
        if (!valid) return
        // 保存时只存数据，页面上密码始终以 * 显示
        if (this.isEdit) {
          this.editRow.username = this.form.username
          this.editRow.password = this.form.password
          this.editRow.region = this.form.region
          this.$message.success('修改成功')
        } else {
          const now = new Date()
          const pad = n => (n < 10 ? '0' + n : '' + n)
          const dateStr = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate())
          this.tableData.push({
            date: dateStr,
            username: this.form.username,
            password: this.form.password,
            region: this.form.region
          })
          this.$message.success('添加成功')
        }
        this.dialogVisible = false
      })
    },
    handleDelete(row) {
      this.$confirm('确定删除该用户吗？', '提示', { type: 'warning' })
        .then(() => {
          const index = this.tableData.indexOf(row)
          if (index !== -1) this.tableData.splice(index, 1)
          this.$message.success('删除成功')
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.pagination {
  margin-top: 16px;
}
</style>
