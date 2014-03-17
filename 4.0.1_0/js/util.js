var Debug = {};
Debug.mode = true,
Debug.print = function (log){
	if(this.mode){
		console.log(log);
	}
};