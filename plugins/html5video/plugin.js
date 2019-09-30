( function() {
	CKEDITOR.plugins.add( 'html5video', {
		requires: 'widget',
		lang: 'en',
		icons: 'html5video',
		init: function( editor ) {
			editor.widgets.add( 'html5video', {
				button: editor.lang.html5video.button,
				template: '<div class="ckeditor-html5-video"></div>',
				editables: {},
				/*
				 * Allowed content rules (http://docs.ckeditor.com/#!/guide/dev_allowed_content_rules):
				 *  - div-s with text-align,float,margin-left,margin-right inline style rules and required ckeditor-html5-video class.
				 *  - video tags with src and controls attributes.
				 */
				allowedContent: 'div(!ckeditor-html5-video){text-align,float,margin-left,margin-right}; video[src,controls,autoplay];',
				requiredContent: 'div(ckeditor-html5-video); video[src,controls];',
				upcast: function( element ) {
					return element.name === 'div' && element.hasClass( 'ckeditor-html5-video' );
				},
				dialog: 'html5video',
				init: function() {
					var src = '';
					var autoplay = '';
					var poster = '';
					var align = this.element.getStyle( 'text-align' );

					// If there's a child (the video element)
					if ( this.element.getChild( 0 ) ) {
						// get it's attributes.
						src = this.element.getChild( 0 ).getAttribute( 'src' );
						autoplay = this.element.getChild( 0 ).getAttribute( 'autoplay' );
						poster = this.element.getChild( 0 ).getAttribute( 'poster' );
					}

					if ( src ) {
						this.setData( 'src', src );

						if ( align ) {
							this.setData( 'align', align );
						} else {
							this.setData( 'align', 'none' );
						}

						if ( autoplay ) {
							this.setData( 'autoplay', 'yes' );
						}
						
						if( poster ) {
							this.setData( 'poster', poster );
						}
					}
				},
				data: function() {
					// If there is an video source
					if ( this.data.src ) {
						// and there isn't a child (the video element)
						if ( !this.element.getChild( 0 ) ) {
							// Create a new <video> element.
							var videoElement = new CKEDITOR.dom.element( 'video' );
							// Set the controls attribute.
							videoElement.setAttribute( 'controls', 'controls' );
							// Append it to the container of the plugin.
							this.element.append( videoElement );
						}
						this.element.getChild( 0 ).setAttribute( 'src', this.data.src );
						
						// Set thumbnail image path
						var srcPath = this.data.src.substr(0, this.data.src.lastIndexOf('.')) || this.data.src;
						var posterStr = srcPath + '_Thumb_Image.jpg';
						this.element.getChild( 0 ).setAttribute( 'poster', posterStr );
					}

					this.element.removeStyle( 'float' );
					this.element.removeStyle( 'margin-left' );
					this.element.removeStyle( 'margin-right' );

					if ( this.data.align === 'none' ) {
						this.element.removeStyle( 'text-align' );
					} else {
						this.element.setStyle( 'text-align', this.data.align );
					}

					if ( this.data.align === 'left' ) {
						this.element.setStyle( 'float', this.data.align );
						this.element.setStyle( 'margin-right', '10px' );
					} else if ( this.data.align === 'right' ) {
						this.element.setStyle( 'float', this.data.align );
						this.element.setStyle( 'margin-left', '10px' );
					}

					if ( this.element.getChild( 0 ) ) {
						if ( this.data.autoplay === 'yes' ) {
							this.element.getChild( 0 ).setAttribute( 'autoplay', 'autoplay' );
						} else {
							this.element.getChild( 0 ).removeAttribute( 'autoplay' );
						}
					}
				}
			} );

			if ( editor.contextMenu ) {
				editor.addMenuGroup( 'html5videoGroup' );
				editor.addMenuItem( 'html5videoPropertiesItem', {
					label: editor.lang.html5video.videoProperties,
					icon: 'html5video',
					command: 'html5video',
					group: 'html5videoGroup'
				});

				editor.contextMenu.addListener( function( element ) {
					if ( element &&
						 element.getChild( 0 ) &&
						 element.getChild( 0 ).hasClass &&
						 element.getChild( 0 ).hasClass( 'ckeditor-html5-video' ) ) {
						return { html5videoPropertiesItem: CKEDITOR.TRISTATE_OFF };
					}
				});
			}

			CKEDITOR.dialog.add( 'html5video', this.path + 'dialogs/html5video.js' );
		}
	} );
} )();
