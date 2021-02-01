/*

function updateCameraList(cameras) {
	const listElement = document.querySelector('select#availableCameras');
	console.log(listElement);
// cameras.map(camera => {
// 	const cameraOption = document.createElement('option');
// 	cameraOption.label = camera.label;
// 	cameraOption.value = camera.deviceId;
// }).forEach(element => {
// 	listElement.appendChild(element);
// });
}

async function getConnectedDevices(type) {
	const devices = await navigator.mediaDevices.enumerateDevices();
	return devices.filter(device => device.kind === type)
}

// Get the initial set of cameras connected
// debugger
const videoCameras = getConnectedDevices('videoinput');
console.log(videoCameras);
updateCameraList(videoCameras);

// Listen for changes to media devices and update the list accordingly
navigator.mediaDevices.addEventListener('devicechange', event => {
	const newCameraList = getConnectedDevices('video');
	updateCameraList(newCameraList);
});
*/
async function getConnectedDevices(type) {
	const devices = await navigator.mediaDevices.enumerateDevices();
	return devices.filter(device => device.kind === type)
}

const videoCameras = getConnectedDevices('videoinput');

function updateCameraList(cameras) {
	const listElement = document.querySelector('select#availableCameras');
	console.log(listElement);

	let i = 0;
	cameras.map(camera => {
		const cameraOption = document.createElement('option');
		cameraOption.label = camera.label;	
		cameraOption.value = camera.deviceId;
		cameraOption.innerText = 'videoinput' + i;
		listElement.append(cameraOption);
		i += 1;
	});
	// listElement.add(element);
}
videoCameras.then((filtered) => {
	updateCameraList(filtered);	
});

async function playVideoFromCrame() {
	try{
		const stream = await navigator.mediaDevices.getUserMedia({'video': true});
		const videoElement = document.querySelector('video#localVideo');
		videoElement.srcObject = stream;
	}catch (err) {
		console.err("error: ", err);
	}
}

playVideoFromCrame()
