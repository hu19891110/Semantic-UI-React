import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import {
  AutoControlledComponent as Component,
  customPropTypes,
  getElementType,
  getUnhandledProps,
  META,
} from '../../lib'
import Menu from '../../collections/Menu/Menu'
import TabPane from './TabPane'

/**
 * A Tab is a hidden section of content activated by a Menu.
 * @see Menu
 * @see Segment
 */
class Tab extends Component {
  static propTypes = {
    /** An element type to render as (string or function). */
    as: customPropTypes.as,

    /** The initial activeIndex. */
    defaultActiveIndex: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    /** Index of the currently active tab. */
    activeIndex: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    /** Shorthand props for the Menu. */
    menu: PropTypes.object,

    /**
     * Called on tab change.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props and proposed new activeIndex.
     * @param {object} data.activeIndex - The new proposed activeIndex.
     */
    onTabChange: PropTypes.func,

    /**
     * Array of objects describing each Menu.Item and Tab.Pane:
     * {
     *   menuItem: 'Home',
     *   render: () => <Tab.Pane>Welcome!</Tab.Pane>
     * }
     */
    panes: PropTypes.arrayOf(PropTypes.shape({
      content: customPropTypes.contentShorthand,
      menuItem: customPropTypes.itemShorthand,
      render: PropTypes.func,
    })),

    /** A Tab can render only active pane. */
    renderActiveOnly: PropTypes.bool,
  }

  static autoControlledProps = [
    'activeIndex',
  ]

  static defaultProps = {
    menu: { attached: true, tabular: true },
    renderActiveOnly: true,
  }

  static _meta = {
    name: 'Tab',
    type: META.TYPES.MODULE,
  }

  static Pane = TabPane

  getInitialAutoControlledState() {
    return { activeIndex: 0 }
  }

  handleItemClick = (e, { index }) => {
    _.invoke(this.props, 'onTabChange', e, { ...this.props, activeIndex: index })
    this.trySetState({ activeIndex: index })
  }

  renderItems() {
    const { panes, renderActiveOnly } = this.props
    const { activeIndex } = this.state

    if (renderActiveOnly) return _.invoke(_.get(panes, `[${activeIndex}]`), 'render', this.props)
    return _.map(panes, (pane, index) => TabPane.create(pane, {
      overrideProps: {
        active: index === activeIndex,
      },
    }))
  }

  renderMenu() {
    const { menu, panes } = this.props
    const { activeIndex } = this.state

    return Menu.create(menu, {
      overrideProps: {
        items: _.map(panes, 'menuItem'),
        onItemClick: this.handleItemClick,
        activeIndex,
      },
    })
  }

  render() {
    const menu = this.renderMenu()
    const rest = getUnhandledProps(Tab, this.props)
    const ElementType = getElementType(Tab, this.props)

    return (
      <ElementType {...rest}>
        {menu.props.attached !== 'bottom' && menu}
        {this.renderItems()}
        {menu.props.attached === 'bottom' && menu}
      </ElementType>
    )
  }
}

export default Tab
