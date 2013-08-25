/*!
	Autosize Test Suite
	(c) 2013 Jack Moore/Loran Kloeze - http://www.jacklmoore.com/autosize
        
	license: http://www.opensource.org/licenses/mit-license.php
        
*/
 
// Is AMD in place? If not, start the tests on script load
if (typeof window.define !== 'function'){
	testsWrapper();
}

function testsWrapper($){
        $ = ($ || window.$);
        
        QUnit.testDone(function(){
            // The mirrored textelement is not a child of the fixture
            // so we have to remove it whenever a test ends to keep
            // that test atomic
            $('textarea').remove();
            
            // The resize.autoresize event handler isn't removed whenever a 
            // test ends so we have to remove it manually to keep the tests 
            // atomic
            $(window).off('resize.autosize');
            
        });
    
	/*
	 *  Standard jQuery plugin tests
	 * 
	 */	
	module("Standard jQuery plugin tests"); 
        
        test("is available as method", function(){
            expect(1);
            
            ok(typeof $.fn.autosize === 'function', 'Plugin is not available');
        });
        
	test("is chainable", function(){
            expect(1);
            
            $('#qunit-fixture').append($('<textarea/>'));
            
            ok($('#qunit-fixture').autosize().css({}));  		
	});
	
	/*
	 *  Plugin specific tests - normal operation
	 * 
	 */
	module("Plugin specific test - normal operation"); 
        
	test("type a few chars", function(){
            expect(1);
            
            var $fixture = createFixture();
            applyPlugin($fixture);
            var initialHeight = $fixture.height();	
            typePlaceHolderText($fixture, 5);
            var newHeight = $fixture.height();

            equal(newHeight, initialHeight, 'Height of the textarea shouldn\'t change');
	});
	
	test("type enough chars to trigger resize", function(){
            expect(1);

            var $fixture = createFixture();
            applyPlugin($fixture);
            var initialHeight = $fixture.height();
            typePlaceHolderText($fixture, 100);
            var newHeight = $fixture.height();

            ok(newHeight > initialHeight, 'Height of the textarea should increase');
	});
        
        test("add autosize() to textarea already containing text", function(){
            expect(1);

            var $fixture = createFixture();
            var initialHeight = $fixture.height();
            applyPlaceHolderText($fixture, 100);
            applyPlugin($fixture);
            var newHeight = $fixture.height();

            ok(newHeight > initialHeight, 'Height of the textarea should increase');
	});
        
        test("manual trigger autosize.resize after val()", function(){
            expect(1);

            var $fixture = createFixture();
            applyPlugin($fixture);
            var initialHeight = $fixture.height();
            applyPlaceHolderText($fixture, 100);
            $fixture.trigger('autosize.resize');
            var newHeight = $fixture.height();

            ok(newHeight > initialHeight, 'Height of the textarea should increase');           
        });
        
        test("manual trigger autosize.resizeIncludeStyle after val()", function(){
            expect(1);

            var $fixture = createFixture();
            applyPlugin($fixture);
            var initialHeight = $fixture.height();
            applyPlaceHolderText($fixture, 100);
            $fixture.trigger('autosize.resizeIncludeStyle');
            var newHeight = $fixture.height();

            ok(newHeight > initialHeight, 'Height of the textarea should increase');            
        });
        
        test("remove autosize()from element", function(){
            expect(1);

            var $fixture = createFixture();
            applyPlugin($fixture);
            var initialHeight = $fixture.height();
            $fixture.trigger('autosize.destroy');
            typePlaceHolderText($fixture, 100);
            var newHeight = $fixture.height();

            equal(newHeight, initialHeight, 'Height textarea shouldn\'t change');
        });
        
        test("use another class for mirrored element", function(){
            expect(1);
            
            var $fixture = createFixture();
            applyPlugin($fixture, {
                'className': 'testClass'
            });
            
            equal($('textarea.testClass').length, 1, 'Mirror element .testClass not found');
        });
        
        test("append chars for extra whitespace", function(){
            expect(1);
            
            var $fixture = createFixture();
            $fixture.val('Lorem ipsum dolor');
            applyPlugin($fixture, {
                'append': '\n\n\n\n'
            });

            equal($('textarea.autosizejs').val(), 'Lorem ipsum dolor\n\n\n\n', 'Chars not appended to the mirror textarea');            
        });
        
        asyncTest("call callback function after resizing", function(){
            expect(1);
            
            var t = setTimeout(function(){
                ok(false, 'No callback called');
                start();                
            }, 150);            
            var $fixture = createFixture();
            applyPlugin($fixture, {
                'callback': function(){
                    ok(true);
                    clearTimeout(t);
                    start();
                }
            });         
            typePlaceHolderText($fixture, 100);
        });
        
        asyncTest("simulate window resize event", function(){
            expect(1);
            
            var $fixture = createFixture();
            applyPlaceHolderText($fixture, 800);
            applyPlugin($fixture);
            var initialHeight = $fixture.height();
            $fixture.width($fixture.width()*0.5);
            $(window).trigger('resize.autosize');
            var newHeight;
            setTimeout(function(){
                newHeight = $fixture.height();
                ok(newHeight > initialHeight, 'Height of the textarea should increase');
                start();
            }, 15); 
        });
        
        /*
	 *  Plugin specific tests - abnormal operation
	 * 
	 */
        module("Plugin specific test - abnormal operation");
        
        test("adding autosize() a second time", function(){
            expect(1);
            
            var $fixture = createFixture();
            $fixture.height(1);
            $fixture.val('Lorem ipsum dolor');
            applyPlugin($fixture);   
            $fixture.height(1);
            applyPlugin($fixture); //This shouldn't recalculate height
            
            equal($fixture.height(), 1, 'It\'s possible to attach autosize() again');            
        });
        
        
	/*
	 *  Helper functions
	 * 
	 */        
	function createFixture(){
            $('#qunit-fixture').append($('<textarea/>'));		
            return $('#qunit-fixture textarea').css({
                    'width': '150px',
                    'height': '40px',
                    'font-size': '13px'	
            });
	}
	
	function applyPlugin($fixture, options){
            $fixture.autosize(options);
	}
        
        //Simulate real keypress events on $fixture
        
        function typePlaceHolderText($fixture, nrChars) { 
            $fixture.simulate('key-sequence', {sequence: $.lorem({ type: 'characters',amount:nrChars})});
	}
        
        //Change val() of $fixture
        function applyPlaceHolderText($fixture, nrChars) {
            $fixture.val($.lorem({ type: 'characters',amount:nrChars}));
        }

}

