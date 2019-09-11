<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="dataForm.areaCode" placeholder="地址编码" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
                <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            style="width: 100%;">
            <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50">
            </el-table-column>
            <el-table-column
                prop="areaCode"
                header-align="center"
                align="center"
                label="地址编码">
            </el-table-column>
            <el-table-column
                prop="name"
                header-align="center"
                align="center"
                label="名称">
            </el-table-column>
            <el-table-column
                prop="type"
                header-align="center"
                align="center"
                label="类型">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.type === 0" size="small">楼宇周界</el-tag>
                    <el-tag v-else-if="scope.row.type === 1" size="small" type="success">单元周界</el-tag>
                    <el-tag v-else-if="scope.row.type === 2" size="small" type="warning">房屋周界</el-tag>
                    <el-tag v-else-if="scope.row.type === 3" size="small" type="info">区域周界</el-tag>
                    <el-tag v-else-if="scope.row.type === 4" size="small" type="danger">预警周界</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="layer"
                header-align="center"
                align="center"
                label="层数">
            </el-table-column>
            <el-table-column
                prop="color"
                header-align="center"
                align="center"
                label="颜色">
            </el-table-column>
            <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="300"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="toUnitCollection(scope.row.gid)">单元采集</el-button>
                    <el-button type="text" size="small" @click="toHouseCollection(scope.row.gid)">房屋采集</el-button>
                    <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.gid)">修改</el-button>
                    <el-button  type="text" size="small" @click="showHandle(scope.row.gid)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <add-or-update-boundary v-if="addOrUpdateVisible" ref="updateBoundary" @refreshDataList="getDataList"></add-or-update-boundary>
    </div>
</template>

<script>
import AddOrUpdateBoundary from './boundary-add-or-update'

export default {
    name: 'boundary',
    data () {
        return {
            dataListLoading: false,
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListSelections: [],
            addOrUpdateVisible: false,
            dataForm: {
                areaCode: ''
            }
        }
    },
    components: {
        AddOrUpdateBoundary
    },

    activated () {
        this.getDataList()
    },
    methods: {
        // 获取数据列表
        getDataList () {
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/geo/boundary/list'),
                method: 'get',
                params: this.$http.adornParams({
                    'page': this.pageIndex,
                    'limit': this.pageSize,
                    'areaCode': this.dataForm.areaCode
                })
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    this.dataList = data.page.list
                    this.totalPage = data.page.totalCount
                } else {
                    this.dataList = []
                    this.totalPage = 0
                }
                this.dataListLoading = false
            })
        },
        // 每页数
        sizeChangeHandle (val) {
            this.pageSize = val
            this.pageIndex = 1
            this.getDataList()
        },
        // 当前页
        currentChangeHandle (val) {
            this.pageIndex = val
            this.getDataList()
        },
        // 多选
        selectionChangeHandle (val) {
            this.dataListSelections = val
        },

        deleteHandle (id) {
            let boundaryIds = id ? [id] : this.dataListSelections.map(item => {
                return item.gid
            })
            this.$confirm(`确定对[id=${boundaryIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/geo/boundary/delete'),
                    method: 'post',
                    data: this.$http.adornData(boundaryIds, false)
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.getDataList()
                            }
                        })
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            }).catch(() => {
            })
        },

        addOrUpdateHandle (id) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.updateBoundary.init(id)
            })
        },

        showHandle (id) {
            this.$store.commit('common/updateMenuActiveName', 'home')
            this.$router.push({ name: 'gmap-display', params: { gid: id } })
        },

        toUnitCollection (id) {
            this.$store.commit('common/updateMenuActiveName', 'geo-collection')
            this.$router.push({ name: 'geo-collection', params: { gid: id, level: 8, type: 1 } })
        },

        toHouseCollection (id) {
            this.$store.commit('common/updateMenuActiveName', 'geo-collection')
            this.$router.push({ name: 'geo-collection', params: { gid: id, level: 9, type: 2 } })
        }
    }
}
</script>
