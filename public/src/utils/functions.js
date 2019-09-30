export const changeTheme = theme => {
	document.body.setAttribute('class', theme);
};

export const isApp = () => {
	return (
		/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
			navigator.userAgent
		) || window.innerWidth < 768
	);
};
