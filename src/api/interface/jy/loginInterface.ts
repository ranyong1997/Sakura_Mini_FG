// 响应参数
export interface Result {
	statusCode: number;
	message: string;
}
// 响应的data
export interface ResultData<T = any> extends Result {
	data: T;
}

// 登录响应参数
export interface loginResData {
	accessToken: string;
	id: string;
}

// 登录的请求参数
export interface loginFormData {
	username: string;
	password: string;
	verCode: string;
	uuid: string;
}

// 验证码
export interface verCodes {
	captcha: string;
	uuid: string;
}
