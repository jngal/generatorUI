import React from 'react';
import Button from '../buttons/Button';
import { buildUrl } from '../utils/helper';

/**
 * File cell
 * @module
 * @param {func} onClick - Function invoked on click
 */
export function FileCell({ onClick }) {
  return (props) => {
    // const total = products.reduce((acc, current) => acc + current[props.field], 0);
    return (
      <td colSpan={props.colSpan} style={props.style}>
        <Button
          onClick={() => onClick(props.field, props.dataItem)}
          primary={true}
          imageUrl={buildUrl('assets/notify_priloha.svg')}
          title="Priloha"
        />
      </td>
    );
  }
}

export default FileCell;