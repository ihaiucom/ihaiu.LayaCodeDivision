/**
*<code>/**
*<code>/**
*<code>/**
*<code>/**
*<code>/**
*<code>EmitterBase</code> 类是粒子发射器类
*/
//class laya.particle.emitter.EmitterBase
var EmitterBase=(function(){
	function EmitterBase(){
		/**
		*积累的帧时间
		*/
		this._frameTime=0;
		/**
		*粒子发射速率
		*/
		this._emissionRate=60;
		/**
		*当前剩余发射时间
		*/
		this._emissionTime=0;
		/**
		*发射粒子最小时间间隔
		*/
		this.minEmissionTime=1 / 60;
		/**@private */
		this._particleTemplate=null;
	}

	__class(EmitterBase,'laya.particle.emitter.EmitterBase');
	var __proto=EmitterBase.prototype;
	/**
	*开始发射粒子
	*@param duration 发射持续的时间(秒)
	*/
	__proto.start=function(duration){
		(duration===void 0)&& (duration=Number.MAX_VALUE);
		if (this._emissionRate !=0)
			this._emissionTime=duration;
	}

	/**
	*停止发射粒子
	*@param clearParticles 是否清理当前的粒子
	*/
	__proto.stop=function(){
		this._emissionTime=0;
	}

	/**
	*清理当前的活跃粒子
	*@param clearTexture 是否清理贴图数据,若清除贴图数据将无法再播放
	*/
	__proto.clear=function(){
		this._emissionTime=0;
	}

	/**
	*发射一个粒子
	*
	*/
	__proto.emit=function(){}
	/**
	*时钟前进
	*@param passedTime 前进时间
	*
	*/
	__proto.advanceTime=function(passedTime){
		(passedTime===void 0)&& (passedTime=1);
		this._emissionTime-=passedTime;
		if (this._emissionTime < 0)return;
		this._frameTime+=passedTime;
		if (this._frameTime < this.minEmissionTime)return;
		while (this._frameTime > this.minEmissionTime){
			this._frameTime-=this.minEmissionTime;
			this.emit();
		}
	}

	/**
	*设置粒子粒子模板
	*@param particleTemplate 粒子模板
	*
	*/
	__getset(0,__proto,'particleTemplate',null,function(particleTemplate){
		this._particleTemplate=particleTemplate;
	});

	/**
	*设置粒子发射速率
	*@param emissionRate 粒子发射速率 (个/秒)
	*/
	/**
	*获取粒子发射速率
	*@return 发射速率 粒子发射速率 (个/秒)
	*/
	__getset(0,__proto,'emissionRate',function(){
		return this._emissionRate;
		},function(_emissionRate){
		if (_emissionRate <=0)return;
		this._emissionRate=_emissionRate;
		(_emissionRate > 0)&& (this.minEmissionTime=1 / _emissionRate);
	});

	return EmitterBase;
})()


/**
*
*@private
*
*@created 2015-8-25 下午3:41:07
*/
//class laya.particle.particleUtils.CMDParticle
var CMDParticle=(function(){
	function CMDParticle(){
		/**
		*最大帧
		*/
		this.maxIndex=0;
		/**
		*帧命令数组
		*/
		this.cmds=null;
		/**
		*粒子id
		*/
		this.id=0;
	}

	__class(CMDParticle,'laya.particle.particleUtils.CMDParticle');
	var __proto=CMDParticle.prototype;
	__proto.setCmds=function(cmds){
		this.cmds=cmds;
		this.maxIndex=cmds.length-1;
	}

	return CMDParticle;
})()


/**
*@private
*/
//class laya.particle.ParticleEmitter
var ParticleEmitter=(function(){
	function ParticleEmitter(templet,particlesPerSecond,initialPosition){
		this._templet=null;
		this._timeBetweenParticles=NaN;
		this._previousPosition=null;
		this._timeLeftOver=0;
		this._tempVelocity=new Float32Array([0,0,0]);
		this._tempPosition=new Float32Array([0,0,0]);
		this._templet=templet;
		this._timeBetweenParticles=1.0 / particlesPerSecond;
		this._previousPosition=initialPosition;
	}

	__class(ParticleEmitter,'laya.particle.ParticleEmitter');
	var __proto=ParticleEmitter.prototype;
	__proto.update=function(elapsedTime,newPosition){
		elapsedTime=elapsedTime / 1000;
		if (elapsedTime > 0){
			MathUtil.subtractVector3(newPosition,this._previousPosition,this._tempVelocity);
			MathUtil.scaleVector3(this._tempVelocity,1 / elapsedTime,this._tempVelocity);
			var timeToSpend=this._timeLeftOver+elapsedTime;
			var currentTime=-this._timeLeftOver;
			while (timeToSpend > this._timeBetweenParticles){
				currentTime+=this._timeBetweenParticles;
				timeToSpend-=this._timeBetweenParticles;
				MathUtil.lerpVector3(this._previousPosition,newPosition,currentTime / elapsedTime,this._tempPosition);
				this._templet.addParticleArray(this._tempPosition,this._tempVelocity);
			}
			this._timeLeftOver=timeToSpend;
		}
		this._previousPosition[0]=newPosition[0];
		this._previousPosition[1]=newPosition[1];
		this._previousPosition[2]=newPosition[2];
	}

	return ParticleEmitter;
})()


/**
*@private
*/
//class laya.particle.particleUtils.CanvasShader
var CanvasShader=(function(){
	function CanvasShader(){
		this.u_Duration=NaN;
		this.u_EndVelocity=NaN;
		this.u_Gravity=null;
		this.a_Position=null;
		this.a_Velocity=null;
		this.a_StartColor=null;
		this.a_EndColor=null;
		this.a_SizeRotation=null;
		this.a_Radius=null;
		this.a_Radian=null;
		this.a_AgeAddScale=NaN;
		this.gl_Position=null;
		this.v_Color=null;
		this.oSize=NaN;
		this._color=new Float32Array(4);
		this._position=new Float32Array(3);
	}

	__class(CanvasShader,'laya.particle.particleUtils.CanvasShader');
	var __proto=CanvasShader.prototype;
	__proto.getLen=function(position){
		return Math.sqrt(position[0] *position[0]+position[1] *position[1]+position[2] *position[2]);
	}

	__proto.ComputeParticlePosition=function(position,velocity,age,normalizedAge){
		this._position[0]=position[0];
		this._position[1]=position[1];
		this._position[2]=position[2];
		var startVelocity=this.getLen(velocity);
		var endVelocity=startVelocity *this.u_EndVelocity;
		var velocityIntegral=startVelocity *normalizedAge+(endVelocity-startVelocity)*normalizedAge *normalizedAge / 2.0;
		var lenVelocity=NaN;
		lenVelocity=this.getLen(velocity);
		var i=0,len=0;
		len=3;
		for (i=0;i < len;i++){
			this._position[i]=this._position[i]+(velocity[i] / lenVelocity)*velocityIntegral *this.u_Duration;
			this._position[i]+=this.u_Gravity[i] *age *normalizedAge;
		};
		var radius=MathUtil.lerp(this.a_Radius[0],this.a_Radius[1],normalizedAge);
		var radianHorizontal=MathUtil.lerp(this.a_Radian[0],this.a_Radian[2],normalizedAge);
		var radianVertical=MathUtil.lerp(this.a_Radian[1],this.a_Radian[3],normalizedAge);
		var r=Math.cos(radianVertical)*radius;
		this._position[1]+=Math.sin(radianVertical)*radius;
		this._position[0]+=Math.cos(radianHorizontal)*r;
		this._position[2]+=Math.sin(radianHorizontal)*r;
		return new Float32Array([this._position[0],this._position[1],0.0,1.0]);
	}

	__proto.ComputeParticleSize=function(startSize,endSize,normalizedAge){
		var size=MathUtil.lerp(startSize,endSize,normalizedAge);
		return size;
	}

	__proto.ComputeParticleRotation=function(rot,age){
		return rot *age;
	}

	__proto.ComputeParticleColor=function(startColor,endColor,normalizedAge){
		var rst=this._color;
		MathUtil.lerpVector4(startColor,endColor,normalizedAge,rst);
		rst[3]=rst[3]*normalizedAge *(1.0-normalizedAge)*(1.0-normalizedAge)*6.7;
		return rst;
	}

	__proto.clamp=function(value,min,max){
		if(value<min)return min;
		if(value>max)return max;
		return value;
	}

	__proto.getData=function(age){
		age *=1.0+this.a_AgeAddScale;
		var normalizedAge=this.clamp(age / this.u_Duration,0.0,1.0);
		this.gl_Position=this.ComputeParticlePosition(this.a_Position,this.a_Velocity,age,normalizedAge);
		var pSize=this.ComputeParticleSize(this.a_SizeRotation[0],this.a_SizeRotation[1],normalizedAge);
		var rotation=this.ComputeParticleRotation(this.a_SizeRotation[2],age);
		this.v_Color=this.ComputeParticleColor(this.a_StartColor,this.a_EndColor,normalizedAge);
		var matric=new Matrix();
		var scale=NaN;
		scale=pSize/this.oSize*2;
		matric.scale(scale,scale);
		matric.rotate(rotation);
		matric.setTranslate(this.gl_Position[0],-this.gl_Position[1]);
		var alpha=NaN;
		alpha=this.v_Color[3];
		return [this.v_Color,alpha,matric,this.v_Color[0]*alpha,this.v_Color[1]*alpha,this.v_Color[2]*alpha];
	}

	return CanvasShader;
})()


/**
*@private
*/
//class laya.particle.shader.value.ParticleShaderValue extends laya.webgl.shader.d2.value.Value2D
var ParticleShaderValue=(function(_super){
	function ParticleShaderValue(){
		/*
		public var a_CornerTextureCoordinate:Array=[4,WebGLContext.FLOAT,false,116,0];
		public var a_Position:Array=[3,WebGLContext.FLOAT,false,116,16];
		public var a_Velocity:Array=[3,WebGLContext.FLOAT,false,116,28];
		public var a_StartColor:Array=[4,WebGLContext.FLOAT,false,116,40];
		public var a_EndColor:Array=[4,WebGLContext.FLOAT,false,116,56];
		public var a_SizeRotation:Array=[3,WebGLContext.FLOAT,false,116,72];
		public var a_Radius:Array=[2,WebGLContext.FLOAT,false,116,84];
		public var a_Radian:Array=[4,WebGLContext.FLOAT,false,116,92];
		public var a_AgeAddScale:Array=[1,WebGLContext.FLOAT,false,116,108];
		public var a_Time:Array=[1,WebGLContext.FLOAT,false,116,112];
		*/
		this.u_CurrentTime=NaN;
		this.u_Duration=NaN;
		this.u_Gravity=null;
		//v3
		this.u_EndVelocity=NaN;
		this.u_texture=null;
		ParticleShaderValue.__super.call(this,0,0);
	}

	__class(ParticleShaderValue,'laya.particle.shader.value.ParticleShaderValue',_super);
	var __proto=ParticleShaderValue.prototype;
	/*�ŵ� ParticleShader ����
	this._attribLocation=['a_CornerTextureCoordinate',0,'a_Position',1,'a_Velocity',2,'a_StartColor',3,
	'a_EndColor',4,'a_SizeRotation',5,'a_Radius',6,'a_Radian',7,'a_AgeAddScale',8,'a_Time',9];
	*/
	__proto.upload=function(){
		var size=this.size;
		size[0]=RenderState2D.width;
		size[1]=RenderState2D.height;
		this.alpha=this.ALPHA *RenderState2D.worldAlpha;
		ParticleShaderValue.pShader.upload(this);
	}

	__static(ParticleShaderValue,
	['pShader',function(){return this.pShader=new ParticleShader();}
	]);
	return ParticleShaderValue;
})(Value2D)


/**
*
*@private
*/
//class laya.particle.emitter.Emitter2D extends laya.particle.emitter.EmitterBase
var Emitter2D=(function(_super){
	function Emitter2D(_template){
		this.setting=null;
		this._posRange=null;
		this._canvasTemplate=null;
		this._emitFun=null;
		Emitter2D.__super.call(this);
		this.template=_template;
	}

	__class(Emitter2D,'laya.particle.emitter.Emitter2D',_super);
	var __proto=Emitter2D.prototype;
	__proto.emit=function(){
		_super.prototype.emit.call(this);
		if(this._emitFun!=null)
			this._emitFun();
	}

	__proto.getRandom=function(value){
		return (Math.random()*2-1)*value;
	}

	__proto.webGLEmit=function(){
		var pos=new Float32Array(3);
		pos[0]=this.getRandom(this._posRange[0]);
		pos[1]=this.getRandom(this._posRange[1]);
		pos[2]=this.getRandom(this._posRange[2]);
		var v=new Float32Array(3);
		v[0]=0;
		v[1]=0;
		v[2]=0;
		this._particleTemplate.addParticleArray(pos,v);
	}

	__proto.canvasEmit=function(){
		var pos=new Float32Array(3);
		pos[0]=this.getRandom(this._posRange[0]);
		pos[1]=this.getRandom(this._posRange[1]);
		pos[2]=this.getRandom(this._posRange[2]);
		var v=new Float32Array(3);
		v[0]=0;
		v[1]=0;
		v[2]=0;
		this._particleTemplate.addParticleArray(pos,v);
	}

	__getset(0,__proto,'template',function(){
		return this._particleTemplate;
		},function(template){
		this._particleTemplate=template;
		if (!template){
			this._emitFun=null;
			this.setting=null;
			this._posRange=null;
		};
		this.setting=template.settings;
		this._posRange=this.setting.positionVariance;
		if((this._particleTemplate instanceof laya.particle.ParticleTemplate2D )){
			this._emitFun=this.webGLEmit;
		}else
		if((this._particleTemplate instanceof laya.particle.ParticleTemplateCanvas )){
			this._canvasTemplate=template;
			this._emitFun=this.canvasEmit;
		}
	});

	return Emitter2D;
})(EmitterBase)


/**
*@private
*/
//class laya.particle.ParticleTemplateWebGL extends laya.particle.ParticleTemplateBase
var ParticleTemplateWebGL=(function(_super){
	function ParticleTemplateWebGL(parSetting){
		this._vertices=null;
		//protected var _indexBuffer:Buffer;
		this._mesh=null;
		this._conchMesh=null;
		this._floatCountPerVertex=29;
		//0~3为CornerTextureCoordinate,4~6为Position,7~9Velocity,10到13为StartColor,14到17为EndColor,18到20位SizeRotation，21到22位Radius,23到26位Radian，27为DurationAddScaleShaderValue,28为Time
		this._firstActiveElement=0;
		this._firstNewElement=0;
		this._firstFreeElement=0;
		this._firstRetiredElement=0;
		this._currentTime=0;
		this._drawCounter=0;
		ParticleTemplateWebGL.__super.call(this);
		this.settings=parSetting;
	}

	__class(ParticleTemplateWebGL,'laya.particle.ParticleTemplateWebGL',_super);
	var __proto=ParticleTemplateWebGL.prototype;
	__proto.reUse=function(context,pos){
		return 0;
	}

	__proto.initialize=function(){
		var floatStride=0;
		if (Render.isConchApp){
			this._vertices=this._conchMesh._float32Data;
			floatStride=MeshParticle2D.const_stride / 4;
		}
		else{
			this._vertices=this._mesh._vb.getFloat32Array();
			floatStride=this._mesh._stride / 4;
		};
		var bufi=0;
		var bufStart=0;
		for (var i=0;i < this.settings.maxPartices;i++){
			var random=Math.random();
			var cornerYSegement=this.settings.textureCount ? 1.0 / this.settings.textureCount :1.0;
			var cornerY=NaN;
			for (cornerY=0;cornerY < this.settings.textureCount;cornerY+=cornerYSegement){
				if (random < cornerY+cornerYSegement)
					break ;
			}
			this._vertices[bufi++]=-1;
			this._vertices[bufi++]=-1;
			this._vertices[bufi++]=0;
			this._vertices[bufi++]=cornerY;
			bufi=(bufStart+=floatStride);
			this._vertices[bufi++]=1;
			this._vertices[bufi++]=-1;
			this._vertices[bufi++]=1;
			this._vertices[bufi++]=cornerY;
			bufi=bufStart+=floatStride;
			this._vertices[bufi++]=1;
			this._vertices[bufi++]=1;
			this._vertices[bufi++]=1;
			this._vertices[bufi++]=cornerY+cornerYSegement;
			bufi=bufStart+=floatStride;
			this._vertices[bufi++]=-1;
			this._vertices[bufi++]=1;
			this._vertices[bufi++]=0;
			this._vertices[bufi++]=cornerY+cornerYSegement;
			bufi=bufStart+=floatStride;
		}
	}

	__proto.update=function(elapsedTime){
		this._currentTime+=elapsedTime / 1000;
		this.retireActiveParticles();
		this.freeRetiredParticles();
		if (this._firstActiveElement==this._firstFreeElement)
			this._currentTime=0;
		if (this._firstRetiredElement==this._firstActiveElement)
			this._drawCounter=0;
	}

	__proto.retireActiveParticles=function(){
		var epsilon=0.0001;
		var particleDuration=this.settings.duration;
		while (this._firstActiveElement !=this._firstNewElement){
			var offset=this._firstActiveElement *this._floatCountPerVertex *4;
			var index=offset+28;
			var particleAge=this._currentTime-this._vertices[index];
			particleAge *=(1.0+this._vertices[offset+27]);
			if (particleAge+epsilon < particleDuration)
				break ;
			this._vertices[index]=this._drawCounter;
			this._firstActiveElement++;
			if (this._firstActiveElement >=this.settings.maxPartices)
				this._firstActiveElement=0;
		}
	}

	__proto.freeRetiredParticles=function(){
		while (this._firstRetiredElement !=this._firstActiveElement){
			var age=this._drawCounter-this._vertices[this._firstRetiredElement *this._floatCountPerVertex *4+28];
			if (age < 3)
				break ;
			this._firstRetiredElement++;
			if (this._firstRetiredElement >=this.settings.maxPartices)
				this._firstRetiredElement=0;
		}
	}

	__proto.addNewParticlesToVertexBuffer=function(){}
	//由于循环队列判断算法，当下一个freeParticle等于retiredParticle时不添加例子，意味循环队列中永远有一个空位。（由于此判断算法快速、简单，所以放弃了使循环队列饱和的复杂算法（需判断freeParticle在retiredParticle前、后两种情况并不同处理））
	__proto.addParticleArray=function(position,velocity){
		var nextFreeParticle=this._firstFreeElement+1;
		if (nextFreeParticle >=this.settings.maxPartices)
			nextFreeParticle=0;
		if (nextFreeParticle===this._firstRetiredElement)
			return;
		var particleData=ParticleData.Create(this.settings,position,velocity,this._currentTime);
		var startIndex=this._firstFreeElement *this._floatCountPerVertex *4;
		for (var i=0;i < 4;i++){
			var j=0,offset=0;
			for (j=0,offset=4;j < 3;j++)
			this._vertices[startIndex+i *this._floatCountPerVertex+offset+j]=particleData.position[j];
			for (j=0,offset=7;j < 3;j++)
			this._vertices[startIndex+i *this._floatCountPerVertex+offset+j]=particleData.velocity[j];
			for (j=0,offset=10;j < 4;j++)
			this._vertices[startIndex+i *this._floatCountPerVertex+offset+j]=particleData.startColor[j];
			for (j=0,offset=14;j < 4;j++)
			this._vertices[startIndex+i *this._floatCountPerVertex+offset+j]=particleData.endColor[j];
			for (j=0,offset=18;j < 3;j++)
			this._vertices[startIndex+i *this._floatCountPerVertex+offset+j]=particleData.sizeRotation[j];
			for (j=0,offset=21;j < 2;j++)
			this._vertices[startIndex+i *this._floatCountPerVertex+offset+j]=particleData.radius[j];
			for (j=0,offset=23;j < 4;j++)
			this._vertices[startIndex+i *this._floatCountPerVertex+offset+j]=particleData.radian[j];
			this._vertices[startIndex+i *this._floatCountPerVertex+27]=particleData.durationAddScale;
			this._vertices[startIndex+i *this._floatCountPerVertex+28]=particleData.time;
		}
		this._firstFreeElement=nextFreeParticle;
	}

	return ParticleTemplateWebGL;
})(ParticleTemplateBase)


/**
*@private
*/
//class laya.particle.ParticleTemplateCanvas extends laya.particle.ParticleTemplateBase
var ParticleTemplateCanvas=(function(_super){
	function ParticleTemplateCanvas(particleSetting){
		/**
		*是否处于可播放状态
		*/
		this._ready=false;
		/**
		*贴图列表
		*/
		this.textureList=[];
		/**
		*粒子列表
		*/
		this.particleList=[];
		/**
		*贴图中心偏移x
		*/
		this.pX=0;
		/**
		*贴图中心偏移y
		*/
		this.pY=0;
		/**
		*当前活跃的粒子
		*/
		this.activeParticles=[];
		/**
		*粒子pool
		*/
		this.deadParticles=[];
		/**
		*粒子播放进度列表
		*/
		this.iList=[];
		/**
		*粒子系统使用的最大粒子数
		*/
		this._maxNumParticles=0;
		/**
		*纹理的宽度
		*/
		this.textureWidth=NaN;
		/**
		*宽度倒数
		*/
		this.dTextureWidth=NaN;
		/**
		*是否支持颜色变化
		*/
		this.colorChange=true;
		/**
		*采样步长
		*/
		this.step=1/60;
		this.canvasShader=new CanvasShader();
		ParticleTemplateCanvas.__super.call(this);
		this.settings=particleSetting;
		this._maxNumParticles=particleSetting.maxPartices;
		this.texture=new Texture();
		this.texture.on(/*laya.events.Event.READY*/"ready",this,this._textureLoaded);
		this.texture.load(particleSetting.textureName);
	}

	__class(ParticleTemplateCanvas,'laya.particle.ParticleTemplateCanvas',_super);
	var __proto=ParticleTemplateCanvas.prototype;
	__proto._textureLoaded=function(e){
		this.setTexture(this.texture);
		this._ready=true;
	}

	__proto.clear=function(clearTexture){
		(clearTexture===void 0)&& (clearTexture=true);
		this.deadParticles.length=0;
		this.activeParticles.length=0;
		this.textureList.length=0;
	}

	/**
	*设置纹理
	*@param texture
	*
	*/
	__proto.setTexture=function(texture){
		this.texture=texture;
		this.textureWidth=texture.width;
		this.dTextureWidth=1/this.textureWidth;
		this.pX=-texture.width*0.5;
		this.pY=-texture.height*0.5;
		this.textureList=ParticleTemplateCanvas.changeTexture(texture,this.textureList);
		this.particleList.length=0;
		this.deadParticles.length=0;
		this.activeParticles.length=0;
	}

	/**
	*创建一个粒子数据
	*@return
	*
	*/
	__proto._createAParticleData=function(position,velocity){
		this.canvasShader.u_EndVelocity=this.settings.endVelocity;
		this.canvasShader.u_Gravity=this.settings.gravity;
		this.canvasShader.u_Duration=this.settings.duration;
		var particle;
		particle=ParticleData.Create(this.settings,position,velocity,0);
		this.canvasShader.a_Position=particle.position;
		this.canvasShader.a_Velocity=particle.velocity;
		this.canvasShader.a_StartColor=particle.startColor;
		this.canvasShader.a_EndColor=particle.endColor;
		this.canvasShader.a_SizeRotation=particle.sizeRotation;
		this.canvasShader.a_Radius=particle.radius;
		this.canvasShader.a_Radian=particle.radian;
		this.canvasShader.a_AgeAddScale=particle.durationAddScale;
		this.canvasShader.oSize=this.textureWidth;
		var rst=new CMDParticle();
		var i=0,len=this.settings.duration/(1+particle.durationAddScale);
		var params=[];
		var mStep=NaN;
		for(i=0;i<len;i+=this.step){
			params.push(this.canvasShader.getData(i));
		}
		rst.id=this.particleList.length;
		this.particleList.push(rst);
		rst.setCmds(params);
		return rst;
	}

	__proto.addParticleArray=function(position,velocity){
		if(!this._ready)return;
		var tParticle;
		if(this.particleList.length<this._maxNumParticles){
			tParticle=this._createAParticleData(position,velocity);
			this.iList[tParticle.id]=0;
			this.activeParticles.push(tParticle);
			}else{
			if(this.deadParticles.length>0){
				tParticle=this.deadParticles.pop();
				this.iList[tParticle.id]=0;
				this.activeParticles.push(tParticle);
			}
		}
	}

	__proto.advanceTime=function(passedTime){
		(passedTime===void 0)&& (passedTime=1);
		if(!this._ready)return;
		var particleList=this.activeParticles;
		var pool=this.deadParticles;
		var i=0,len=particleList.length;
		var tcmd;
		var tI=0;
		var iList=this.iList;
		for(i=len-1;i>-1;i--){
			tcmd=particleList[i];
			tI=iList[tcmd.id];
			if(tI>=tcmd.maxIndex){
				tI=0;
				particleList.splice(i,1);
				pool.push(tcmd);
				}else{
				tI+=1;
			}
			iList[tcmd.id]=tI;
		}
	}

	__proto.render=function(context,x,y){
		if(!this._ready)return;
		if(this.activeParticles.length<1)return;
		if (this.textureList.length < 2)return;
		if (this.settings.disableColor){
			this.noColorRender(context,x,y);
			}else{
			this.canvasRender(context,x,y);
		}
	}

	__proto.noColorRender=function(context,x,y){
		var particleList=this.activeParticles;
		var i=0,len=particleList.length;
		var tcmd;
		var tParam;
		var tAlpha=NaN;
		var px=this.pX,py=this.pY;
		var pw=-px*2,ph=-py*2;
		var tI=0;
		var textureList=this.textureList;
		var iList=this.iList;
		var preAlpha=NaN;
		context.translate(x,y);
		preAlpha=context.globalAlpha;
		for(i=0;i<len;i++){
			tcmd=particleList[i];
			tI=iList[tcmd.id];
			tParam=tcmd.cmds[tI];
			if (!tParam)continue ;
			if ((tAlpha=tParam[1])<=0.01)continue ;
			context.globalAlpha=preAlpha*tAlpha;
			context.drawTextureWithTransform(this.texture,px,py,pw,ph,tParam[2],0,0,1,null);
		}
		context.globalAlpha=preAlpha;
		context.translate(-x,-y);
	}

	__proto.canvasRender=function(context,x,y){
		var particleList=this.activeParticles;
		var i=0,len=particleList.length;
		var tcmd;
		var tParam;
		var tAlpha=NaN;
		var px=this.pX,py=this.pY;
		var pw=-px*2,ph=-py*2;
		var tI=0;
		var textureList=this.textureList;
		var iList=this.iList;
		var preAlpha=NaN;
		var preB;
		context.translate(x,y);
		preAlpha=context.globalAlpha;
		preB=context.globalCompositeOperation;
		context.globalCompositeOperation="lighter";
		for(i=0;i<len;i++){
			tcmd=particleList[i];
			tI=iList[tcmd.id];
			tParam=tcmd.cmds[tI];
			if (!tParam)continue ;
			if ((tAlpha=tParam[1])<=0.01)continue ;
			context.save();
			context.transformByMatrix(tParam[2],0,0);
			if(tParam[3]>0.01){
				context.globalAlpha=preAlpha *tParam[3];
				context.drawTexture(textureList[0],px,py,pw,ph);
			}
			if(tParam[4]>0.01){
				context.globalAlpha=preAlpha *tParam[4];
				context.drawTexture(textureList[1],px,py,pw,ph);
			}
			if(tParam[5]>0.01){
				context.globalAlpha=preAlpha *tParam[5];
				context.drawTexture(textureList[2],px,py,pw,ph);
			}
			context.restore();
		}
		context.globalAlpha=preAlpha;
		context.translate(-x,-y);
		context.globalCompositeOperation=preB;
	}

	ParticleTemplateCanvas.changeTexture=function(texture,rst,settings){
		if(!rst)rst=[];
		rst.length=0;
		if (settings&&settings.disableColor){
			rst.push(texture,texture,texture);
			}else{
			Utils.copyArray(rst,PicTool.getRGBPic(texture));
		}
		return rst;
	}

	return ParticleTemplateCanvas;
})(ParticleTemplateBase)


/**
*@private
*/
//class laya.particle.ParticleTemplate2D extends laya.particle.ParticleTemplateWebGL
var ParticleTemplate2D=(function(_super){
	function ParticleTemplate2D(parSetting){
		this.x=0;
		this.y=0;
		this._blendFn=null;
		this._startTime=0;
		this._key={};
		this.sv=new ParticleShaderValue();
		ParticleTemplate2D.__super.call(this,parSetting);
		var _this=this;
		Laya.loader.load(this.settings.textureName,Handler.create(null,function(texture){
			_this.texture=texture;
		}));
		this.sv.u_Duration=this.settings.duration;
		this.sv.u_Gravity=this.settings.gravity;
		this.sv.u_EndVelocity=this.settings.endVelocity;
		this._blendFn=BlendMode.fns[parSetting.blendState];
		if (Render.isConchApp){
			var nSize=MeshParticle2D.const_stride *this.settings.maxPartices *4 *4;
			this._conchMesh=/*__JS__ */new ParamData(nSize,true);
		}
		else{
			this._mesh=MeshParticle2D.getAMesh(this.settings.maxPartices);
		}
		this.initialize();
	}

	__class(ParticleTemplate2D,'laya.particle.ParticleTemplate2D',_super);
	var __proto=ParticleTemplate2D.prototype;
	Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
	//loadContent();
	__proto.getRenderType=function(){return-111}
	__proto.releaseRender=function(){}
	__proto.addParticleArray=function(position,velocity){
		position[0]+=this.x;
		position[1]+=this.y;
		_super.prototype.addParticleArray.call(this,position,velocity);
	}

	/*
	override protected function loadContent():void{
		var indexes:Uint16Array=new Uint16Array(settings.maxPartices *6);
		for (var i:int=0;i < settings.maxPartices;i++){
			indexes[i *6+0]=(i *4+0);
			indexes[i *6+1]=(i *4+1);
			indexes[i *6+2]=(i *4+2);
			indexes[i *6+3]=(i *4+0);
			indexes[i *6+4]=(i *4+2);
			indexes[i *6+5]=(i *4+3);
		}
		_indexBuffer2D.clear();
		_indexBuffer2D.append(indexes);
		_indexBuffer2D.upload();
	}

	*/
	__proto.addNewParticlesToVertexBuffer=function(){
		var _vertexBuffer2D=this._mesh._vb;
		_vertexBuffer2D.clear();
		_vertexBuffer2D.append(this._vertices);
		var start=0;
		if (this._firstNewElement < this._firstFreeElement){
			start=this._firstNewElement *4 *this._floatCountPerVertex *4;
			_vertexBuffer2D.subUpload(start,start,start+(this._firstFreeElement-this._firstNewElement)*4 *this._floatCountPerVertex *4);
			}else {
			start=this._firstNewElement *4 *this._floatCountPerVertex *4;
			_vertexBuffer2D.subUpload(start,start,start+(this.settings.maxPartices-this._firstNewElement)*4 *this._floatCountPerVertex *4);
			if (this._firstFreeElement > 0){
				_vertexBuffer2D.setNeedUpload();
				_vertexBuffer2D.subUpload(0,0,this._firstFreeElement *4 *this._floatCountPerVertex *4);
			}
		}
		this._firstNewElement=this._firstFreeElement;
	}

	__proto.renderSubmit=function(){
		if (this.texture&&this.texture.getIsReady()){
			this.update(Laya.timer._delta);
			this.sv.u_CurrentTime=this._currentTime;
			if (this._firstNewElement !=this._firstFreeElement){
				this.addNewParticlesToVertexBuffer();
			}
			this.blend();
			if (this._firstActiveElement !=this._firstFreeElement){
				var gl=WebGL.mainContext;
				this._mesh.useMesh(gl);
				this.sv.u_texture=this.texture._getSource();
				this.sv.upload();
				if (this._firstActiveElement < this._firstFreeElement){
					WebGL.mainContext.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,(this._firstFreeElement-this._firstActiveElement)*6,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,this._firstActiveElement *6 *2);
				}
				else{
					WebGL.mainContext.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,(this.settings.maxPartices-this._firstActiveElement)*6,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,this._firstActiveElement *6 *2);
					if (this._firstFreeElement > 0)
						WebGL.mainContext.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,this._firstFreeElement *6,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,0);
				}
				Stat.drawCall++;
			}
			this._drawCounter++;
		}
		return 1;
	}

	__proto.updateParticleForNative=function(){
		if (this.texture&&this.texture.getIsReady()){
			this.update(Laya.timer._delta);
			this.sv.u_CurrentTime=this._currentTime;
			if (this._firstNewElement !=this._firstFreeElement){
				this._firstNewElement=this._firstFreeElement;
			}
		}
	}

	__proto.getMesh=function(){
		return this._mesh;
	}

	__proto.getConchMesh=function(){
		return this._conchMesh;
	}

	__proto.getFirstNewElement=function(){
		return this._firstNewElement;
	}

	__proto.getFirstFreeElement=function(){
		return this._firstFreeElement;
	}

	__proto.getFirstActiveElement=function(){
		return this._firstActiveElement;
	}

	__proto.getFirstRetiredElement=function(){
		return this._firstRetiredElement;
	}

	__proto.setFirstFreeElement=function(_value){
		this._firstFreeElement=_value;
	}

	__proto.setFirstNewElement=function(_value){
		this._firstNewElement=_value;
	}

	__proto.addDrawCounter=function(){
		this._drawCounter++;
	}

	__proto.blend=function(){
		if (BlendMode.activeBlendFunction!==this._blendFn){
			var gl=WebGL.mainContext;
			gl.enable(/*laya.webgl.WebGLContext.BLEND*/0x0BE2);
			this._blendFn(gl);
			BlendMode.activeBlendFunction=this._blendFn;
		}
	}

	__proto.dispose=function(){
		if (!Render.isConchApp){
			this._mesh.releaseMesh();
		}
	}

	ParticleTemplate2D.activeBlendType=-1;
	return ParticleTemplate2D;
})(ParticleTemplateWebGL)


/**

*/
*/
*/