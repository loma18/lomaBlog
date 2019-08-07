import { action, observable } from 'mobx';

class AppStore {
	@observable
	loading;
	@observable
	isBackStage;

	constructor() {
		this.loading = false;
		this.isLogined = false;
		this.isBackStage = window.localStorage.getItem('isBackStage') || window.location.pathname.split('/')[1] == 'admin'
	}

	@action.bound
	loginSubmit = (values) => {
		window.localStorage.clear();
		this.isLogined = true;
	};

	// 全局加载
	@action
	showLoading = () => {
		this.loading = true;
	};

	@action
	hideLoading = () => {
		this.loading = false;
	};

	@action
	setBackStage = (isBackStage) => {
		this.isBackStage = isBackStage;
		window.localStorage.setItem('isBackStage', isBackStage);
	}
}

const appStore = new AppStore();

export default appStore;
export { AppStore };
