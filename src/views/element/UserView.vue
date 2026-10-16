<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="formInline.user" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询用户</el-button>
        <el-button type="success" @click="handleAdd">添加用户</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="日期" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>用户名: {{ scope.row.username }}</p>
            <p>密码: {{ scope.row.password }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.username }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="password" label="密码"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :total="1000"
    ></el-pagination>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form ref="userForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="region">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserView',
  data() {
    return {
      formInline: {
        user: '',
        region: ''
      },
      tableData: [
        { date: '2016-05-02', username: '王小虎', password: '123456' },
        { date: '2016-05-04', username: '王小虎', password: '123456' },
        { date: '2016-05-01', username: '王小虎', password: '123456' },
        { date: '2016-05-03', username: '王小虎', password: '123456' }
      ],
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      editIndex: -1,
      form: { username: '', password: '', region: '' },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        region: [{ required: true, message: '请选择活动区域', trigger: 'change' }]
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('查询用户:', this.formInline)
    },
    handleAdd() {
      this.dialogTitle = '添加用户'
      this.isEdit = false
      this.form = { username: '', password: '', region: '' }
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      this.dialogTitle = '编辑用户'
      this.isEdit = true
      this.editIndex = index
      this.form = { username: row.username, password: row.password, region: '' }
      this.dialogVisible = true
    },
    handleSave() {
      this.$refs.userForm.validate(valid => {
        if (!valid) return
        if (this.isEdit) {
          const row = this.tableData[this.editIndex]
          row.username = this.form.username
          row.password = this.form.password
          this.$message.success('修改成功')
        } else {
          this.tableData.push({
            date: '2016-05-05',
            username: this.form.username,
            password: this.form.password
          })
          this.$message.success('添加成功')
        }
        this.dialogVisible = false
      })
    },
    handleDelete(index) {
      this.$confirm('确定删除该用户吗？', '提示', { type: 'warning' })
        .then(() => {
          this.tableData.splice(index, 1)
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
