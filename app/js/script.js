// parse data from json feed
var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};


function getUser(userHash, callback) {
    var bodyheight = "default";

	getJSON("https://gravr.herokuapp.com/api/users/hash/" + userHash).then(function(data) {
	    
//		pull main profiles data
//	    console.dir(data);
        callback(data);

	}, function(status) { //error detection....
	  	console.log('JSON Error');
	});
}


// Converts userheight for basemesh obj.
var userHeightConvert = function(userHeight) {
	return userHeight/1.6 * 0.95;
};
// Converts from radians to degrees.
var radiansToDegrees = function(radians) {
	return radians * 180 / Math.PI;
};


AFRAME.registerComponent('gravr-avatar', {
	schema: {
		color: {default: '#928DAB'},
		obj: {default: 'assets/basemesh.obj'},
		offsetPos: { type: 'vec3', default: {x:0, y:0, z:0} },
		safeZone: { type: 'boolean', default: false},
		hash: {default: ''}, // gravr api user hash 
		camID: {default: ''} // specific gravr camera
	},
	init: function () {
		var data = this.data;
		var el = this.el;
		var _this = this;
		this.bodyHeight = bodyHeight = 0; 
		this.headHeight = headHeight = 0; 

		this.userHeight = userHeight = 0; 
		this.sceneEl = sceneEl = document.querySelector('a-scene');

		//multiple cameras?
		this.cameraEls = cameraEls = document.querySelectorAll('a-entity[camera]');
		if (!cameraEls) {
			cameraEls = document.querySelectorAll('a-camera');
		}	

		//single camera
		this.cameraEl = cameraEl = null;

		if(cameraEls.length > 1 && data.camID == ''){

			for (var i = 0; i < cameraEls.length; i++) {
			  	
//----------//bugfix active state of camera
//			  	console.dir(cameraEls[i].components.camera.data.active);
//			  	console.log(cameraEls[i].getAttribute('camera','data','active'));

//			  	if(cameraEls[i].object3D.el.components.camera.data.active){
			  		this.cameraEl = cameraEls[i];
//			  	}
			}

		}else if(cameraEls.length > 1 && data.camID != ''){

			this.cameraEl = document.querySelector(data.camID);
		
		}else{

			if(data.camID){
				this.cameraEl = document.querySelector(data.camID);
			}else{
				this.cameraEl = document.querySelector('a-entity[camera]');
				if (!this.cameraEl) {
					this.cameraEl = document.querySelector('a-camera');
				}	
			}

		}

		var worldPos = new THREE.Vector3();
		worldPos.setFromMatrixPosition(this.cameraEl.object3D.matrixWorld);

        this.avatarContainer = avatarContainer = document.createElement("a-entity");
        avatarContainer.setAttribute('geometry', `primitive: box; width: 1; height: ${userHeight}; depth: 1;`);
		if (data.safeZone) {
        	avatarContainer.setAttribute('material', 'shader: flat; opacity: 0.25; side:double; color: red');
		}else{
	        avatarContainer.setAttribute('material', 'shader: flat; opacity: 0; side:front; color: #fff');
		}
	    avatarContainer.setAttribute('position', `0 ${userHeight/2} 0`);
        avatarContainer.setAttribute('rotation', '0 0 0');
        avatarContainer.setAttribute('visible', 'false');
        el.appendChild(avatarContainer);

        this.avatarModel = avatarModel = document.createElement("a-obj-model");
        avatarModel.setAttribute('src', data.obj);
	    avatarModel.setAttribute('position', `${data.offsetPos.x} -${userHeight/2} ${data.offsetPos.z}`);
        avatarModel.setAttribute('rotation', '0 180 0');
        avatarModel.setAttribute('color', data.color);
        avatarModel.setAttribute('scale', `1  ${userHeightConvert(userHeight)} 1`);
        avatarContainer.setAttribute('visible', 'false');
        avatarContainer.appendChild(avatarModel);

		this.cameraEl.addEventListener('loaded', function (evt) {
			if(data.hash){
				getUser(data.hash, function(object) {
		    		_this.bodyHeight = bodyHeight = object.account.metrics.body_height;
		    		_this.headHeight = headHeight = object.account.metrics.head;

		    		_this.userHeight = userHeight = bodyHeight - (headHeight/2);
		    		console.log('bodyHeight from API: '+ bodyHeight);
		    		console.log('headHeight from API: '+ headHeight);
		    		console.log('userHeight from API: '+ userHeight);

		    		_this.cameraEl.setAttribute('camera', 'userHeight', userHeight);			
		        	_this.setupAvatarHeight(userHeight);
				});
			}else{
				_this.userHeight = userHeight = _this.cameraEl.components.camera.data.userHeight;
		    	console.log('userHeight from cameraEl: '+ userHeight);

		        _this.setupAvatarHeight(userHeight);
			};
		});

	    this.onEnterVR = this.onEnterVR.bind(this);
	    this.onExitVR = this.onExitVR.bind(this);
	    this.sceneEl.addEventListener('enter-vr', this.onEnterVR);
	    this.sceneEl.addEventListener('exit-vr', this.onExitVR);

	},
	setupAvatarHeight: function (userHeight) {
		var data = this.data;

        avatarContainer.setAttribute('position', `0 ${userHeight/2} 0`);
        avatarContainer.setAttribute('geometry', `height: ${userHeight};`);
        avatarContainer.setAttribute('visible', 'true');

        avatarModel.setAttribute('position', `${data.offsetPos.x} -${userHeight/2} ${data.offsetPos.z}`);
    	avatarModel.setAttribute('scale', `1  ${userHeightConvert(userHeight)} 1`);
        avatarContainer.setAttribute('visible', 'true');

    	var avatarHeightText = document.createElement("a-entity");
    	avatarHeightText.setAttribute('text', `font: mozillavr; align:center; value: Your height is ${bodyHeight} meters. The distance of your eyes to the ground (userHeight) is ${userHeight} meters ; color:#1D689E`);
        avatarHeightText.setAttribute('position', '0 0.1 -2.75');
        avatarHeightText.setAttribute('scale', '1.5 1.5 1.5');
        avatarHeightText.setAttribute('rotation', '-45 0 0');
    	sceneEl.appendChild(avatarHeightText);

		var checkpoints = document.querySelectorAll('a-entity[checkpoint]');
		for (var i = 0; i < checkpoints.length; i++) {
			checkpoints[i].setAttribute('checkpoint', `offset: 0 ${userHeight} 0`);
		}

	},
	onEnterVR: function () {

		var cameraEl = this.cameraEl;
		var userHeight = this.userHeight;

//------//add loop to check if there is tracked HMD height

		setTimeout(function(){
			cameraEl.setAttribute('position', 'y', userHeight);
		}, 100 );
		
	},
	onExitVR: function () {
		console.log("exiting VR with gravr-avatar");
	},
	tick: function () {		
		var avatarPos = new THREE.Vector3();
		avatarPos.setFromMatrixPosition(this.cameraEl.object3D.matrixWorld);
	    var avatarRot = this.cameraEl.object3D.getWorldRotation();
		this.el.setAttribute('position', avatarPos.x + ' 0 ' + avatarPos.z);
    	this.el.setAttribute("rotation", "0 " + radiansToDegrees(avatarRot.y) + " 0");
	}
});





AFRAME.registerComponent('switch-camera', {
	schema: {
    	activate: { default: '' }
	},
	init: function () {
		var data = this.data;
		var el = this.el;
    	var targetCam = document.querySelector(data.activate);
		var cameraEls = document.querySelectorAll('a-entity[camera]');

		el.addEventListener('click', function (evt) { 
	    	console.log('switch to camera ID: '+ data.activate)

	       	if(data.activate != ''){

				for (var i = 0; i < cameraEls.length; i++) {
				  	console.log(cameraEls[i]);
					cameraEls[i].setAttribute('camera', 'active', false);
				}
	    		
	    		console.log('activate: '+ data.activate)
				targetCam.setAttribute('camera', 'active', true);
	       	}
		});
	}
});



