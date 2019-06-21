//根据传入字段获取对应url地址栏参数
export const GetQueryString = name => {
	let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
	let r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return r[2];
	} else {
		return null;
	}
};

export const getPathnameByIndex = (index)=>{
    const pathname = window.location.pathname.split('/');
    if(pathname[index]){
        return pathname[index];
    }else{
        return null;
    }
}