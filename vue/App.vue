<template>
	<el-container style="height: 1000px; border: 1px solid #eee">
		<el-aside width="200px" style="background-color: rgb(238, 241, 246)">
			<el-menu >
				<el-submenu index="1">
					<template slot="title"><i class="el-icon-upload"></i>出售</template>
					<router-link to="/sellDataset">
						<el-menu-item index="1-1">出售数据集</el-menu-item>
					</router-link>
					<router-link to="/checkPhurchaseRequest">
						<el-menu-item index="1-2">检查购买请求</el-menu-item>
					</router-link>
					
				</el-submenu>
				<el-submenu index="2">
					<template slot="title"><i class="el-icon-goods"></i>购买</template>
					<router-link to="/getAllDataset">
						<el-menu-item index="2-1">获取待售数据集列表</el-menu-item>
					</router-link>
					<router-link to="/checkPhurchaseResponse">
						<el-menu-item index="2-2">检查购买响应</el-menu-item>
					</router-link>
					
				</el-submenu>
			</el-menu>
		</el-aside>
		
		<el-container>
			<el-header style="text-align: right; font-size: 12px">
				<el-dropdown>
					<i class="el-icon-setting" style="margin-right: 15px"></i>
					<el-dropdown-menu slot="dropdown">
						<router-link to="/login">
							<el-dropdown-item>登录</el-dropdown-item>
						</router-link>
						
						<el-dropdown-item>新增</el-dropdown-item>
						<el-dropdown-item>删除</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<span>This is Header area!!</span>
			</el-header>
			
			<el-main>
				<p>This is main area!</p>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
