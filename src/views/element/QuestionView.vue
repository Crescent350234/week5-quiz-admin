<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="题干">
        <el-input v-model="formInline.title" placeholder="请输入题干关键字" clearable></el-input>
      </el-form-item>
      <el-form-item label="题型">
        <el-select v-model="formInline.type" placeholder="题型" clearable>
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

    <el-table :data="filteredData" style="width: 100%">
      <el-table-column label="创建日期" width="150">
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
      <el-table-column prop="answer" label="答案" width="160"></el-table-column>
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
      <el-form ref="questionForm" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="题干" prop="title">
          <el-input v-model="form.title" type="textarea" :rows="2" placeholder="请输入题干"></el-input>
        </el-form-item>
        <el-form-item label="题型" prop="type">
          <el-select v-model="form.type" placeholder="请选择题型" style="width: 100%">
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
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
        { date: '2026-10-09', title: 'Vue 中用于双向数据绑定的指令是？', type: '单选', answer: 'v-model' },
        { date: '2026-10-10', title: '下列属于 Vue 生命周期钩子的有？', type: '多选', answer: 'created、mounted' },
        { date: '2026-10-11', title: 'Vue 是一款渐进式 JavaScript 框架。', type: '判断', answer: '正确' },
        { date: '2026-10-12', title: 'ElementUI 是基于 Vue 的桌面端组件库。', type: '判断', answer: '正确' }
      ],
      pageSize: 10,
      currentPage: 1,
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      editRow: null,
      form: { title: '', type: '', answer: '' },
      rules: {
        title: [{ required: true, message: '请输入题干', trigger: 'blur' }],
        type: [{ required: true, message: '请选择题型', trigger: 'change' }],
        answer: [{ required: true, message: '请输入答案', trigger: 'blur' }]
      }
    }
  },
  computed: {
    filteredData() {
      const kw = this.formInline.title.trim()
      const type = this.formInline.type
      return this.tableData.filter(item => {
        const matchTitle = !kw || item.title.indexOf(kw) !== -1
        const matchType = !type || item.type === type
        return matchTitle && matchType
      })
    }
  },
  methods: {
    onSubmit() {
      this.currentPage = 1
      if (this.filteredData.length === 0) {
        this.$message.warning('没有找到符合条件的题目')
      } else {
        this.$message.success('查询完成，共找到 ' + this.filteredData.length + ' 道题目')
      }
    },
    handleAdd() {
      this.dialogTitle = '添加题目'
      this.isEdit = false
      this.editRow = null
      this.form = { title: '', type: '', answer: '' }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.questionForm.clearValidate()
      })
    },
    handleEdit(row) {
      this.dialogTitle = '编辑题目'
      this.isEdit = true
      this.editRow = row
      this.form = { title: row.title, type: row.type, answer: row.answer }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.questionForm.clearValidate()
      })
    },
    handleSave() {
      this.$refs.questionForm.validate(valid => {
        if (!valid) return
        if (this.isEdit) {
          this.editRow.title = this.form.title
          this.editRow.type = this.form.type
          this.editRow.answer = this.form.answer
          this.$message.success('修改成功')
        } else {
          const now = new Date()
          const pad = n => (n < 10 ? '0' + n : '' + n)
          const dateStr = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate())
          this.tableData.push({
            date: dateStr,
            title: this.form.title,
            type: this.form.type,
            answer: this.form.answer
          })
          this.$message.success('添加成功')
        }
        this.dialogVisible = false
      })
    },
    handleDelete(row) {
      this.$confirm('确定删除该题目吗？', '提示', { type: 'warning' })
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
