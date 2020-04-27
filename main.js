function on_posts(request, reply){
	Serial.println("DP - url: " + request.url() + ", ip: " + request.ip());
	reply.setContent("posted data ignored ...");
	reply.setStatus(200);
	reply.end();
}

function on_gets(request, reply){
	Serial.println("DG - url: " + request.url() + ", ip: " + request.ip());
	url = requst.url();
	if(url.lastIndexOf('.') != -1){
		setContentToFile(request.url());
	}
	else {
		setContent("'"+url+"' is inaccessible here...");
		reply.setStatus(404);
	}
	reply.end();
}

function on_files(request, reply){
	Serial.println("F - url: " + request.url() + ", ip: " + request.ip());
	
	reply.setToFile(request.url());
	reply.end();
}

function setup() {
	var server = new RealHTTPServer();
	server.start(8765);
	Serial.println("Running: " + server.isListening());

	server.on_contacts = function(request, reply){
		Serial.println("C - url: " + request.url() + ", ip: " + request.ip());
		attachInterrupt(A0, function() {
			reply.setContent(Math.floor(map(analogRead(A0), 0, 1023, 0, 100) + 0.5)+"");
			reply.setStatus(200);
			reply.end();
		});
		
	}
	
	server.on_contacts2 = function(request, reply){
		Serial.println("C - url: " + request.url() + ", ip: " + request.ip());
		attachInterrupt(A2, function() {
			reply.setContent(Math.floor(map(analogRead(A0), 0, 1023, 0, 100) + 0.5)+"");
			reply.setStatus(200);
			reply.end();
		});
		
	}
	server.on_contacts3 = function(request, reply){
		Serial.println("C - url: " + request.url() + ", ip: " + request.ip());
		attachInterrupt(A3, function() {
			reply.setContent(Math.floor(map(analogRead(A0), 0, 1023, 0, 100) + 0.5)+"");
			reply.setStatus(200);
			reply.end();
		});
		
	}
	server.on_services = function(request, reply){
		Serial.println("S - url: " + request.url() + ", ip: " + request.ip());
		reply.setContent("reached services ...");
		reply.setStatus(200);
		reply.end();
	}

	server.route("/s1", ["gEt", "POST"], server.on_contacts);
	server.route("/s2", ["gEt", "POST"], server.on_contacts2);
	server.route("/s3", ["gEt", "POST"], server.on_contacts3);
	server.route("/*", ["GET"], on_files);
	server.route("/services/*", ["Post","get"], server.on_services);
	server.route("*", ["GET"], on_gets);
	server.route("*", ["POST"], on_posts);
}
