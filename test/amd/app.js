/*!
	Autosize Test Suite
	(c) 2013 Jack Moore/Loran Kloeze - http://www.jacklmoore.com/autosize
        
	license: http://www.opensource.org/licenses/mit-license.php
        
*/

requirejs.config({
    baseUrl: "amd",
    urlArgs: "bust=" + (new Date()).getTime(), // Prevent caching
    paths: {
      "jquery": "http://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min",
	  "jquery.autosize": "../../jquery.autosize",
	  "bililiterange": "../lib/bililiteRange",
	  "jquery.simulate": "../lib/jquery.simulate",
	  "jquery.simulate.key-sequence": "../lib/jquery.simulate.key-sequence",
          "jquery.lorem": "../lib/jquery.lorem",
	  "tests": "../tests"
    },
	shim: {
		"jquery.simulate": ["jquery"],
		"jquery.simulate.key-sequence": ["jquery.simulate", "bililiterange"],
                "jquery.lorem": ["jquery"]
		
	}
});

requirejs(["jquery", "jquery.autosize", "jquery.simulate.key-sequence", "jquery.lorem", "../tests"], function($){
		testsWrapper($);
});