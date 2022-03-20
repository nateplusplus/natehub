export default class NatehubModal extends HTMLElement {
    connectedCallback() {
        this.closeButton = this.querySelector( '.modal__close' );

        this.bindEvents();
    }

    bindEvents() {
        this.addEventListener( 'focusin', this.handleOpen.bind( this ) );
        this.addEventListener( 'focusout', this.handleFocusOut.bind( this ) );
        this.addEventListener( 'keydown', this.handleKeydown.bind( this ) );
        this.closeButton.addEventListener( 'click', this.handleClose.bind( this ) );
        this.closeButton.addEventListener( 'keydown', this.handleKeydown.bind( this ) );
    }

    handleFocusOut( event ) {
        if ( ! this.contains(document.activeElement) && ! this.contains(event.relatedTarget) ) {
            this.handleClose( event );
        }
    }

    handleKeydown( event ) {
        const closeKeys = [ 'Enter', ' ' ];

        if ( event.key === 'Escape' ) {
            this.handleClose( event );
        } else if ( event.target === this.closeButton && closeKeys.includes( event.key ) ) {
            this.handleClose( event );
        }
    }

    handleOpen(event) {
        if ( this.getAttribute( 'aria-hidden' ) === 'true' ) {
            this.setAttribute( 'aria-hidden', false );
            window.setTimeout( () => this.classList.add( 'open' ), 500 );
        }
    }

    handleClose(event) {
        if ( this.getAttribute( 'aria-hidden' ) === 'false' ) {
            this.classList.remove( 'open' )
            window.setTimeout( () => this.setAttribute( 'aria-hidden', true ), 500 );
        }
    }
}