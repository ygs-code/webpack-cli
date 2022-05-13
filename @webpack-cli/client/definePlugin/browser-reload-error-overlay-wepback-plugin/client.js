/*
 * @Date: 2022-05-12 17:59:30
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-13 12:04:10
 * @FilePath: /webpack-cli/@webpack-cli/client/definePlugin/browser-reload-error-overlay-wepback-plugin/client.js
 * @Description: 
 */
/*
 * BrowserReloadPlugin
 *
 * https://www.npmjs.com/package/browser-reload-error-overlay-wepback-plugin
 */
(function () {
	if (window.__browserReloadPlugin) {
		return;
	}

	var config = window.__browserReloadPlugin = {
		enabled: true,
		retryWait: /*retryWait*/,
		wsServer: 'ws://localhost:/*port*/',
	};

	function log(message) {
		console.info('%c browser-reload-error-overlay-wepback-plugin ' + (config.enabled ? '' : '(Disabled) '), 'background:#CB5C0D; padding:2px; border-radius:3px; color:#fff', message);
	}

	(function connect() {
		var socket = new WebSocket(config.wsServer);

		socket.addEventListener('open', function () {
			log('Connected. Waiting for changes.');
		});

		socket.addEventListener('error', function () {
			socket.close();
		});

		socket.addEventListener('close', function () {
			log('Connection closed. Retrying in ' + Math.ceil(config.retryWait / 1000) + 's');

			if (config.retryWait) {
				setTimeout(connect, config.retryWait);
			}
		});

		socket.addEventListener('message', function ({data}) {
			// console.log('data=',data)
		 
			const {cmd,message}  =  JSON.parse(data)
			
			if (cmd === 'cmd:reload') {
				if (config.enabled) {
					log('Build completed. Reloading...');
					window.location.reload();
				} else {
					//   log('Build completed.');
				}
			}

			if(cmd ==="cmd:buildError"){
				log('buildError...');
			//    console.log('message===',message.split('\n'))	
               console.error(message)
			}

			if (cmd === 'cmd:rebuilding') {
				log('Rebuilding...');
			}
		});
	})();
})();
