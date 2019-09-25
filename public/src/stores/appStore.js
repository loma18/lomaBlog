import { action, observable } from 'mobx';

class AppStore {
	@observable
	loading;
	@observable
	isBackStage;
	@observable
	helpMac;

	constructor() {
		this.loading = false;
		this.isLogined = false;
		this.isBackStage =
			window.localStorage.getItem('isBackStage') ||
			window.location.pathname.split('/')[1] == 'admin';
		if (!window.localStorage.getItem('helpMac')) {
			let randomNum = Math.floor(Math.random() * 100000000);
			window.localStorage.setItem('helpMac', randomNum);
			this.helpMac = randomNum;
		}
	}

	@action.bound
	loginSubmit = values => {
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
	setBackStage = isBackStage => {
		this.isBackStage = isBackStage;
		window.localStorage.setItem('isBackStage', isBackStage);
	};

	@action
	setDocumentTitle = title => {
		document.title = title ? title + '|xiange的博客' : 'xiange的博客';
	};
}

const appStore = new AppStore();

export default appStore;
export { AppStore };
