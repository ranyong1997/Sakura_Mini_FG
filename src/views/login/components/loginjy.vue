<template>
	<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large" class="jy-form">
		<el-divider />
		<el-form-item prop="username">
			<el-input v-model="loginForm.username" placeholder="用户名：admin / user">
				<template #prefix>
					<el-icon class="el-input__icon"><user /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input type="password" v-model="loginForm.password" placeholder="密码：123456" show-password autocomplete="new-password">
				<template #prefix>
					<el-icon class="el-input__icon"><lock /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="verCode" class="vercode">
			<el-input maxlength="4" type="text" v-model="loginForm.verCode" placeholder="请输入验证码" clearable> </el-input>
			<el-image class="login-code" :src="codeUrl" @click="getCode"> </el-image>
		</el-form-item>
		<el-form-item>
			<el-button :icon="UserFilled" round @click="login(loginFormRef)" size="large" type="primary" :loading="loading">
				登录
			</el-button>
		</el-form-item>
	</el-form>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { UserFilled } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";

import { ElNotification } from "element-plus";

import http from "@/api";
import { loginResData, loginFormData, verCodes } from "@/api/interface/jy/loginInterface";

// import { Login } from "@/api/interface/index";

const loginFormRef = ref<FormInstance>(); // 定义表单对象
const loading = ref(false);

const codeUrl = ref("");
const loginForm = reactive<loginFormData>({
	username: "long",
	password: "vyykaCZy",
	verCode: "",
	uuid: ""
});
const loginRules = reactive({
	username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
	verCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
	password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

// 登录的方法
const login = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			// loading.value = true;
			console.log("submit!");
			// const { data, message } = await http.bpost<loginResData>("/bdg01/auth/jwt/token", loginForm, {
			// 	headers: { noLoading: true }
			// });
			const { data, message, statusCode } = await http.post<loginResData>("/bdg01/auth/jwt/token", loginForm, {
				headers: { noLoading: true }
			});
			console.log("xxxxxxxxxxxx", data, message, statusCode);
			if (data == null) {
				ElNotification.error({
					title: "sorry " + message,
					position: "bottom-right"
				});
			} else {
				ElNotification.success({
					title: "登录成功",
					position: "bottom-right"
				});
			}
		} else {
			console.log("error submit!", fields);
		}
	});
};

// 获取验证码
const getCode = async () => {
	const { data } = await http.get<verCodes>("/bdg01/auth/captcha", {}, { headers: { noLoading: true } });
	if (data != null) {
		loginForm.verCode = "";
		codeUrl.value = "data:image/gif;base64," + data.captcha;
		loginForm.uuid = data.uuid;
	}
};
onMounted(() => {
	getCode();
	document.addEventListener("keyup", (e: any) => {
		e = window.event || e;
		if (e.code.includes("nter")) {
			// if (loading.value) return;
			login(loginFormRef.value);
		}
	});
});
</script>

<style lang="scss" scoped>
.jy-form {
	margin-top: 20px;
}
</style>
