import * as React from 'react';
import PropTypes from 'prop-types';
import Dialog from '../dialogs/Dialog';
import Input from '../forms/Input';
import './DialogFilter.scss';


/**
 * Save filter dialog component
 * @module
 * @param {bool} isOpen - Is dialog open? 
 * @param {func} handleClose - Handle close function
 * @param {func} handleConfirm - Handle confirm function
 */
class SaveFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterName: ""
    }
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  handleConfirm = () => {
    this.props.handleConfirm(this.state.filterName);
    this.setState({ filterName: "" });
  }

  render() {
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.handleClose}
        onConfirm={this.handleConfirm}
        title="Uložiť filter"
      >
        <div className="save-filter-dialog">
          <div>Názov filtra</div>
          <Input
            name={'filterName'}
            onChange={this.handleChange}
            value={this.state['filterName']}
          />
        </div>
      </Dialog>
    );
  }
}

SaveFilter.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
}

export default SaveFilter;