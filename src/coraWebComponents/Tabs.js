import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@progress/kendo-react-buttons';
import eventEmitter from './utils/eventEmitter';
import './Tabs.scss';

/**
 * Tabs component
 * @module
 * @param {array} children - Children
 */
class TabsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 0
    }
  }

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  }
  
  handleChangeTab = ({name, tab}) => {
    if (!this.props.name || name === this.props.name) {
      this.setState({ tab: tab })
    }
  }

  componentDidMount() {
    eventEmitter.on('CHANGE_TAB', this.handleChangeTab);
  }

  componentWillUnmount() {
    eventEmitter.removeAllListeners('CHANGE_TAB');
  }

  render() {
    let tabs = this.props.children;

    return (
      <div className="card">
        <div className="card-header">
          {tabs.map((tab, index) =>
              <span key={index}>
                <Button
                  primary={index === this.state.tab}
                  onClick={e => this.handleChange('tab', index)}
                >
                  {tab.props.title}
                </Button>
              </span>
            )
          }
        </div>
        <div className="card-body">
          {tabs.map((tab, index) =>
            <div
              key={index}
              className={index === this.state.tab ? 'tab visible mt-3' : 'tab hidden'}
            >
              {tab}
            </div>
          )}
        </div>
      </div>
    );
  }
}

TabsComponent.propTypes = {
  children: PropTypes.array.isRequired
};

export default TabsComponent;
