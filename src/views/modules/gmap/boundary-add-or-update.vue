<template>
    <el-dialog
        title="新增边界"
        :visible.sync="visible"
        :append-to-body="true">
        <el-form :model="dataForm" ref="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmit()" :inline="true" label-width="120px">
            <el-form-item label="周界类型">
                <el-select v-model="dataForm.type" placeholder="请选择周界类型">
                    <el-option label="楼宇周界" :value=0></el-option>
                    <el-option label="区域周界" :value=3></el-option>
                    <el-option label="预警周界" :value=4></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="建筑层数" prop="layer">
                <el-input-number v-model="dataForm.layer" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="每层高度" prop="height">
                <el-input-number v-model="dataForm.height" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="楼幢颜色" prop="color">
                <el-color-picker v-model="dataForm.color" show-alpha></el-color-picker>
            </el-form-item>
            <el-form-item label="选中颜色" prop="selectedColor">
                <el-color-picker v-model="dataForm.selectedColor" show-alpha></el-color-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <el-button @click="cancelHandle()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'boundary-add',
    props: {
        geomText: {
            type: String,
            required: false
        }
    },
    data () {
        const validateLayer = (rule, value, callback) => {
            if (value < 1) {
                callback(new Error('层数不能小于1'))
            } else {
                callback()
            }
        }
        const validateHeight = (rule, value, callback) => {
            if (value < 1) {
                callback(new Error('层数高度不能小于1'))
            } else {
                callback()
            }
        }
        return {
            visible: false,
            dataForm: {
                gid: 0,
                pid: 0,
                name: 'test',
                layer: 5,
                height: 100,
                level: 7,
                type: 0,
                color: 'rgba(75, 255, 255, 0.4)',
                selectedColor: 'rgba(100, 150, 180, 0.8)',
                areaCode: 'test'
            },
            dataRule: {
                type: [
                    { required: true, message: '必填字段', trigger: 'blur' }
                ],
                layer: [
                    { required: true, message: '层数不能小于1', trigger: 'blur' },
                    { validator: validateLayer, trigger: 'blur' }
                ],
                height: [
                    { required: true, message: '层数高度不能小于1', trigger: 'blur' },
                    { validator: validateHeight, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        init (id, type, level, pid) {
            if (id) {
                this.$http({
                    url: this.$http.adornUrl(`/geo/boundary/info/${id}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.dataForm.gid = data.boundary.gid
                        this.dataForm.pid = data.boundary.pid
                        this.dataForm.name = data.boundary.name
                        this.dataForm.layer = data.boundary.layer
                        this.dataForm.height = data.boundary.height
                        this.dataForm.level = data.boundary.level
                        this.dataForm.type = data.boundary.type
                        this.dataForm.color = data.boundary.color
                        this.dataForm.selectedColor = data.boundary.selectedColor
                        this.dataForm.areaCode = data.boundary.areaCode
                    }
                })
            } else {
                this.dataForm.pid = pid
                this.dataForm.level = level
                this.dataForm.type = type
                this.dataForm.geomText = this.geomText
            }
            this.dataForm.gid = id || 0
            this.visible = true
        },

        dataFormSubmit () {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/geo/boundary/${!this.dataForm.gid ? 'save' : 'update'}`),
                        method: 'post',
                        data: this.$http.adornData(this.dataForm)
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false
                                    this.$emit('refreshDataList')
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }
            })
        },

        cancelHandle () {
            this.visible = false
            this.$emit('refreshDataList')
        }
    }
}
</script>
