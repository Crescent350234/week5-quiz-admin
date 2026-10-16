<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="题干">
        <el-input v-model="formInline.title" placeholder="题干"></el-input>
      </el-form-item>
      <el-form-item label="题型">
        <el-select v-model="formInline.type" placeholder="题型">
          <el-option label="单选题" value="单选"></el-option>
          <el-option label="多选题" value="多选"></el-option>
          <el-option label="判断题" value="判断"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询题目</el-button>
        <el-button type="success" @click="handleAdd">添加题目</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="日期" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="题干">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>题型: {{ scope.row.type }}</p>
            <p>答案: {{ scope.row.answer }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.title }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="题型" width="100"></el-table-column>
      <el-table-column prop="answer" label="答案" width="140"></el-table-column>
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
      <el-form ref="questionForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="题干" prop="title">
          <el-input v-model="form.title" placeholder="请输入题干"></el-input>
        </el-form-item>
        <el-form-item label="题型" prop="type">
          <el-select v-model="form.type" placeholder="请选择题型">
            <el-option label="单选题" value="单选"></el-option>
            <el-option label="多选题" value="多选"></el-option>
            <el-option label="判断题" value="判断"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input v-model="form.answer" placeholder="请输入答案"></el-input>
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
  name: 'QuestionView',
  data() {
    return {
      formInline: {
        title: '',
        type: ''
      },
      tableData: [
        { date: '2016-05-02', title: 'Vue 中用于双向绑定的指令是？', type: '单选', answer: 'v-model' },
        { date: '2016-05-04', title: 'Vue 的生命周期钩子包括哪些？', type: '多选', answer: 'created, mounted' },
        { date: '2016-05-01', title: 'Vue 是渐进式框架。', type: '判断', answer: '正确' },
        { date: '2016-05-03', title: 'ElementUI 是基于 Vue 的组件库。', type: '判断', answer: '正确' }
      ],
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      editIndex: -1,
      form: { title: '', type: '', answer: '' },
      rules: {
        title: [{ required: true, message: '请输入题干', trigger: 'blur' }],
        type: [{ required: true, message: '请选择题型', trigger: 'change' }],
        answer: [{ required: true, message: '请输入答案', trigger: 'blur' }]
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('查询题目:', this.formInline)
    },
    handleAdd() {
      this.dialogTitle = '添加题目'
      this.isEdit = false
      this.form = { title: '', type: '', answer: '' }
      this.dialogVisible = true
    },
    handleEdit(index, row) {
      this.dialogTitle = '编辑题目'
      this.isEdit = true
      this.editIndex = index
      this.form = { title: row.title, type: row.type, answer: row.answer }
      this.dialogVisible = true
    },
    handleSave() {
      this.$refs.questionForm.validate(valid => {
        if (!valid) return
        if (this.isEdit) {
          const row = this.tableData[this.editIndex]
          row.title = this.form.title
          row.type = this.form.type
          row.answer = this.form.answer
          this.$message.success('修改成功')
        } else {
          this.tableData.push({
            date: '2016-05-05',
            title: this.form.title,
            type: this.form.type,
            answer: this.form.answer
          })
          this.$message.success('添加成功')
        }
        this.dialogVisible = false
      })
    },
    handleDelete(index) {
      this.$confirm('确定删除该题目吗？', '提示', { type: 'warning' })
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
