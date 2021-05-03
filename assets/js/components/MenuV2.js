/**
 * Menu component.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { useMount } from 'react-use';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import useMergedRef from '@react-hook/merged-ref';

/**
 * WordPress dependencies
 */
import { forwardRef, useCallback, useRef, useImperativeHandle, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { MDCMenu } from '../material-components';

const MenuV2 = forwardRef( ( {
	children,
	className,
	menuItems,
	onSelected,
	id,
}, ref ) => {
	const [ menu, setMenu ] = useState( null );
	const menuRef = useRef( null );
	const mergedRefs = useMergedRef( ref, menuRef );
	const handleMenuSelected = useCallback( ( event ) => {
		const { detail: { index } } = event;

		onSelected( index, event );
	}, [ onSelected ] );

	useMount( () => {
		if ( ! menuRef?.current ) {
			return;
		}

		const menuComponent = new MDCMenu( menuRef.current );
		menuComponent.listen( 'MDCMenu:selected', handleMenuSelected );
		setMenu( menuComponent );

		return () => {
			menuComponent.unlisten( 'MDCMenu:selected', handleMenuSelected );
		};
	} );

	const handleOpenMenu = () => {
		if ( menu ) {
			menu.open = true;
			menu.setDefaultFocusState( 1 );
		}
	};

	useImperativeHandle( ref, () => ( {
		openMenu: handleOpenMenu,
	} ) );

	return (
		<div
			className={ classnames( 'mdc-menu', 'mdc-menu-surface', className ) }
			ref={ mergedRefs }
		>
			<ul
				// aria-hidden={ ! menuOpen }
				aria-orientation="vertical"
				className="mdc-list"
				id={ id }
				role="menu"
				tabIndex="-1"
			>
				{ ! children && menuItems.map( ( item, index ) => (
					<li
						key={ index }
						className="mdc-list-item"
						role="menuitem"
					>
						<span className="mdc-list-item__text">{ item }</span>
					</li>
				) ) }
				{ children }
			</ul>
		</div>
	);
} );

MenuV2.displayName = 'Menu';

MenuV2.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
	menuItems: PropTypes.array,
	id: PropTypes.string.isRequired,
	onSelected: PropTypes.func,
};

MenuV2.defaultProps = {
	onSelected: () => {},
};

export default MenuV2;

