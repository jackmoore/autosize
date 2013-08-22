requirejs.config({
    "baseUrl": "amd",
    "paths": {
      "app": "../app",
      "jquery": "http://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min",
	  "jquery.autosize": "../../jquery.autosize",
	  "tests": "../tests"
    }
});

requirejs(["../tests_amd"]);