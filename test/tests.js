/*!
 * autosize Test Suite
 * 
 * Copyright 2013 Loran Kloeze - Invetek
 * Released under the MIT license.
 * 
 */

function testsWrapper(){ 
	/*
	 *  Standard jQuery plugin tests
	 * 
	 */
	
	module("Standard jQuery plugin tests"); 
	test("is chainable", function(){
		expect(1);
		$('#qunit-fixture').append($('<textarea/>'));	
		ok($('#qunit-fixture textarea').autosize().autosize());  
		
	});

}

// Is a module loader in place? If not, start the tests here
if (typeof window.define !== 'function'){
	testsWrapper();
}
