<?php

namespace Google\Site_Kit\Core\Tags;

use Google\Site_Kit\Core\Util\Method_Proxy_Trait;

class GTag {
	use Method_Proxy_Trait;

	const HANDLE = 'google_gtagjs';

	private $tags     = array();
	private $commands = array();

	public function register() {
		add_action( 'wp_enqueue_scripts', $this->get_method_proxy( 'enqueue_gtag_script' ), 20 );

		add_filter(
			'wp_resource_hints',
			function ( $urls, $relation_type ) {
				if ( 'dns-prefetch' === $relation_type ) {
					$urls[] = '//www.googletagmanager.com';
				}

				return $urls;
			},
			10,
			2
		);
	}

	public function add_tag( $tag_id, $config = array() ) {
		$this->tags[] = array(
			'tag_id' => $tag_id,
			'config' => $config,
		);
	}

	public function add_command( $command, $parameters, $position = 'after' ) {
		$this->commands[] = array(
			'command'    => $command,       // e.g. 'config', 'event', etc.
			'parameters' => $parameters,    // e.g. array( 'send_to', 'AW-123456789' )
			'position'   => $position,      // e.g. 'after', 'before'. This determines the position of the inline script relative to the gtag.js script.
		);
	}

	protected function enqueue_gtag_script() {
		// $this->tags and $this->commands will be populated via this action's handlers.
		do_action( 'googlesitekit_setup_gtag', $this );

		if ( empty( $this->tags ) ) {
			return;
		}

		// Load the GTag scripts using the first tag ID - it doesn't matter which is used, all registered tags will be setup with a
		// config command regardless of which is used to load the source.
		$gtag_src = 'https://www.googletagmanager.com/gtag/js?id=' . rawurlencode( $this->tags[0]['tag_id'] );

		// phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
		wp_enqueue_script( self::HANDLE, $gtag_src, false, null, false );
		wp_script_add_data( self::HANDLE, 'script_execution', 'async' );

		// Note that `gtag()` may already be defined via the `Consent_Mode` output, but this is safe to call multiple times.
		wp_add_inline_script( self::HANDLE, 'window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}' );
		wp_add_inline_script( self::HANDLE, 'gtag("js", new Date());' );
		wp_add_inline_script( self::HANDLE, 'gtag("set", "developer_id.dZTNiMT", true);' ); // Site Kit developer ID.

		foreach ( $this->tags as $tag ) {
			wp_add_inline_script( self::HANDLE, $this->get_gtag_call_for_tag( $tag ) );
		}

		foreach ( $this->commands as $command ) {
			wp_add_inline_script( self::HANDLE, $this->get_gtag_call_for_command( $command ), $command['position'] );
		}

		$filter_google_gtagjs = function ( $tag, $handle ) {
			if ( self::HANDLE !== $handle ) {
				return $tag;
			}

			$snippet_comment_begin = sprintf( "\n<!-- %s -->\n", esc_html__( 'Google tag (gtag.js) snippet added by Site Kit', 'google-site-kit' ) );
			$snippet_comment_end   = sprintf( "\n<!-- %s -->\n", esc_html__( 'End Google tag (gtag.js) snippet added by Site Kit', 'google-site-kit' ) );

			return $snippet_comment_begin . $tag . $snippet_comment_end;
		};

		add_filter( 'script_loader_tag', $filter_google_gtagjs, 20, 2 );
	}

	protected function get_gtag_call_for_tag( $tag ) {
		return empty( $tag['config'] )
			? sprintf( 'gtag("config", "%s");', esc_js( $tag['tag_id'] ) )
			: sprintf( 'gtag("config", "%s", %s);', esc_js( $tag['tag_id'] ), wp_json_encode( $tag['config'] ) );
	}

	protected function get_gtag_call_for_command( $command ) {
		$gtag_args = array_merge( array( $command['command'] ), $command['parameters'] );
		$gtag_args = array_map(
			function( $arg ) {
				return wp_json_encode( $arg );
			},
			$gtag_args
		);

		return sprintf( 'gtag(%s);', implode( ',', $gtag_args ) );
	}
}
