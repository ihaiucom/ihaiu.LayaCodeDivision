/**
*<code>/**
*<code>ParticleSettings</code> 类是粒子配置数据类
*/
//class laya.particle.ParticleSetting
var ParticleSetting=(function(){
	function ParticleSetting(){
		/**贴图*/
		this.textureName=null;
		/**贴图个数,默认为1可不设置*/
		this.textureCount=1;
		/**由于循环队列判断算法，最大饱和粒子数为maxPartices-1*/
		this.maxPartices=100;
		/**粒子持续时间(单位:秒）*/
		this.duration=1;
		/**如果大于0，某些粒子的持续时间会小于其他粒子,并具有随机性(单位:无）*/
		this.ageAddScale=0;
		/**粒子受发射器速度的敏感度（需在自定义发射器中编码设置）*/
		this.emitterVelocitySensitivity=1;
		/**最小开始尺寸（单位：2D像素、3D坐标）*/
		this.minStartSize=100;
		/**最大开始尺寸（单位：2D像素、3D坐标）*/
		this.maxStartSize=100;
		/**最小结束尺寸（单位：2D像素、3D坐标）*/
		this.minEndSize=100;
		/**最大结束尺寸（单位：2D像素、3D坐标）*/
		this.maxEndSize=100;
		/**最小水平速度（单位：2D像素、3D坐标）*/
		this.minHorizontalVelocity=0;
		/**最大水平速度（单位：2D像素、3D坐标）*/
		this.maxHorizontalVelocity=0;
		/**最小垂直速度（单位：2D像素、3D坐标）*/
		this.minVerticalVelocity=0;
		/**最大垂直速度（单位：2D像素、3D坐标）*/
		this.maxVerticalVelocity=0;
		/**等于1时粒子从出生到消亡保持一致的速度，等于0时粒子消亡时速度为0，大于1时粒子会保持加速（单位：无）*/
		this.endVelocity=1;
		/**最小旋转速度（单位：2D弧度/秒、3D弧度/秒）*/
		this.minRotateSpeed=0;
		/**最大旋转速度（单位：2D弧度/秒、3D弧度/秒）*/
		this.maxRotateSpeed=0;
		/**最小开始半径（单位：2D像素、3D坐标）*/
		this.minStartRadius=0;
		/**最大开始半径（单位：2D像素、3D坐标）*/
		this.maxStartRadius=0;
		/**最小结束半径（单位：2D像素、3D坐标）*/
		this.minEndRadius=0;
		/**最大结束半径（单位：2D像素、3D坐标）*/
		this.maxEndRadius=0;
		/**最小水平开始弧度（单位：2D弧度、3D弧度）*/
		this.minHorizontalStartRadian=0;
		/**最大水平开始弧度（单位：2D弧度、3D弧度）*/
		this.maxHorizontalStartRadian=0;
		/**最小垂直开始弧度（单位：2D弧度、3D弧度）*/
		this.minVerticalStartRadian=0;
		/**最大垂直开始弧度（单位：2D弧度、3D弧度）*/
		this.maxVerticalStartRadian=0;
		/**是否使用结束弧度,false为结束时与起始弧度保持一致,true为根据minHorizontalEndRadian、maxHorizontalEndRadian、minVerticalEndRadian、maxVerticalEndRadian计算结束弧度。*/
		this.useEndRadian=true;
		/**最小水平结束弧度（单位：2D弧度、3D弧度）*/
		this.minHorizontalEndRadian=0;
		/**最大水平结束弧度（单位：2D弧度、3D弧度）*/
		this.maxHorizontalEndRadian=0;
		/**最小垂直结束弧度（单位：2D弧度、3D弧度）*/
		this.minVerticalEndRadian=0;
		/**最大垂直结束弧度（单位：2D弧度、3D弧度）*/
		this.maxVerticalEndRadian=0;
		/**false代表RGBA整体插值，true代表RGBA逐分量插值*/
		this.colorComponentInter=false;
		/**false代表使用参数颜色数据，true代表使用原图颜色数据*/
		this.disableColor=false;
		/**混合模式，待调整，引擎中暂无BlendState抽象*/
		this.blendState=0;
		/**发射器类型,"point","box","sphere","ring"*/
		this.emitterType="null";
		/**发射器发射速率*/
		this.emissionRate=0;
		/**球发射器半径*/
		this.sphereEmitterRadius=1;
		/**球发射器速度*/
		this.sphereEmitterVelocity=0;
		/**球发射器速度随机值*/
		this.sphereEmitterVelocityAddVariance=0;
		/**环发射器半径*/
		this.ringEmitterRadius=30;
		/**环发射器速度*/
		this.ringEmitterVelocity=0;
		/**环发射器速度随机值*/
		this.ringEmitterVelocityAddVariance=0;
		/**环发射器up向量，0代表X轴,1代表Y轴,2代表Z轴*/
		this.ringEmitterUp=2;
		this.gravity=new Float32Array([0,0,0]);
		this.minStartColor=new Float32Array([1,1,1,1]);
		this.maxStartColor=new Float32Array([1,1,1,1]);
		this.minEndColor=new Float32Array([1,1,1,1]);
		this.maxEndColor=new Float32Array([1,1,1,1]);
		this.pointEmitterPosition=new Float32Array([0,0,0]);
		this.pointEmitterPositionVariance=new Float32Array([0,0,0]);
		this.pointEmitterVelocity=new Float32Array([0,0,0]);
		this.pointEmitterVelocityAddVariance=new Float32Array([0,0,0]);
		this.boxEmitterCenterPosition=new Float32Array([0,0,0]);
		this.boxEmitterSize=new Float32Array([0,0,0]);
		this.boxEmitterVelocity=new Float32Array([0,0,0]);
		this.boxEmitterVelocityAddVariance=new Float32Array([0,0,0]);
		this.sphereEmitterCenterPosition=new Float32Array([0,0,0]);
		this.ringEmitterCenterPosition=new Float32Array([0,0,0]);
		this.positionVariance=new Float32Array([0,0,0]);
	}

	__class(ParticleSetting,'laya.particle.ParticleSetting');
	ParticleSetting.checkSetting=function(setting){
		var key;
		for (key in ParticleSetting._defaultSetting){
			if (!setting.hasOwnProperty(key)){
				setting[key]=ParticleSetting._defaultSetting[key];
			}
		}
		setting.endVelocity=+setting.endVelocity;
		setting.gravity[0]=+setting.gravity[0];
		setting.gravity[1]=+setting.gravity[1];
		setting.gravity[2]=+setting.gravity[2];
	}

	__static(ParticleSetting,
	['_defaultSetting',function(){return this._defaultSetting=new ParticleSetting();}
	]);
	return ParticleSetting;
})()


/**
*@private
*/
//class laya.particle.ParticleData
var ParticleData=(function(){
	function ParticleData(){
		this.position=null;
		this.velocity=null;
		this.startColor=null;
		this.endColor=null;
		this.sizeRotation=null;
		this.radius=null;
		this.radian=null;
		this.durationAddScale=NaN;
		this.time=NaN;
	}

	__class(ParticleData,'laya.particle.ParticleData');
	ParticleData.Create=function(settings,position,velocity,time){
		var particleData=new ParticleData();
		particleData.position=position;
		MathUtil.scaleVector3(velocity,settings.emitterVelocitySensitivity,ParticleData._tempVelocity);
		var horizontalVelocity=MathUtil.lerp(settings.minHorizontalVelocity,settings.maxHorizontalVelocity,Math.random());
		var horizontalAngle=Math.random()*Math.PI *2;
		ParticleData._tempVelocity[0]+=horizontalVelocity *Math.cos(horizontalAngle);
		ParticleData._tempVelocity[2]+=horizontalVelocity *Math.sin(horizontalAngle);
		ParticleData._tempVelocity[1]+=MathUtil.lerp(settings.minVerticalVelocity,settings.maxVerticalVelocity,Math.random());
		particleData.velocity=ParticleData._tempVelocity;
		particleData.startColor=ParticleData._tempStartColor;
		particleData.endColor=ParticleData._tempEndColor;
		var i=0;
		if (settings.disableColor){
			for (i=0;i < 3;i++){
				particleData.startColor[i]=1;
				particleData.endColor[i]=1;
			}
			particleData.startColor[i]=MathUtil.lerp(settings.minStartColor[i],settings.maxStartColor[i],Math.random());
			particleData.endColor[i]=MathUtil.lerp(settings.minEndColor[i],settings.maxEndColor[i],Math.random());
		}
		else{
			if (settings.colorComponentInter){
				for (i=0;i < 4;i++){
					particleData.startColor[i]=MathUtil.lerp(settings.minStartColor[i],settings.maxStartColor[i],Math.random());
					particleData.endColor[i]=MathUtil.lerp(settings.minEndColor[i],settings.maxEndColor[i],Math.random());
				}
				}else {
				MathUtil.lerpVector4(settings.minStartColor,settings.maxStartColor,Math.random(),particleData.startColor);
				MathUtil.lerpVector4(settings.minEndColor,settings.maxEndColor,Math.random(),particleData.endColor);
			}
		}
		particleData.sizeRotation=ParticleData._tempSizeRotation;
		var sizeRandom=Math.random();
		particleData.sizeRotation[0]=MathUtil.lerp(settings.minStartSize,settings.maxStartSize,sizeRandom);
		particleData.sizeRotation[1]=MathUtil.lerp(settings.minEndSize,settings.maxEndSize,sizeRandom);
		particleData.sizeRotation[2]=MathUtil.lerp(settings.minRotateSpeed,settings.maxRotateSpeed,Math.random());
		particleData.radius=ParticleData._tempRadius;
		var radiusRandom=Math.random();
		particleData.radius[0]=MathUtil.lerp(settings.minStartRadius,settings.maxStartRadius,radiusRandom);
		particleData.radius[1]=MathUtil.lerp(settings.minEndRadius,settings.maxEndRadius,radiusRandom);
		particleData.radian=ParticleData._tempRadian;
		particleData.radian[0]=MathUtil.lerp(settings.minHorizontalStartRadian,settings.maxHorizontalStartRadian,Math.random());
		particleData.radian[1]=MathUtil.lerp(settings.minVerticalStartRadian,settings.maxVerticalStartRadian,Math.random());
		var useEndRadian=settings.useEndRadian;
		particleData.radian[2]=useEndRadian?MathUtil.lerp(settings.minHorizontalEndRadian,settings.maxHorizontalEndRadian,Math.random()):particleData.radian[0];
		particleData.radian[3]=useEndRadian?MathUtil.lerp(settings.minVerticalEndRadian,settings.maxVerticalEndRadian,Math.random()):particleData.radian[1];
		particleData.durationAddScale=settings.ageAddScale *Math.random();
		particleData.time=time;
		return particleData;
	}

	__static(ParticleData,
	['_tempVelocity',function(){return this._tempVelocity=new Float32Array(3);},'_tempStartColor',function(){return this._tempStartColor=new Float32Array(4);},'_tempEndColor',function(){return this._tempEndColor=new Float32Array(4);},'_tempSizeRotation',function(){return this._tempSizeRotation=new Float32Array(3);},'_tempRadius',function(){return this._tempRadius=new Float32Array(2);},'_tempRadian',function(){return this._tempRadian=new Float32Array(4);}
	]);
	return ParticleData;
})()


/**
*

*/
*/