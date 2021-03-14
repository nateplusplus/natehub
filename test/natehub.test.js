import { should } from 'chai';
import { JSDOM } from 'jsdom';
should();  // Modifies `Object.prototype`

describe('NateHub', function() {
    var NateHub;

    before( function() {
        const { window } = new JSDOM(`<!DOCTYPE html>
        <html>
            <head></head>
            <body></body>
        </html>`);
        global.window         = window;
        global.document       = window.document;
        global.customElements = window.customElements;
        global.HTMLElement    = window.HTMLElement;

        NateHub = require('../src/index.js').NateHub;
    });
    describe('connectedCallback', function() {

        it( 'should create a canvas', function() {
            const canvas = document.querySelector('canvas');
            canvas.tagName.should.equal('CANVAS');
        });

        it( 'should set browser focus to the canvas', function() {
            document.activeElement.tagName.should.equal('CANVAS');
        });

        it( 'should remove browser focus from the <body> element', function() {
            document.activeElement.tagName.should.not.equal('BODY');
        });
    });
});