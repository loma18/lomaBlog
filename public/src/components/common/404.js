import React, { Component } from 'react';

export default () => {
	return (
		<div
			style={{
				position: 'relative',
				height: 'calc(100vh - 240px)',
				textAlign: 'center'
			}}
		>
			<span
				style={{
					display: 'inline-block',
					position: 'absolute',
					top: '50%',
					left: '50%',
					zIndex: 1000,
					transform: 'translate(-50%,-50%)'
				}}
			>
				啊哦404耶,找不到你要的页面哦~
			</span>
		</div>
	);
};
